import {
  PivotOptionsType,
  DataRecordType,
  getValueType,
  getFieldConfigType,
  FieldType
} from './interface'
import {RootName} from './constant'


class Node {
  type: string;
  key: string;
  value: any;
  children: Map<string, Node>;
  parentData: Node | undefined;
  extra: any;

  constructor(key, value, type = 'dimension', parentData?: Node, extra?: any) {
    this.type = type;
    this.key = key;
    this.value = value;
    this.children = new Map();
    this.parentData = parentData;
    this.extra = extra;
  }

  toJsonTree(customNode) {
    const json = {};
    const dfs = (context, data, parentData = null) => {
      customNode = customNode || ((context) => {
        return {
          key: context.key,
          value: context.value,
          type: context.type,
          extra: context.extra
        }
      })
      data = {
        ...data,
        ...customNode(context, parentData)
      }
      data.children = [...context.children.values()];
      if (data.children && data.children.length > 0) {
        data.children = data.children.map((child) => {
          return dfs(child, {}, data)
        })
      }
      return data;
    }
    return dfs(this, json);
  }

  toTableData(): Array<DataRecordType> {
    const tableData: Array<DataRecordType> = [];
    const compose = (nodes: Map<string, Node>, rawData: DataRecordType = {}) => {
      for (const [key, node] of nodes) {
        rawData.$key = rawData.$key || [];
        const newRawData = {
          ...rawData,
          $key: [...rawData.$key]
        }
        newRawData.$key.push(key)
        newRawData[node.key] = node.value;
        if(node.extra){
          Object.assign(newRawData, node.extra);
        }

        if (node.children && node.children.size > 0) {
          compose(node.children, newRawData);
        } else {
          tableData.push(newRawData);
        }

      }
    }

    compose(this.children)
    return tableData
  }
}

export interface DataCollectionType {
  rowData: Node,
  columnData: Node,
  getValue: getValueType,
  getFieldConfig: getFieldConfigType
}

class FieldConfig {
  private _data: Map<string, FieldType>

  constructor() {
    this._data = new Map();
  }

  add(data: FieldType | Array<FieldType>) {
    if (Array.isArray(data)) {
      data.forEach(item => {
        this._data.set(item.dataIndex, {
          ...item
        });
      })
    } else this._data.set(data.dataIndex, data)
  }

  get(key: string): FieldType | undefined {
    return this._data.get(key)
  }

  toJson() {
    return [...this._data.values()]
  }
}


function parseFields(options: PivotOptionsType) {
  const {
    dataSource,
    dimensionsConfig,
    measuresConfig,
    rows,
    cols
  } = options;
  const fieldConfigInst = new FieldConfig();
  fieldConfigInst.add(dimensionsConfig.map(item => {
    return {
      type: 'dimension',
      ...item
    }
  }));
  fieldConfigInst.add(measuresConfig);

  const dataMap = {};
  const dimensionKeys = [
    ...[...rows, ...cols].filter(key => {
      return fieldConfigInst.get(key) ? true : false
    }),
  ]

  function getKey(record) {
    return dimensionKeys.map(dataIndex => {
      return dataIndex + '_' + record[dataIndex]
    }).join('/')
  }

  dataSource.forEach(record => {
    const key = getKey(record);
    dataMap[key] = record;
  })

  fieldConfigInst.add({
    type: '$measureValue',
    dataIndex: '$measureValue',
    title: '指标值',
  });

  fieldConfigInst.add({
    dataIndex: '$measure',
    title: 'measures',
    extraField: {
      dataIndex: '$measure_name',
      title: '指标列表'
    }
  })
  const getValue = <T>(dimensionData: string[], measureKey?: string): T => {
    const rawData = dataMap[getKey(dimensionData)];
    if (measureKey) {
      return rawData[measureKey]
    }
    return rawData
  }

  return {
    getValue,
    getFieldConfig: (dimensionKey: string): FieldType | undefined => {
      const re = fieldConfigInst.get(dimensionKey);
      return re;
    },
  };
}

function arrMove(arr: Array<any>, fromIndex: number, toIndex: number) {
  arr = [...arr];
  arr.splice(toIndex, 0, arr.splice(fromIndex, 1)[0]);
  return arr;
}

function pivotDataCore(options: PivotOptionsType): DataCollectionType {
  const {
    measuresConfig,
    dataSource,
    rows,
    cols
  } = options;
  const { getValue, getFieldConfig } = parseFields(options);


  function toTreeData(data, dimensions, measures, enableChangeOrder: boolean = true) {
    let measureIndex = dimensions.indexOf('$measure');
    let isNeedChangeOrder;
    const originDimensions = [...dimensions]
    if (enableChangeOrder) {
      isNeedChangeOrder = measureIndex !== -1 && measureIndex !== dimensions.length - 1;
      if (isNeedChangeOrder) {
        dimensions = arrMove(dimensions, measureIndex, dimensions.length - 1);
      }
    }



    const tree = new Node(RootName, RootName, 'dimension')

    const getMapKey = (key, value) => {
      return key + '-' + value;
    }

    data.forEach(record => {
      let node = tree;
      for (let i = 0; i < dimensions.length; i++) {
        const key = dimensions[i];
        const fieldConfig = getFieldConfig(key) as FieldType;
        let extraField: string = '';
        
        if(fieldConfig && fieldConfig.extraField && fieldConfig.extraField.dataIndex){
          extraField = fieldConfig.extraField.dataIndex;
        }
        const value = record[dimensions[i]];
        if (key === '$measure' && enableChangeOrder) {  //指标特殊处理
          measures.forEach(measureConfig => {
            const extra = {};
            const key = '$measure';
            const value = measureConfig.dataIndex;
            const mapKey = getMapKey(key, value);
            if (!node.children.has(mapKey)) {
              if(extraField){
                extra[extraField] = measureConfig.title;
              }
              
              const childNode = new Node(key, value, 'measure', node, extra);
              node.children.set(mapKey, childNode);
            }
          })
          return;
        }

        if (key === '$measureValue') {
          return;
        }

        const extra = {};
        if(extraField){
          extra[extraField] = record[extraField];
        }

        const mapKey = getMapKey(key, value);
        if (node.children.has(mapKey)) {
          node = <Node>node.children.get(mapKey);
        } else {
          const childNode = new Node(key, value, 'dimension', node, extra);
          node.children.set(mapKey, childNode);
          node = childNode;
        }

      }
    })
    if (isNeedChangeOrder) {
      let tableData = tree.toTableData();
      let n = toTreeData(tableData, originDimensions, measures, false);
      return n;
    }
    return tree;
  }

  const rowData = toTreeData(dataSource, rows, measuresConfig);
  const columnData = toTreeData(dataSource, cols, measuresConfig);

  return {
    rowData: rowData,
    columnData: columnData,
    getValue,
    getFieldConfig
  }
}

export default pivotDataCore