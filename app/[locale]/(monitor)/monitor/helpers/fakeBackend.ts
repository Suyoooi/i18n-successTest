"use client"

import { AxiosInstance } from "axios";
import MockAdapter from "axios-mock-adapter";
import * as url from "./url_helper";
import { OUT_MSG_RATE } from "@/data/monitor/chartConstants";
import { OUT_BYTE_RATE } from "@/data/monitor/chartConstants";
import { IN_MSG_RATE } from "@/data/monitor/chartConstants";
import { IN_BYTE_RATE } from "@/data/monitor/chartConstants";
import { PENDING_SIZE } from "@/data/monitor/chartConstants";
import { PENDING_CNT } from "@/data/monitor/chartConstants";

const refreshUnit = 1000; //seconds
function makeRandom(min: number, max: number) {
  var RandVal = Math.random() * (max - min) + min;
  return RandVal;
}
const getCount = (sTime: number, eTime: number) => {
  return Math.round((eTime - sTime) / refreshUnit);
}

const fakeBackend = (fakeBackendAxios: AxiosInstance) => {
  const mock = new MockAdapter(fakeBackendAxios);

  mock.onGet(url.GET_ALL_NODES).reply((config: any) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
          const resultData = {
            responseCode: 200,
            data: [
              { msn: "broker-1", serverType: 'SOL', mlsns: ["default", "vpn1", "vpn2"] },
              { msn: "broker-2", serverType: 'SOL', mlsns: ["default", "vpn1", "vpn2", "vpn3"] },
              { msn: "broker-3", serverType: 'SOL', mlsns: ["default", "vpn1", "vpn2", "vpn4"] },
            ],
          }
          resolve([200, resultData]);
        });
    })
  });

  mock.onGet(url.GET_QUEUE_LIST).reply((config: any) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
          const resultData = {
            responseCode: 200,
            data: {
              queueList : Array.from({length: config.params.count}, (_, index) => {
                return `${config.params.msn}-${config.params.mlsn}-${config.params.queueType}-q-${index}`;
              })
            }
          }
          resolve([200, resultData]);
        });
    })
  });

  mock.onGet(url.GET_ALL_QUEUE_LIST).reply((config: any) => {
    const randomCount = Math.floor(makeRandom(2, 100));
    const decoded = atob(config.params.searchParam);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
          const resultData = {
            responseCode: 200,
            data: {
              queueNames: Array.from({length: randomCount}, (_, index) => {
                return `${decoded}-q-${index}`;
              })
            }
          }
          resolve([200, resultData]);
        });
    })
  });

  function getRandomElement(arr : number[], n: number) {
    var result = new Array(n),
      len = arr.length,
      taken = new Array(len);
    if (n > len)
      throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
      var x = Math.floor(Math.random() * len);
      result[n] = arr[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
  }

  const getRandomLabels= (sTime: number, eTime: number) => {
    const count = getCount(sTime, eTime);
    const randomValue = Math.round(makeRandom(0, count));
    const labelArray = Array.from({ length: getCount(sTime, eTime)}, (_, index) => sTime + refreshUnit * (index + 1));
    return getRandomElement(labelArray, randomValue).sort((a,b)=>a-b);
  }

  function getQueueChartData(type: string, count: number) {
    if(type === PENDING_CNT) {
      return Array.from({ length: count }, () => Math.round(makeRandom(0,1000)));
    }else if(type === PENDING_SIZE) {
      return Array.from({ length: count }, () => makeRandom(0,3000));
    }else if(type === IN_MSG_RATE) {
      return Array.from({ length: count }, () => Math.round(makeRandom(300, 800)));
    }else if(type === IN_BYTE_RATE) {
      return Array.from({ length: count }, () => makeRandom(2000, 7000));
    }else if(type === OUT_MSG_RATE) {
      return Array.from({ length: count }, () => Math.round(makeRandom(300, 800)));
    }else if(type === OUT_BYTE_RATE) {
      return Array.from({ length: count }, () => makeRandom(2000, 7000));
    }
    return [];
  }

  mock.onGet(url.GET_MONITORING_QUEUE_DATA).reply((config: any) => {
    // const ftime = ((config.params.eTime - config.params.sTime)>1000*60*2)? config.params.sTime+1000*60*2 : config.params.sTime;
    const ftime = config.params.sTime;
    return new Promise((resolve, reject) => {
        setTimeout(() => {
          const resultData = {
            responseCode: 200,
            data: Array.from({ length: config.params.queues.length }, (_, index) => {
              const randomLabels = getRandomLabels(ftime, config.params.eTime);
              return {
                queueName: config.params.queues[index],
                label: randomLabels,
                metrics: Array.from({ length: config.params.chartList.length }, (_, index2) => {
                  return {
                    type: config.params.chartList[index2],
                    values: getQueueChartData(config.params.chartList[index2], randomLabels.length),
                  }
                })
              }
            }),
          }
          resolve([200, resultData]);
        });
    });
  });

  mock.onGet(url.GET_MONITORING_CLIENT_INFO).reply((config: any) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
          const randomLabels = getRandomLabels(config.params.sTime, config.params.eTime);
          const resultData = {
            responseCode: 200,
            data: {
              label: randomLabels,
              metrics: Array.from({ length: config.params.categoryType.length }, (_, index2) => {
                return {
                  category: config.params.categoryType[index2],
                  values: Array.from({ length: randomLabels.length}, () => Math.round(makeRandom(30, 200))),
                }
              })
            }
          }
          resolve([200, resultData])
        });
    });
  });

  mock.onGet(url.GET_MONITORING_SYSTEM_DATA).reply((config: any) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
          const randomLabels = getRandomLabels(config.params.sTime, config.params.eTime);
          const resultData = {
            responseCode: 200,
            data: {
              label: randomLabels,
              coreCount: (config.params.msn === "broker-1") ? 4 : (config.params.msn === "broker-2") ? 8 : 16,
              memorySize: (config.params.msn === "broker-1") ? 128 : (config.params.msn === "broker-2") ? 256 : 512,
              cpuUsage: Array.from({ length: randomLabels.length }, () => makeRandom(50, 100)),
              memoryUsed: Array.from({ length: randomLabels.length }, () => makeRandom(1, 10)),
              diskRead: Array.from({ length: randomLabels.length }, () => Math.round(makeRandom(1500, 10000))),
              diskWrite: Array.from({ length: randomLabels.length }, () => Math.round(makeRandom(3000, 8000))),
              networkRead: Array.from({ length: randomLabels.length }, () => Math.round(makeRandom(1500, 1000000))),
              networkWrite: Array.from({ length: randomLabels.length }, () => Math.round(makeRandom(3000, 800000))),
            }
          }
          resolve([200, resultData])
      });
    });
  });

  mock.onGet(url.GET_MONITORING_SYSTEM_STATUS).reply((config: any) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const resultData = {
          responseCode: 200,
          data: {
            time: new Date().getTime(),
            cpuStatus: makeRandom(50, 100),
            memoryStatus: makeRandom(60, 100),
            diskStatus: makeRandom(20, 75),
            coreCount: (config.params.msn === "broker-1") ? 4 : (config.params.msn === "broker-2") ? 8 : 16,
            memorySize: (config.params.msn === "broker-1") ? 128 : (config.params.msn === "broker-2") ? 256 : 512,
          }
        }
        resolve([200, resultData])
      });
    });
  });

  mock.onGet(url.GET_DASHBOARD_MSN_STATUS).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const resultData = {
          responseCode: 200,
          data: [
            { primary: 'alive', secondary: 'dead', msn: "MES01" },
            { primary: 'alive', secondary: 'dead', msn: "EOP01" },
            { primary: 'alive', secondary: 'dead', msn: "EDP01" },
            { primary: 'alive', secondary: 'dead', msn: "MES02" },
            { primary: 'alive', secondary: 'dead', msn: "MES03" },
          ]
        }
        resolve([200, resultData])
      });
    });
  });

  mock.onGet(url.GET_DASHBOARD_PENDING_DATA).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const resultData = {
          responseCode: 200,
          data: [
            { msn: "broker-1", mlsn: "default", queue: 'pend-queue1', count: Math.round(Math.random() * 100) },
            { msn: "broker-1", mlsn: "default", queue: 'pend-queue2', count: Math.round(Math.random() * 100) },
            { msn: "broker-1", mlsn: "vpn1", queue: 'pend-queue3', count: Math.round(Math.random() * 100) },
            { msn: "broker-2", mlsn: "vpn2", queue: 'pend-queue4', count: Math.round(Math.random() * 100) },
            { msn: "broker-3", mlsn: "vpn3", queue: 'pend-queue5', count: Math.round(Math.random() * 100) },
          ]
        }
        resolve([200, resultData])
      });
    });
  });

  mock.onGet(url.GET_DASHBOARD_TPS_DATA).reply((config: any) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const resultData = {
          responseCode: 200,
          data: [
            { msn: "broker-1", mlsn: "vpn1", queue: `${config.params.type}-tps1`, inRate: Math.round(Math.random() * 1000), avgInRate: Math.round(Math.random() * 1000) },
            { msn: "broker-2", mlsn: "vpn2", queue: `${config.params.type}-tps2`, inRate: Math.round(Math.random() * 1000), avgInRate: Math.round(Math.random() * 1000) },
            { msn: "broker-2", mlsn: "vpn3", queue: `${config.params.type}-tps3`, inRate: Math.round(Math.random() * 1000), avgInRate: Math.round(Math.random() * 1000) },
            { msn: "broker-3", mlsn: "vpn1", queue: `${config.params.type}-tps4`, inRate: Math.round(Math.random() * 1000), avgInRate: Math.round(Math.random() * 1000) },
            { msn: "broker-3", mlsn: "vpn2", queue: `${config.params.type}-tps5`, inRate: Math.round(Math.random() * 1000), avgInRate: Math.round(Math.random() * 1000) },
          ]
        }
        resolve([200, resultData])
      });
    });
  });

  const alertLevel = ["MIN", "MAJ", "CRI", "CRI"]
  const getAlertLevel = () => {
    return alertLevel[Math.floor(makeRandom(0, 3))];
  }
  mock.onGet(url.GET_DASHBOARD_ALERT_DATA).reply((config: any) => {
    const anomalyRandoms = getRandomLabels(config.params.sTime, config.params.eTime);
    const failureRandoms = getRandomLabels(config.params.sTime, config.params.eTime);
    const exceptionRandoms = getRandomLabels(config.params.sTime, config.params.eTime);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const resultData = {
          responseCode: 200,
          data: {
            anomaly: Array.from({ length: anomalyRandoms.length }, (_, index) => {
              return { id: index, alertLevel: getAlertLevel(), label: anomalyRandoms[index], title: `[이상] label ${index} 이상하고 이상하고 이상하고 이상하고 이상하고 이상하다. 이상하고 이상하고 이상하고 이상하다. 이상하고 이상하고 이상하고 이상하다.`}
            }),
            failure: Array.from({ length: failureRandoms.length }, (_, index) => {
              return { id: index, alertLevel: getAlertLevel(), label: failureRandoms[index], title: `[실패] label ${index} 실패...` }
            }),
            exception: Array.from({ length: exceptionRandoms.length }, (_, index) => {
              return { id: index, alertLevel: getAlertLevel(), label: exceptionRandoms[index], title: `[예외] label ${index} FATAL Exception: main...` }
            }),
          }
        }
        resolve([200, resultData]);
      });
    });
  });

  mock.onGet(url.GET_DASHBOARD_ALERT_DETAIL).reply((config: any) => {
    const typeIndex = config.params.id % 3;
    const typeValue = (typeIndex===0)? "anomaly" : (typeIndex===1)? "failure" : "exception";
    const title = (typeValue === "anomaly") ? '[이상] 이상하고 이상하고 이상하고 이상하고 이상하고 이상하다. 이상하고 이상하고 이상하고 이상하다. 이상하고 이상하고 이상하고 이상하다.' : (typeValue === "failure") ? '[실패] 실패하다...' : '[예외] Fatal Exception...';
    const content = (typeValue === 'anomaly') ? 'the anomaly situation' : (typeValue === 'failure') ? 'failure failure failure': `
    11-13 13:29:37.343: W/dalvikvm(3319): threadid=1: thread exiting with uncaught exception (group=0x418e3300)
    11-13 13:29:37.343: E/AndroidRuntime(3319): FATAL EXCEPTION: main
    11-13 13:29:37.343: E/AndroidRuntime(3319): java.lang.RuntimeException: Unable to instantiate activity ComponentInfo{com.example.va.datasender/com.example.va.datasender.MainActivity}: java.lang.NullPointerException
    11-13 13:29:37.343: E/AndroidRuntime(3319):     at android.app.ActivityThread.performLaunchActivity(ActivityThread.java:1983)
    11-13 13:29:37.343: E/AndroidRuntime(3319):     at android.app.ActivityThread.handleLaunchActivity(ActivityThread.java:2084)
    11-13 13:29:37.343: E/AndroidRuntime(3319):     at android.app.ActivityThread.access$600(ActivityThread.java:130)
    11-13 13:29:37.343: E/AndroidRuntime(3319):     at android.app.ActivityThread$H.handleMessage(ActivityThread.java:1195)
    `;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const resultData = {
          responseCode: 200,
          data : [{
            id: config.params.id,
            alertLevel: getAlertLevel(),
            label: new Date().getTime(),
            title: title,
            content: content
          }]
        }
        resolve([200, resultData]);
      });
    });
  });
};

export default fakeBackend;
