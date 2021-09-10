import React from 'react';
import {pivotTableData} from '../packages/core/index.ts'
import {Table} from 'antd'
import toTreeData  from './toTreeData';
const testData = [{
  "city_id": 2,
  "city_name": "北京1",
  "category1_id": 1101,
  "category1_name": "生鲜",
  "province_id": 101,
  "province_name": "北京",
  "sale_amt": 14364471,
  "sale_num": 2158667,
  "sale_amt_hb_ratio": -0.04943,
  "sale_amt_tb_ratio": 0.01443,
  "sale_num_hb_ratio": -0.0391122,
  "sale_num_tb_ratio": 0.01123
}, {
  "city_id": null,
  "city_name": null,
  "category1_id": 1101,
  "category1_name": "生鲜",
  "province_id": 101,
  "province_name": "北京",
  "sale_amt": 143671,
  "sale_num": 21567,
  "sale_amt_hb_ratio": -0.04943,
  "sale_amt_tb_ratio": 0.01443,
  "sale_num_hb_ratio": -0.0391122,
  "sale_num_tb_ratio": 0.01123
}, {
  "city_id": 2,
  "city_name": "北京1",
  "category1_id": 1102,
  "category1_name": "标品",
  "province_id": 101,
  "province_name": "北京",
  "sale_amt": 143471,
  "sale_num": 158667,
  "sale_amt_hb_ratio": -0.04943,
  "sale_amt_tb_ratio": 0.01443,
  "sale_num_hb_ratio": -0.0391122,
  "sale_num_tb_ratio": 0.01123
}, {
  "city_id": "-100",
  "city_name": "-100",
  "category1_id": 1102,
  "category1_name": "标品",
  "province_id": 101,
  "province_name": "北京",
  "sale_amt": 132143471,
  "sale_num": 555158667,
  "sale_amt_hb_ratio": -0.04943,
  "sale_amt_tb_ratio": 0.01443,
  "sale_num_hb_ratio": -0.0391122,
  "sale_num_tb_ratio": 0.01123
}, {
  "category1_id": null,
  "category1_name": null,
  "city_id": null,
  "city_name": null,
  "province_id": null,
  "province_name": null,
  "sale_amt": 14364471888,
  "sale_num": 2158667888,
  "sale_amt_hb_ratio": -0.04943,
  "sale_amt_tb_ratio": 0.01443,
  "sale_num_hb_ratio": -0.0391122,
  "sale_num_tb_ratio": 0.01123
}, {
  "city_id": null,
  "city_name": null,
  "category1_id": null,
  "category1_name": null,
  "province_id": 101,
  "province_name": "北京",
  "sale_amt": 164471,
  "sale_num": 21667,
  "sale_amt_hb_ratio": -0.04943,
  "sale_amt_tb_ratio": 0.01443,
  "sale_num_hb_ratio": -0.0391122,
  "sale_num_tb_ratio": 0.01123
}, {
  "category1_id": 1101,
  "category1_name": "生鲜",
  "city_id": 3,
  "city_name": "上海1",
  "province_id": 102,
  "province_name": "上海",
  "sale_amt": 14362471,
  "sale_num": 2118667,
  "sale_amt_hb_ratio": -0.06443,
  "sale_amt_tb_ratio": 0.03443,
  "sale_num_hb_ratio": -0.0791122,
  "sale_num_tb_ratio": 0.04123
}, {
  "category1_id": 1102,
  "category1_name": "标品",
  "city_id": 3,
  "city_name": "上海1",
  "province_id": 102,
  "province_name": "上海",
  "sale_amt": 142471,
  "sale_num": 28667,
  "sale_amt_hb_ratio": -0.06443,
  "sale_amt_tb_ratio": 0.03443,
  "sale_num_hb_ratio": -0.0791122,
  "sale_num_tb_ratio": 0.04123
}, {
  "category1_id": 1102,
  "category1_name": "标品",
  "city_id": null,
  "city_name": null,
  "province_id": 102,
  "province_name": "上海",
  "sale_amt": 666142471,
  "sale_num": 66628667,
  "sale_amt_hb_ratio": -0.06443,
  "sale_amt_tb_ratio": 0.03443,
  "sale_num_hb_ratio": -0.0791122,
  "sale_num_tb_ratio": 0.04123
}, {
  "category1_id": 1101,
  "category1_name": "生鲜",
  "city_id": null,
  "city_name": null,
  "province_id": 102,
  "province_name": "上海",
  "sale_amt": 6142471,
  "sale_num": 88628667,
  "sale_amt_hb_ratio": -0.06443,
  "sale_amt_tb_ratio": 0.03443,
  "sale_num_hb_ratio": -0.0791122,
  "sale_num_tb_ratio": 0.04123
}, {
  "city_id": "-100",
  "city_name": "-100",
  "category1_id": null,
  "category1_name": null,
  "province_id": 102,
  "province_name": "上海",
  "sale_amt": 162471,
  "sale_num": 2167,
  "sale_amt_hb_ratio": -0.0443,
  "sale_amt_tb_ratio": 0.03443,
  "sale_num_hb_ratio": -0.0791122,
  "sale_num_tb_ratio": 0.04123
}, {
  "city_id": 21,
  "city_name": "北京2",
  "category1_id": 1101,
  "category1_name": "生鲜",
  "province_id": 101,
  "province_name": "北京",
  "sale_amt": 13726127,
  "sale_num": 2021779
}, {
  "city_id": 21,
  "city_name": "北京2",
  "category1_id": 1102,
  "category1_name": "标品",
  "province_id": 101,
  "province_name": "北京",
  "sale_amt": 13726127,
  "sale_num": 2021779
}, {
  "category1_id": 1102,
  "category1_name": "标品",
  "city_id": 4,
  "city_name": "上海2",
  "province_id": 102,
  "province_name": "上海",
  "sale_amt": 13721127,
  "sale_num": 2025779
}, {
  "category1_id": 1101,
  "category1_name": "生鲜",
  "city_id": 4,
  "city_name": "上海2",
  "province_id": 102,
  "province_name": "上海",
  "sale_amt": 137127,
  "sale_num": 2779
}]



