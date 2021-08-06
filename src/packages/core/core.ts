import {
  PivotOptionsType,
  DataRecordType,
  getValueType,
  getFieldConfigType,
  FieldType
}from './interface' 

class Node{
  type: string;
  key: string;
  value: string|number;
  children: Map<string, Node>;
  parentData: Node|undefined;

  constructor(key, value, type = 'dimension', parentData ?:Node){
    this.type = type;
    this.key = key;
    this.value = value;
    this.children = new Map();
    this.parentData = parentData;
  }

  toJsonTree(customNode){
    const json = {};
    const dfs = (context, data, parentData = null)=>{
      customNode = customNode || ((context)=>{
        return {
          key : context.key,
          value : context.value,
          type : context.type,
        }
      })
      data = {
        ...data,
        ...customNode(context, parentData)
      }
      data.children = [...context.children.values()];
      if(data.children && data.children.length > 0){
        data.children = data.children.map((child)=>{
          return dfs(child, {}, data)
        })
      }
      return data;
    }
    return dfs(this, json);
  }

  toTableData() :Array<DataRecordType>{
    const tableData :Array<DataRecordType> = [];
    const compose = (nodes: Map<string, Node>, rawData:DataRecordType = {})=>{
      for(const [key, node] of nodes){
        rawData.$key = rawData.$key || [];
        const newRawData = {
          ...rawData,
          $key: [...rawData.$key]
        }
        newRawData.$key.push(key)
        newRawData[node.key] = node.value;
        
        if(node.children && node.children.size > 0){
          compose(node.children, newRawData);
        }else{
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
  getValue: getValueType ,
  getFieldConfig: getFieldConfigType
}

class FieldConfig{
  private _data: Map<string, FieldType>

  constructor(){
    this._data = new Map();
  }

  add(data: FieldType| Array<FieldType>){
    if(Array.isArray(data)){
      data.forEach(item=>{
        this._data.set(item.dataIndex, {
          ...item
        });
      })
    }else this._data.set(data.dataIndex, data)
  }

  get(key : string): FieldType|undefined{
    return this._data.get(key)
  }

  toJson(){
    return [...this._data.values()]
  }
}


function parseFields(options : PivotOptionsType){
  const {
    dataSource, 
    dimensionsConfig, 
    measuresConfig, 
    rows, 
    cols
  } = options;
  const fieldConfigInst = new FieldConfig();
  fieldConfigInst.add(dimensionsConfig.map(item=> {
    return {
      type: 'dimension',
      ...item
    }
  }));
  fieldConfigInst.add(measuresConfig);

  const dataMap = {};
  const dimensionKeys = [
    ...[...rows, ...cols].filter(key=>{
      return fieldConfigInst.get(key) ? true : false
    }),
  ]

  function getKey (record){
    return dimensionKeys.map(dataIndex=>{
      return dataIndex + '_' + record[dataIndex]
    }).join('/')
  }

  dataSource.forEach(record=>{
    const key = getKey(record);
    dataMap[key] = record;
    dimensionKeys.forEach(dimensionKey=>{
      const dimensionItem =  fieldConfigInst.get(dimensionKey);
      if(!dimensionItem)throw new Error('error');
      dimensionItem.$value = dimensionItem.$value || new Set();
      if(!dimensionItem.$value.has(record[dimensionKey])){
        dimensionItem.$value.add(record[dimensionKey]);
      }
    })
  })

  fieldConfigInst.add({
    type: '$measureValue',
    dataIndex: '$measureValue',
    title: '指标值',
  });

  fieldConfigInst.add({
    dataIndex: '$measure',
    title: '指标列表',
    $value: new Set(measuresConfig.map(item=> item.dataIndex))
  })
  const getValue= <T>(dimensionData: string[], measureKey: string) : T=>{
    const rawData = dataMap[getKey(dimensionData)];
    if(measureKey){
      return rawData[measureKey]
    }
    return rawData
  }

  return {
    getValue,
    getFieldConfig: (dimensionKey : string ) : FieldType | undefined=> {
      const re = fieldConfigInst.get(dimensionKey);
      return re;
    },
  };
}

function toTreeData(data, dimensions, measures, type = 'column'){
  const tree =  new Node('root', 'root', 'dimension')

  const getMapKey = (key, value)=>{
    return key + '//' + value;
  }

  data.forEach(record=>{
    let node = tree;
    for(let i=0; i< dimensions.length; i++){
      const key = dimensions[i];
      const value = record[dimensions[i]];
      if(key === '$measure'){  //指标特殊处理
        if(type === 'column'){
          measures.forEach(measureConfig =>{
            const key = measureConfig.dataIndex;
            const value = measureConfig.title;
            const mapKey = getMapKey(key, value);
            if(!node.children.has(mapKey)){
              const childNode = new Node(key, value, 'measure', node);
              node.children.set(mapKey, childNode);
            }
          })
        }else if(type === 'row'){
          measures.forEach(measureConfig =>{
            const key = '$measure';
            const value = measureConfig.dataIndex;
            const mapKey = getMapKey(key, value);
            if(!node.children.has(mapKey)){
              const childNode = new Node(key, value, 'dimension', node);
              node.children.set(mapKey, childNode);
            }
          })
        }
        
        //目前仅支持配置指标在最后一位；
        return;
      }

      if(key === '$measureValue'){
        return;
      }

      const mapKey = getMapKey(key, value);
      if(node.children.has(mapKey)){
        node = <Node>node.children.get(mapKey);
      }else{
        const childNode = new Node(key, value, 'dimension' ,node);
        node.children.set(mapKey, childNode);
        node = childNode;
      }
      
    }
  })
  return tree;
}

function pivotDataCore(options: PivotOptionsType) :DataCollectionType {
  const {
    measuresConfig,
    dataSource,
    rows,
    cols
  } = options;
  const {getValue, getFieldConfig} = parseFields(options);
  
  const rowData = toTreeData(dataSource, rows, measuresConfig, 'row');
  const columnData = toTreeData(dataSource, cols, measuresConfig, 'column');

  return {
    rowData: rowData,
    columnData: columnData,
    getValue,
    getFieldConfig
  }
}

export default pivotDataCore