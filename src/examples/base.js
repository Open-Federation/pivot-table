import React from 'react';
import {pivotTableData} from '../packages/core/index.ts'
import {Table} from 'antd'

const testData = [
  {
    "city": "cityname-0",
    "date": 1960,
    "index_0": 0.07714969920485326,
    "index_1": 0.20767379970171018,
    "index_2": 0.6487187747706384,
    "index_3": 0.20464094325759974,
    "index_4": 0.6993959105946261,
    "index_5": 0.9098597092162655,
    "index_6": 0.809067914713882,
    "index_7": 0.557912428457324,
    "index_8": 0.7674496796607833,
    "index_9": 0.6294920349074211
  },
  {
    "city": "cityname-0",
    "date": 1961,
    "index_0": 0.2554994990235717,
    "index_1": 0.930328018220306,
    "index_2": 0.7652191429599573,
    "index_3": 0.49862674736239887,
    "index_4": 0.22847765974935386,
    "index_5": 0.31309045385037404,
    "index_6": 0.5692175607604917,
    "index_7": 0.145077692688808,
    "index_8": 0.7296346492712358,
    "index_9": 0.4592801232242312
  },
  {
    "city": "cityname-0",
    "date": 1962,
    "index_0": 0.20091128172631656,
    "index_1": 0.6633825223812444,
    "index_2": 0.10459214471350942,
    "index_3": 0.9837339263181644,
    "index_4": 0.7030861763895864,
    "index_5": 0.7300484118984507,
    "index_6": 0.7365817676938813,
    "index_7": 0.9610267805132258,
    "index_8": 0.7965515262907201,
    "index_9": 0.31496064984509764
  },
  {
    "city": "cityname-0",
    "date": 1963,
    "index_0": 0.7129224752021925,
    "index_1": 0.6149267532326894,
    "index_2": 0.5676816379314007,
    "index_3": 0.33191541989831586,
    "index_4": 0.8005942149759524,
    "index_5": 0.522045387739799,
    "index_6": 0.8845225177489051,
    "index_7": 0.49749911973956196,
    "index_8": 0.6327904746045445,
    "index_9": 0.10879239695198861
  },
  {
    "city": "cityname-0",
    "date": 1964,
    "index_0": 0.5122852590905222,
    "index_1": 0.5934939454664752,
    "index_2": 0.5596214065031624,
    "index_3": 0.9298229173959007,
    "index_4": 0.9098857090101782,
    "index_5": 0.5692175139531954,
    "index_6": 0.2617068568533565,
    "index_7": 0.3264222745038261,
    "index_8": 0.2910132832194092,
    "index_9": 0.14964047057113672
  },
  {
    "city": "cityname-1",
    "date": 1960,
    "index_0": 0.30271138311814094,
    "index_1": 0.33744922155812973,
    "index_2": 0.1416532096300489,
    "index_3": 0.46225249975105287,
    "index_4": 0.284806979348057,
    "index_5": 0.4453552126613112,
    "index_6": 0.9512480243269033,
    "index_7": 0.9468576255661891,
    "index_8": 0.4790570117816435,
    "index_9": 0.6458243343854675
  },
  {
    "city": "cityname-1",
    "date": 1961,
    "index_0": 0.8665106306508468,
    "index_1": 0.9766591202959714,
    "index_2": 0.5650654693559127,
    "index_3": 0.6440460450511587,
    "index_4": 0.9126074581322099,
    "index_5": 0.3723394257860986,
    "index_6": 0.24181050578425056,
    "index_7": 0.8763681067783986,
    "index_8": 0.022714834860716238,
    "index_9": 0.5081967597658854
  },
  {
    "city": "cityname-1",
    "date": 1962,
    "index_0": 0.7207639512092978,
    "index_1": 0.4648495081831874,
    "index_2": 0.6838171931692612,
    "index_3": 0.1286174025803568,
    "index_4": 0.9079783445098855,
    "index_5": 0.7397845340869198,
    "index_6": 0.7801910129664096,
    "index_7": 0.7816096184827894,
    "index_8": 0.4172643895669339,
    "index_9": 0.195323057834059
  },
  {
    "city": "cityname-1",
    "date": 1963,
    "index_0": 0.17069249758022953,
    "index_1": 0.27339581973406024,
    "index_2": 0.9082290561896142,
    "index_3": 0.81247536954973,
    "index_4": 0.44143466208719606,
    "index_5": 0.21184951475177694,
    "index_6": 0.7734138382443885,
    "index_7": 0.2912996678338877,
    "index_8": 0.022687261288387717,
    "index_9": 0.8371110675225777
  },
  {
    "city": "cityname-1",
    "date": 1964,
    "index_0": 0.7998699095443549,
    "index_1": 0.7140141335567245,
    "index_2": 0.5158566227236725,
    "index_3": 0.5574720783350287,
    "index_4": 0.7932240672706603,
    "index_5": 0.7631217869877038,
    "index_6": 0.7264316909643325,
    "index_7": 0.5220373864442458,
    "index_8": 0.5841304854745726,
    "index_9": 0.2499914392007465
  },
  {
    "city": "cityname-2",
    "date": 1960,
    "index_0": 0.15083486443412486,
    "index_1": 0.1066284189844422,
    "index_2": 0.8231347722066158,
    "index_3": 0.4717996945606475,
    "index_4": 0.21898431444451716,
    "index_5": 0.10067252491179057,
    "index_6": 0.9865286188574258,
    "index_7": 0.27676697241769554,
    "index_8": 0.5917082043260791,
    "index_9": 0.5870764590414366
  },
  {
    "city": "cityname-2",
    "date": 1961,
    "index_0": 0.0401864105246863,
    "index_1": 0.6173726329859661,
    "index_2": 0.2437036829771646,
    "index_3": 0.14237803412433703,
    "index_4": 0.6403757007758071,
    "index_5": 0.3065765844199009,
    "index_6": 0.049514517757259346,
    "index_7": 0.7312037916403595,
    "index_8": 0.3689107792095285,
    "index_9": 0.8035253477053228
  },
  {
    "city": "cityname-2",
    "date": 1962,
    "index_0": 0.631318711845624,
    "index_1": 0.8062201301973693,
    "index_2": 0.3854336800606357,
    "index_3": 0.30390559184012655,
    "index_4": 0.06225027168827224,
    "index_5": 0.4148788638826968,
    "index_6": 0.7214035827054726,
    "index_7": 0.24243389653596603,
    "index_8": 0.44722960093423625,
    "index_9": 0.7165616267956985
  },
  {
    "city": "cityname-2",
    "date": 1963,
    "index_0": 0.11851249419033882,
    "index_1": 0.18974978928853492,
    "index_2": 0.893898223561681,
    "index_3": 0.541114016792406,
    "index_4": 0.02838294630939897,
    "index_5": 0.946979105325386,
    "index_6": 0.8156979260835213,
    "index_7": 0.05672278079486759,
    "index_8": 0.559019603445347,
    "index_9": 0.7749955989290143
  },
  {
    "city": "cityname-2",
    "date": 1964,
    "index_0": 0.07802752895131038,
    "index_1": 0.12170026205482554,
    "index_2": 0.9862953352930834,
    "index_3": 0.6741712464944063,
    "index_4": 0.900998915684456,
    "index_5": 0.13377671318940543,
    "index_6": 0.10708163675960414,
    "index_7": 0.5474062810904929,
    "index_8": 0.1773541840597952,
    "index_9": 0.05604036856173811
  },
  {
    "city": "cityname-3",
    "date": 1960,
    "index_0": 0.30848436699211423,
    "index_1": 0.4096061179801578,
    "index_2": 0.6417730461835767,
    "index_3": 0.6372855229811727,
    "index_4": 0.3136736560317168,
    "index_5": 0.05327820721518717,
    "index_6": 0.20229142073044293,
    "index_7": 0.49795356442883043,
    "index_8": 0.6555687093128013,
    "index_9": 0.455088934006898
  },
  {
    "city": "cityname-3",
    "date": 1961,
    "index_0": 0.5404394087558553,
    "index_1": 0.1807825344680296,
    "index_2": 0.6193254266721722,
    "index_3": 0.251760833301677,
    "index_4": 0.060674168852083765,
    "index_5": 0.7609607638828964,
    "index_6": 0.4644950310162652,
    "index_7": 0.2976542674373204,
    "index_8": 0.5742539958308062,
    "index_9": 0.754030480153383
  },
  {
    "city": "cityname-3",
    "date": 1962,
    "index_0": 0.672174691269686,
    "index_1": 0.4401917595748255,
    "index_2": 0.7056037671897524,
    "index_3": 0.39464254727718306,
    "index_4": 0.6036459557614917,
    "index_5": 0.7989737033025528,
    "index_6": 0.6400073719390644,
    "index_7": 0.25189688016399936,
    "index_8": 0.8941834006737996,
    "index_9": 0.5490474887689518
  },
  {
    "city": "cityname-3",
    "date": 1963,
    "index_0": 0.5333515260987947,
    "index_1": 0.7296228105248359,
    "index_2": 0.9426936819608058,
    "index_3": 0.47149422167999977,
    "index_4": 0.5767120245230133,
    "index_5": 0.5909586531813247,
    "index_6": 0.7528428753434686,
    "index_7": 0.7894088765129332,
    "index_8": 0.4201950287626848,
    "index_9": 0.05057009191145645
  },
  {
    "city": "cityname-3",
    "date": 1964,
    "index_0": 0.10280996430490186,
    "index_1": 0.7912707162092067,
    "index_2": 0.0038405970655039923,
    "index_3": 0.3689438235676834,
    "index_4": 0.8363871018335727,
    "index_5": 0.9094216081465725,
    "index_6": 0.220518711316519,
    "index_7": 0.0398775164670806,
    "index_8": 0.017436529597282924,
    "index_9": 0.16675831608059388
  },
  {
    "city": "cityname-4",
    "date": 1960,
    "index_0": 0.9214342558500359,
    "index_1": 0.6142007542941024,
    "index_2": 0.728046393368202,
    "index_3": 0.7271524208986733,
    "index_4": 0.13091208123093812,
    "index_5": 0.31132815223579535,
    "index_6": 0.8508405349582484,
    "index_7": 0.8003701393151448,
    "index_8": 0.3693285341032313,
    "index_9": 0.4764671230526063
  },
  {
    "city": "cityname-4",
    "date": 1961,
    "index_0": 0.6686344800370845,
    "index_1": 0.11712012401018557,
    "index_2": 0.8437972584860574,
    "index_3": 0.18642400682725468,
    "index_4": 0.41186352019937456,
    "index_5": 0.38843621576636034,
    "index_6": 0.9652547822434456,
    "index_7": 0.6326281081887957,
    "index_8": 0.03222887155613163,
    "index_9": 0.6331876570676378
  },
  {
    "city": "cityname-4",
    "date": 1962,
    "index_0": 0.9667870240077652,
    "index_1": 0.057730955829488284,
    "index_2": 0.28612359637776086,
    "index_3": 0.6138299530644498,
    "index_4": 0.3714377335462722,
    "index_5": 0.28943747662842667,
    "index_6": 0.7477470237687083,
    "index_7": 0.593559787854645,
    "index_8": 0.7898136240819171,
    "index_9": 0.30894900245374357
  },
  {
    "city": "cityname-4",
    "date": 1963,
    "index_0": 0.33774433439312723,
    "index_1": 0.2824995895803788,
    "index_2": 0.3338268153932984,
    "index_3": 0.441478302762323,
    "index_4": 0.6414276958778189,
    "index_5": 0.4259130620501572,
    "index_6": 0.5614091486292982,
    "index_7": 0.431523627034079,
    "index_8": 0.11977660628516107,
    "index_9": 0.42741157008840025
  },
  {
    "city": "cityname-4",
    "date": 1964,
    "index_0": 0.08480517867160797,
    "index_1": 0.08942692644541417,
    "index_2": 0.8562027031466359,
    "index_3": 0.6673280480369177,
    "index_4": 0.8572638829128247,
    "index_5": 0.8547077977232089,
    "index_6": 0.11509336382237345,
    "index_7": 0.28299409886458915,
    "index_8": 0.16640919429016265,
    "index_9": 0.03868167616880869
  }
]



