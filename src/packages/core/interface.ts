export interface DimensionFieldType{
  dataIndex: string,
  title: string,
  type?: string,
  extraField?: DimensionFieldType   //一般用来定义关联的名称字段，比如 city_id 关联 city_name
}

export interface MeasureFieldType{
  dataIndex: string,
  title: string,
}

export interface DataRecordType{
  $key?: Array<string>,
  key?: string,
  $index_name?: string,
  $measure?: string,
}

export interface DerivativeInfo{
  suffix: string,
  title: string
}

export interface PivotOptionsType{
  dimensionsConfig : Array<DimensionFieldType>,
  measuresConfig: Array<MeasureFieldType>,
  dataSource: Array<DataRecordType>,
  rows: Array<string>,
  cols: Array<string>,
  derivativeMeasuresConfig: Array<DerivativeInfo>
}


//混合了维度和指标
export interface FieldType extends DimensionFieldType, MeasureFieldType{
  dimensions?: any
}


export interface getValueType{
  (dimensionData: string[], measureKey?: string): any;
}

export interface getFieldConfigType{
  (dimensionKey: string): FieldType|undefined
}

