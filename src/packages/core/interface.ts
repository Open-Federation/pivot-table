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
  title: string,
  customDataFunc?: <T, U extends any[]>(record:T,dataIndex:string,head:U,config:DerivativeInfo) => void,
}

export interface PivotOptionsType{
  dimensionsConfig : Array<DimensionFieldType>,
  measuresConfig: Array<MeasureFieldType>,
  dataSource: Array<DataRecordType>,
  rows: Array<string>,
  cols: Array<string>,
  derivativeMeasuresConfig: Array<DerivativeInfo>,
  treeTransformConfig?: string[]
}


//混合了维度和指标
export interface FieldType extends DimensionFieldType, MeasureFieldType{
  dimensions?: any,
  analysisType?:string,
  children?:FieldType[]
}


export interface getValueType{
  <T>(dimensionData: T,anotherDimensionData?:T, measureKey?: string): any;
}

export interface getFieldConfigType{
  (dimensionKey: string): FieldType|undefined
}