export default function Base(){
  const data = pivotTableData({
    dimensionsConfig: [
      {
        dataIndex: 'city',
        title: '??????',
      },
      {
        dataIndex: 'date',
        title: '??????',
      },
    ],
    measuresConfig: [
      {
        dataIndex: 'index_0',
        title: '?????????',
      },
      {
        dataIndex: 'index_1',
        title: '??????',
      },
    ],
    dataSource: testData,
    rows: [ 'date',],
    cols: ['city', '$measure',]
  })

  const app = <Table 
    tableLayout="fixed"
    scroll={{x: '100%'}}
    columns={data.columns}
    dataSource={data.dataSource}
  />

  const data2 = pivotTableData({
    dimensionsConfig: [
      {
        dataIndex: 'city',
        title: '??????',
      },
      {
        dataIndex: 'date',
        title: '??????',
      },
    ],
    measuresConfig: [
      {
        dataIndex: 'index_0',
        title: '?????????',
      },
      {
        dataIndex: 'index_1',
        title: '??????',
      },
    ],
    dataSource: testData,
    rows: [ 'date','city'],
    cols: ['$measure']
  })


  const app2 = <Table 
    tableLayout="fixed"
    scroll={{x: '100%'}}
    columns={data2.columns}
    dataSource={data2.dataSource}
  />


  return <div>
    <div>
      <h3>?????????????????????</h3>
      <p>rows: date</p>
      <p>cols: city, $measure</p>
      {app2}
    </div>
    <div>
      <h3>city?????????</h3>
      <p>rows: date</p>
      <p>cols: city, $measure</p>
      {app}
    </div>
    
  </div>
}