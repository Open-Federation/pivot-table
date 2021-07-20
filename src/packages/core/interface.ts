export interface DimensionFieldType{
  dataIndex: string,
  title: string,
  $value?:Set<string|number>,
  type?: string
}

export interface MeasureFieldType{
  dataIndex: string,
  title: string,
  $value?:Set<string|number>
}

export interface DataRecordType{
  $key?: Array<string>,
  key?: string,
  $index_name?: string,
  $measure?: string,
}

export interface PivotOptionsType{
  dimensionsConfig : Array<DimensionFieldType>,
  measuresConfig: Array<MeasureFieldType>,
  dataSource: Array<DataRecordType>,
  rows: Array<string>
  cols: Array<string>
}


//混合了维度和指标
export interface FieldType extends DimensionFieldType, MeasureFieldType{
  dimensions?: any
}


export interface getValueType{
  (dimensionData: string[], measureKey: string): any;
}

export interface getFieldConfigType{
  (dimensionKey: string): FieldType|undefined
}

