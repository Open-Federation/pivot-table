import {
  PivotOptionsType,
  FieldType
}from './interface' 
import {DataCollectionType} from './core'
import {RootName} from './constant'

interface TableDataType{
  columns: any,
  dataSource: any
}

const toTable = (PivotOptions: PivotOptionsType)=>(DataCollection: DataCollectionType) :TableDataType => {
  const columns:Array<FieldType> = [];
  const {rows, derivativeMeasuresConfig = []} = PivotOptions;
  const {getValue, getFieldConfig, columnData, rowData} = DataCollection;
  rows.forEach(rowKey => {
    const config = <FieldType>getFieldConfig(rowKey);
    let extraField = config.extraField?.dataIndex;
    if (extraField) {
      columns.push({
        type: 'dimension',
        dataIndex: extraField,
        title: config.extraField?.title || extraField
      })
    } else
      columns.push({
        type: 'dimension',
        dataIndex: rowKey,
        title: config.title
      })
  })

  const maxDeepLevelColumns: FieldType[] = [];
  

  const treeColumns = columnData.toJsonTree((node, parentData) => {
    let dataIndex = node.value;
    if (parentData && parentData.dataIndex !== RootName) {
      dataIndex = parentData.dataIndex + '/' + (node.value)
    }

    let dimensions = parentData ? [...parentData.dimensions] : [];
    if (node.key === RootName) {
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
      key: node.key,
      title: node.value,
      type: node.type,
    }

    if(column.key === '$measure'){
      column.title = getFieldConfig(node.value)?.title;
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
    let measureKey: string|null = null;
    maxDeepLevelColumns.forEach(columnConfig => {
      const { dimensions } = columnConfig;
      if(!dimensions)return;
      const columnRecord = dimensions.reduce((prev, curr) => {
        if(curr[0] === '$measure'){
          let fieldConfig = (getFieldConfig(curr[1]) as FieldType) ;
          if (!measureKey && fieldConfig && fieldConfig.type !== 'dimension') {
            measureKey = fieldConfig.dataIndex;
          }
        }
        prev[curr[0]] = curr[1];
        return prev;
      }, {});

      if(record['$measure']){
        measureKey = record['$measure'];
      }else if(!measureKey){
        return;
      }

      let tableRecord = record[columnConfig.dataIndex] = getValue(
        {
          ...record,
          ...columnRecord
        }
      )
      record[columnConfig.dataIndex] = tableRecord[measureKey];
      derivativeMeasuresConfig.forEach(derivativeInfo=>{
        let key = measureKey + derivativeInfo.suffix;
        if(typeof tableRecord[key] !== 'undefined'){
          record[columnConfig.dataIndex + key] = tableRecord[key];
        }
      })

      // if (columnConfig.dataIndex === '$measureValue' && record['$measure']) {
      //     let tableRecord = getValue({
      //       ...record,
      //       ...columnRecord
      //     });
      //     record[columnConfig.dataIndex] = tableRecord[record['$measure']];
      //     derivativeMeasuresConfig.forEach(derivativeInfo=>{
      //       let key = record['$measure'] + '_' + derivativeInfo.suffix;
      //       if(typeof tableRecord[key] !== 'undefined'){
      //         record[columnConfig.dataIndex + '_' + key] = tableRecord[key];
      //       }
      //     })
      // } 
      
      // else if(measureKey){
      //   let tableRecord = record[columnConfig.dataIndex] = getValue(
      //     {
      //       ...record,
      //       ...columnRecord
      //     }
      //   )
      //   record[columnConfig.dataIndex] = tableRecord[measureKey];
      //   derivativeMeasuresConfig.forEach(derivativeInfo=>{
      //     let key = measureKey + '_' + derivativeInfo.suffix;
      //     if(typeof tableRecord[key] !== 'undefined'){
      //       record[columnConfig.dataIndex + '_' + key] = tableRecord[key];
      //     }
      //   })
        
      // }else if(record.$measure){
      //   let tableRecord = record[columnConfig.dataIndex] = getValue(
      //     {
      //       ...record,
      //       ...columnRecord
      //     }
      //   )
      //   record.$measure
      // }
    })

  })

  return {
    columns,
    dataSource: dataSource
  }
}

export default toTable;