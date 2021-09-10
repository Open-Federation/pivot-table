import {find} from 'lodash'

const defaultConfig = {
  idField : 'id', 
  pidField : 'pid', 
  childrenField : 'children',
  enableLevelDepthComputed: false
}

const idPrefix = 'to_tree_data_id_';
const emptyPid = 'to_tree_data_pid';

export function getOrderDataByTreeData(treeData = [], childrenField = 'children'){
  if(!Array.isArray(treeData)){
    console.error('toTreeData 异常的数据类型', treeData)
    return [];
  }
  let data = []
  function getOrderData(children = []){
    children.forEach(item=>{
      data.push(item)
      if(Array.isArray(item[childrenField])){
        getOrderData(item[childrenField])
      }
    })
  }
  getOrderData(treeData)
  return data;
}

export default function toTreeData(data = [], config = {}){
  if(!Array.isArray(data)){
    console.error('toTreeData 异常的数据类型', data)
    return [];
  }

  config = {
    ...defaultConfig,
    ...config
  }

  let __uniqueId = 1;

  function getId () {
    return idPrefix + (__uniqueId++);
  }
  
  const {idField, pidField, childrenField, enableLevelDepthComputed} = config;
  let treeData = [];
  let hashData = {};
  let ids = []

  data = data.filter(item => item);

  function checkData(data){
    data.forEach(item=>{
      if(typeof item[idField] !== 'undefined' &&item[idField] === item[pidField]){
        console.error('id, pid 不能重复:', item[idField], ',数据将会在前端强制修复')
        item[pidField] = emptyPid;
      }
    })
  }
  checkData(data)

  let findPid = find(data, d=> typeof d[pidField] !== 'undefined');
  let _emptyPid = emptyPid;
  if(findPid){
    _emptyPid = findPid[pidField]
  }

  for(let i=0; i< data.length; i++){
    let item = {...data[i]}
    item[idField] = typeof item[idField] === 'undefined'? getId() : item[idField];
    ids.push(item[idField])
    item[pidField] = typeof item[pidField] === 'undefined' ? _emptyPid : item[pidField];
    hashData[item[idField]] = item;
  }

  ids.forEach(id=>{
    let originItem = hashData[id]
    let parendData = hashData[originItem[pidField]];
    let currentData = hashData[originItem[idField]];
    if(parendData){
      parendData[childrenField] = parendData[childrenField] || [];
      parendData[childrenField].push(currentData)
    }else{
      treeData.push(currentData)
    }
  })

  function getLevelDepth(children, levelDepth = 1){
    children.forEach(item=>{
      item.levelDepth = levelDepth;
      item.isLeaf = true;

      if(Array.isArray(item[childrenField])){
        item.isLeaf = false;
        getLevelDepth(item[childrenField], levelDepth + 1)
      }
    })
  }

  if(enableLevelDepthComputed){
    getLevelDepth(treeData)
  }

  return treeData;
}