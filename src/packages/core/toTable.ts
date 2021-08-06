import {
  PivotOptionsType,
  FieldType
}from './interface' 
import {DataCollectionType} from './core'

interface TableDataType{
  columns: any,
  dataSource: any
}

const toTable = (PivotOptions: PivotOptionsType)=>(DataCollection: DataCollectionType) :TableDataType => {
  const columns:Array<FieldType> = [];
  const {rows} = PivotOptions;
  const {getValue, getFieldConfig, columnData, rowData} = DataCollection;
  rows.forEach(rowKey => {
    const config = <FieldType>getFieldConfig(rowKey);
    if (rowKey === '$measure') {
      columns.push({
        dataIndex: '$index_name',
        title: config.title
      })
    } else
      columns.push({
        dataIndex: rowKey,
        title: config.title
      })

  })

  const maxDeepLevelColumns: FieldType[] = [];

  const treeColumns = columnData.toJsonTree((node, parentData) => {
    let dataIndex = node.key + '@' + node.value;
    if (parentData && parentData.dataIndex !== 'root@root') {
      dataIndex = parentData.dataIndex + '||' + (dataIndex + '@' + node.value)
    }

    let dimensions = parentData ? [...parentData.dimensions] : [];
    if (node.key === 'root') {
      dimensions = [];
    } else {
      dimensions.push([
        node.key,
        node.value
      ])
    }

    const column = {
      dimensions,
      dataIndex,
      title: node.value,
      $type: node.type,
    }

    if (!node.children || node.children.size === 0) {
      maxDeepLevelColumns.push(column)
    }

    return column;
  }).children;

  if (treeColumns.length === 0) {
    treeColumns.push({
      title: '指标值',
      dataIndex: '$measureValue'
    });

    maxDeepLevelColumns.push({
      title: '指标值',
      dataIndex: '$measureValue'
    });
  }

  treeColumns.forEach(p => {
    columns.push(p)
  })

  const dataSource = rowData.toTableData();

  dataSource.forEach((record, index) => {
    if(!record)return;
    record.key = record.$key ? record.$key.join('/') : (index + '');
    if (rows.includes('$measure') && record.$measure) {
      const info = getFieldConfig(record.$measure);
      if(info){ 
        record.$index_name = info.title;
      }
    }
    let measureKey: string|null = null;
    maxDeepLevelColumns.forEach(columnConfig => {
      const { dimensions } = columnConfig;
      if(!dimensions)return;
      const columnRecord = dimensions.reduce((prev, curr) => {
        let fieldConfig = (getFieldConfig(curr[0]) as FieldType) ;
        if (!measureKey && fieldConfig && fieldConfig.type !== 'dimension') {
          measureKey =fieldConfig.dataIndex;
        }
        prev[curr[0]] = curr[1];
        return prev;
      }, {});
      if (columnConfig.dataIndex === '$measureValue') {
        if(record['$measure']){
          record[columnConfig.dataIndex] = getValue(
            {
              ...record,
              ...columnRecord
            },
            record['$measure']
          )
        }
       

      } else if(measureKey){
        record[columnConfig.dataIndex] = getValue(
          {
            ...record,
            ...columnRecord
          },
          measureKey
        )
      }else if(record.$measure){
        record[columnConfig.dataIndex] = getValue(
          {
            ...record,
            ...columnRecord
          },
          record.$measure
        )
      }
    })

  })

  return {
    columns,
    dataSource: dataSource
  }
}

export default toTable;