export default function Tree(){

  const data3 = pivotTableData({
    dimensionsConfig: [
      {
        "dataIndex": "province_id",
        "title": "province_id",
        "extraField": {
          "dataIndex": "province_name",
          "title": "省"
        }
      },
      {
        "dataIndex": "city_id",
        "title": "city_id",
        "extraField": {
          "dataIndex": "city_name",
          "title": "城市"
        }
      },
      {
        "dataIndex": "category1_id",
        "title": "category1_id",
        "extraField": {
          "dataIndex": "category1_name",
          "title": "一级品类"
        }
      }
    ],
    measuresConfig: [
      {
        "dataIndex": "sale_amt",
        "title": "销售额",
        "type": "float",
      },
      {
        "dataIndex": "sale_num",
        "title": "销售件数",
        "type": "number",
      }
    ],
    dataSource: testData,
    rows: [ 'province_id','city_id','category1_id'],
    cols: ['$measure'],
    derivativeMeasuresConfig: [
      {
        "suffix": "_hb_ratio",
        "title": "环比"
      },
      {
        "suffix": "_tb_ratio",
        "title": "同比"
      }
    ],
    treeTransformConfig: ['province_id', 'category1_id','city_id']
  })

  const treeData = toTreeData(data3.dataSource, {
    idField: 'levelId',
    pidField: 'levelPid'
  })

  data3.columns.unshift({
    dataIndex: 'node_name'
  })

  const app3 = ()=><Table 
    tableLayout="fixed"
    scroll={{x: '100%'}}
    columns={data3.columns}
    dataSource={treeData}
  />

  

  return <div>
    <div>
      <h3>树形算子示例</h3>
      <p>rows: province_id, city_id, category1_id</p>
      <p>cols: $measure </p>
      {app3()}
      <h4>DataSource:</h4>
      <pre style={{maxHeight:200}}>
        {JSON.stringify(data3.dataSource,null,2)}
      </pre>
    </div>
    
  </div>
}