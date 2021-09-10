import {
  PivotOptionsType,
  FieldType
}from './interface' 
import {DataCollectionType} from './core'
import {RootName, measureValueDataIndex, measureNameDataIndex,measureDataIndex, measure, dimension} from './constant'

interface TableDataType{
  columns: any,
  dataSource: any
}

const toTable = (PivotOptions: PivotOptionsType)=>(DataCollection: DataCollectionType) :TableDataType => {
  const columns:Array<FieldType> = [];
  const {rows, derivativeMeasuresConfig = [], cols, treeTransformConfig =[],dimensionsConfig = [], measuresConfig = []} = PivotOptions;
  const {getValue, getFieldConfig, columnData, rowData} = DataCollection;
  const isRow  = rows.includes(measureDataIndex);
  const isMeasure = (cols.length >1 && cols.includes(measureDataIndex));

  rows.forEach(rowKey => {
    const config = <FieldType>getFieldConfig(rowKey);
    let extraField = config.extraField?.dataIndex;
    const analysisType = config.analysisType|| 'measures';
    let type = config?.type || 'string';
    if (extraField) {
      columns.push({
        ...(config || {}),
        type,
        analysisType,
        dataIndex: extraField,
        extraField:{
          dataIndex: rowKey,
          title: config.title,
        },
        title: config.extraField?.title || extraField
      })
    } else
      columns.push({
        ...(config|| {}),
        type,
        analysisType,
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
    const config = <FieldType>getFieldConfig(node.key);
    let extraField = config?.extraField?.dataIndex;
    let title = {
      title: node.value,
    }
    
    if(extraField){
      title.title = node.extra?.[extraField] || node.value;
    }
    let analysisType = node.analysisType;
    const colConfig = getFieldConfig(node.value);
    let type = colConfig?.type || 'string';
    let extraConfig = colConfig || {};
    let group_name = node.extra?.group_name;
    if(isRow || isMeasure){
      analysisType = measure
    }
    if(isRow){
      type = 'float'
    }else if (isMeasure && parentData && parentData.key === measureDataIndex){
      const parentConfig = getFieldConfig(parentData.dataIndex);
      type = parentConfig?.type || 'string';
      extraConfig = parentConfig || {};
    }

    if(parentData && parentData.key === measureDataIndex){
      group_name = parentData.extra?.group_name
    }
    const column = {
      ...extraConfig,
      dimensions,
      dataIndex,
      key: node.key,
      ...title,
      analysisType,
      type,
      group_name:group_name ||''
    }

    if(column.key === measureDataIndex){
      column.title = getFieldConfig(node.value)?.title;
    }

    if (!node.children || node.children.size === 0) {
      if(node.key !== RootName){
        maxDeepLevelColumns.push(column)
      }
      
    }

    return column;
  }).children;


  if (treeColumns.length === 0) {
    treeColumns.push({
      title: '指标值',
      type: 'float',
      analysisType: measure,
      dataIndex: measureValueDataIndex
    });

    maxDeepLevelColumns.push({
      title: '指标值',
      type: 'float',
      analysisType: measure,
      dataIndex: measureValueDataIndex
    });
  }

  treeColumns.forEach(p => {
    columns.push(p)
  })

  const dataSource = rowData.toTableData();

  dataSource.forEach((record, index) => {
    if(!record)return;
    record.key = record.$key ? record.$key.join('/') : (index + '');

    maxDeepLevelColumns.forEach(columnConfig => {
      let measureKey: string|null = null;
      const { dimensions = [] } = columnConfig;
      const columnRecord = dimensions.reduce((prev, curr) => {
        if(curr[0] === measureDataIndex){
          let fieldConfig = (getFieldConfig(curr[1]) as FieldType) ;
          if (!measureKey && fieldConfig && fieldConfig.type !== dimension) {
            measureKey = fieldConfig.dataIndex;
          }
        }
        prev[curr[0]] = curr[1];
        return prev;
      }, {});

      if(record[measureDataIndex]){
        measureKey = record[measureDataIndex] as string|null ;
        let fieldConfig = (getFieldConfig(measureKey as string ) as FieldType) ;
        //如果指标有定义数值类型，在列转行时需要特殊处理
        if(fieldConfig && fieldConfig.type){
          record['$commonNumberType'] = fieldConfig.type;
          record['metadata'] = {
            [measureNameDataIndex]:{
              ...fieldConfig
            }
          }
        }
      }else if(!measureKey){
        return;
      }

      let tableRecord = getValue(columnRecord,record)
      record[columnConfig.dataIndex] = tableRecord && tableRecord[measureKey as string];
      tableRecord && derivativeMeasuresConfig.forEach(derivativeInfo=>{
        let key = measureKey + derivativeInfo.suffix;
        const deriveIndexKey =  derivativeInfo.suffix;
        if(derivativeInfo.customDataFunc){
          derivativeInfo.customDataFunc(record,columnConfig.dataIndex,maxDeepLevelColumns,derivativeInfo);
          return;
        }
        if(typeof tableRecord[key] !== 'undefined'){
          record[columnConfig.dataIndex + deriveIndexKey] = tableRecord[key];
        }
      })
    })

  })
  //树形转换
  if(treeTransformConfig && treeTransformConfig.length > 0){
    let rootId:string = '0';
    const NODENAME = 'node_name', LEVELID = 'levelId', leLEVELPID = 'levelPid';
    dataSource.forEach(record => {
      const level = getLevel(treeTransformConfig, record);
      if(level === -1){
        const id = '0';
        const pId = '-1';
        let level1Key = treeTransformConfig[0];
        const config = <FieldType>getFieldConfig(level1Key);
        if(config?.extraField?.dataIndex){
          level1Key = config.extraField.dataIndex;
        }
        record[NODENAME] = record[level1Key] || '全部';
        record[LEVELID] = id;
        record[leLEVELPID] = pId;
        rootId = id;
        return;
      }
      let levelName = treeTransformConfig[level];
      const config = <FieldType>getFieldConfig(levelName);
      if(config?.extraField?.dataIndex){
        levelName = config.extraField.dataIndex;
      }
      let itemLevelIds:string[] = [];
      let itemLevelPids:string[] = []
      for(let i = 0; i <= level; i++ ){
        itemLevelIds.push(treeTransformConfig[i] + '_' + record[treeTransformConfig[i]])
      }
      for(let i = 0; i <= (level -1); i++ ){
        itemLevelPids.push(treeTransformConfig[i] + '_' + record[treeTransformConfig[i]])
      }
      record[NODENAME] = record[levelName];
      record[LEVELID] = itemLevelIds.join('|');
      record[leLEVELPID] = itemLevelPids.join('|')? itemLevelPids.join('|') :  rootId;

    })
  }

  return {
    columns,
    dataSource: dataSource
  }
}

function getLevel<T extends string[],U extends object>(treeTransformConfig:T, data:U ){
  let level = -1;
  for(let i = 0; i < treeTransformConfig.length; i++){
    const key  = treeTransformConfig[i];
    const value = String(data[key]).toLocaleLowerCase()
    if(!(value === 'null'  || value  ===  '-100' || value === 'undefined')){
      level = i;
    }
  }
  return level;
}

export default toTable;