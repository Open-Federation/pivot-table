import pivotDataCore, {DataCollectionType} from './core'
import toTable from './toTable' 
import {
  PivotOptionsType
}from './interface'


export function pivotBaseData(options: PivotOptionsType): DataCollectionType {
  return pivotDataCore(options);
}

interface TableDataType{
  columns: any,
  dataSource: any
}

export function pivotTableData(options: PivotOptionsType):TableDataType {
  const {rowData,
    columnData,
    getValue,
    getFieldConfig} = pivotDataCore(options);
  return toTable(options)({
    rowData,
    columnData,
    getValue,
    getFieldConfig
  })
}