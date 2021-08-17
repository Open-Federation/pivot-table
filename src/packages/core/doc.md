```js
const arr = [{city: 'bj', date: '2020', measure1: 1.0, measure2: 100},
  {city: 'bj', date: '2021', measure1: 1.0, measure2: 100},
  {city: 'sh', date: '2020', measure1: 1.0, measure2: 100},
  {city: 'sh', date: '2021', measure1: 1.0, measure2: 100}]


```


```doc
  交叉转换
   city     measure1      measure2
         2020   2021    2020   2021   
    bj
    sh
    
 ```

## 解决方案
 数据行数为 N(4),指标数量为 M(2),城市维度为 C(2), 时间维度为 D(2)
 
 ### 解法1
 将指标降维处理，处理后的数据示例： [{city: 'bj', date: '2021', measureName: 'measure1' ,measureValue: 1.0}]
 > 时间算法复杂度为：N * M + Dimension(C) * Dimension(D) * Measure(m) = 6 
 
 ### 解法2：
 首先将指标显示位置调整到末尾，然后处理完成后，再进行树形结构数据层级交换
 > 时间算法复杂度为：N + N + D * M * 2
 
 综合来看，解法2更优秀，指标越多，性能越好
