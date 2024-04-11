import { dataSourceType, defaultChartColor } from "./chartConstants";

export const GetChartLabelString = (value: any) => {
    const dateTime: Date = (typeof value === 'number') ? new Date(value) : new Date(Number(value));
    const hours = dateTime.getHours().toString().padStart(2, "0");
    const minutes = dateTime.getMinutes().toString().padStart(2, "0");
    // const seconds = dateTime.getSeconds().toString().padStart(2, "0");
    // return `${hours}:${minutes}:${seconds}`;
    return `${hours}:${minutes}`;
};

export const GetLocalTimeString = (value: any) => {
    const dateTime: Date = (typeof value === 'number') ? new Date(value) : new Date(Number(value));
    const year = dateTime.getFullYear().toString();
    const month = (dateTime.getMonth() + 1).toString().padStart(2, "0");
    const date = dateTime.getDate().toString().padStart(2, "0");
    const hours = dateTime.getHours().toString().padStart(2, "0");
    const minutes = dateTime.getMinutes().toString().padStart(2, "0");
    const seconds = dateTime.getSeconds().toString().padStart(2, "0");
    return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
}

export const GetChartColors = (sourceType: string) => {
    switch (sourceType) {
        case dataSourceType.CPU_USAGE: return ['#48A8FF'];
        case dataSourceType.MEMORY_USAGE: return ['#48A8FF'];
        case dataSourceType.DISK_USAGE: return ['#13D6B0','#E7B400'];
        case dataSourceType.NETWORK_USAGE: return ['#13D6B0','#E7B400'];
        case dataSourceType.PENDING: return ['#06CEAA','#F82B9A','#569FFF','#E7B400','#2274DF'];
        case dataSourceType.THROUGHPUT: return ['#06CEAA','#F82B9A','#569FFF','#E7B400','#2274DF','#FF8717','#98D400','#9A26FF','#03C75A','#642EFF'];
        case dataSourceType.CONNECTION: return ['#2274DF', defaultChartColor[17]];
        default: return [defaultChartColor[18], defaultChartColor[19]];
    }
};

const KB = 1024;
const MB = 1024 * KB;
const GB = 1024 * MB;

export const ConvBSizeUnit = (value: number) => {
  if (value < KB) return `${value}B`;
  else if (value < MB) return `${(value / KB).toFixed(1)}KB`;
  else if (value < GB) return `${(value / MB).toFixed(1)}MB`;
  else {
    return `${(value / GB).toFixed(1)}GB`;
  };
};

export const ConvCountUnit = (value: number) => {
  if(value < 1000) return Math.round(value).toString();
  else if(value >= 1000 && value < 1000000 ) return `${(value / 1000).toFixed(1)}K`;
  else if(value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
}

export const YFormatType =  {
  PERCENT: '%',
  GB : 'GB',
  MB : 'MB',
  BYTE: 'B',
  COUNT: 'C'
};

export const GetYAxisFormatter = (yFormatType: string) => {
  switch (yFormatType) {
    case YFormatType.PERCENT:
      return (value: number, index: number) => `${value.toFixed(1)}%`;
    case YFormatType.GB:
      return (value: number, index: number) => `${value.toFixed(1)}GB`;
    case YFormatType.MB:
      return (value: number, index: number) => `${value.toFixed(1)}MB`;
    case YFormatType.BYTE:
      return (value: number, index: number) => `${ConvBSizeUnit(value)}`;
    default:
      return (value: number, index: number) => `${ConvCountUnit(value)}`;
  }
};

export const makeChartTitle = (sourceType: string, prefix: string, postfix: string, lastValues: number[]): string => {

  if (sourceType === dataSourceType.PENDING || sourceType === dataSourceType.THROUGHPUT || sourceType === dataSourceType.CONNECTION)
    return '';

  if (!lastValues || lastValues.length <= 0)
    return prefix; //baseTitle

  let dispValues = '';
  let unit='';

  switch (sourceType) {
    case dataSourceType.CPU_USAGE:
      dispValues = lastValues.map((item: number) => `${item.toFixed(1)}%`).join(' / ');
      break;
    case dataSourceType.MEMORY_USAGE:
      dispValues = lastValues.map((item: number) => `${item.toFixed(1)}GB`).join(' / ');
      unit = 'GB';
      break;
    case dataSourceType.DISK_USAGE:
      dispValues = lastValues.map((item: number) => `${ConvBSizeUnit(item)}`).join(' / ');
      break;
    case dataSourceType.NETWORK_USAGE:
      dispValues = lastValues.map((item: number) => `${ConvBSizeUnit(item)}`).join(' / ');
      break;
    default:
      return '';
  }

  return `${prefix}: ${dispValues} ${postfix ? (' / ' + `${Math.round(Number(postfix))}${unit}` ) : ''}`;
};

export const GetSourceType = (sourceType: string) => {
    switch(sourceType) {
        case dataSourceType.PENDING: return dataSourceType.PENDING;
        case dataSourceType.THROUGHPUT: return dataSourceType.THROUGHPUT;
        case dataSourceType.CONNECTION: return dataSourceType.CONNECTION;
        case dataSourceType.CPU_USAGE: return dataSourceType.CPU_USAGE;
        case dataSourceType.DISK_USAGE: return dataSourceType.DISK_USAGE;
        case dataSourceType.MEMORY_USAGE: return dataSourceType.MEMORY_USAGE;
        case dataSourceType.NETWORK_USAGE: return dataSourceType.NETWORK_USAGE;
        default: return dataSourceType.PENDING;
    }
}

export const GetFillMode = (sourceType: string) => {
    switch(sourceType) {
        case dataSourceType.PENDING:
        case dataSourceType.THROUGHPUT:
          return false;
        case dataSourceType.CONNECTION:
        case dataSourceType.CPU_USAGE:
        case dataSourceType.DISK_USAGE:
        case dataSourceType.MEMORY_USAGE:
        case dataSourceType.NETWORK_USAGE:
        default: return true;
    }
}

/*
 data 가 label 기준으로 sort 되어 있다는 가정하에 실행한다.
mode : minmax, avg
*/
function applyMinMax(resValues: number[][], data: number[][]) {
  if(data.length === 0) return;
  let min = [0,Number.MAX_SAFE_INTEGER];
  let max = [0,0];

  data.forEach(item => {
    if(item[1] < min[1]) min = item;
    if(item[1] > max[1]) max = item; // 하나 밖에 없는 경우 때문에 else if
  })

  if(min[0] < max[0]) {
    if(min[0] !== 0) resValues.push(min);
    if(max[0] !== 0) resValues.push(max);
  }else if(min[0] > max[0]){
    if(max[0] !== 0) resValues.push(max);
    if(min[0] !== 0) resValues.push(min);
  }else{
    resValues.push(min);
  }
}

const onehour= 1000*60*60;
function getTickValue (period: number) {
  const hours = Math.floor(period/(onehour));
  if(hours < 24) return 0;
  // else if(hours >= 12 && hours < 24) return 1000*60; // 1day - 1 min
  else if(hours >= 24 && hours < 24*2) return 1000*60; // 2day - 
  // else if(hours >= 24*2 && hours < 24*3) return 1000*60*2; // 3day
  else if(hours >= 24*2 && hours < 24*4) return 1000*90; // 4day
  // else if(hours >= 24*4 && hours < 24*5) return 1000*60*20; // 5day
  // else if(hours >= 24*5 && hours < 24*6) return 1000*60*30; // 5day
  else return 1000*60*2; // >=6day - 1 hours
}

export function GetPreProcessedChartData(startLabel: number,endLabel: number, data : number[][], mode: string) {
  if(!data || data.length === 0) return [];

  const tickValueTime = getTickValue(endLabel-startLabel + 1);
  if(tickValueTime === 0) return data;

  const resTickValues: number[][]  = [];
  // return data.map((item: number[]) => [Math.ceil(item[0]/tickValueTime)*tickValueTime,item[1]]);
  let checkTickValue : number = 0;
  let tickValues : number[][] = [];
  data.forEach((item: number[]) => {
    const tickValue = Math.ceil(item[0]/tickValueTime)*tickValueTime;
    if(tickValue > checkTickValue) {
      applyMinMax(resTickValues, tickValues);
      tickValues = [item];
      checkTickValue = tickValue;
    }else{
      tickValues.push(item);
    }
  });
  
  if(tickValues.length > 0) applyMinMax(resTickValues, tickValues);

  console.log("count:" + data.length + " diff:" + (endLabel-startLabel+1) + " tickValue: " + tickValueTime + " rcount:" + resTickValues.length)
  if(data.length < resTickValues.length) {
    console.log(data);
    console.log(resTickValues);
  }

  return resTickValues;
}

export function asciiTobase64Url(asciiData : string) : string{
  if(!asciiData || asciiData.length === 0) return '';
  return encodeURIComponent(btoa(asciiData));
}

export function base64UrlToAscii(base64UrlData: string) : string{
  if(!base64UrlData || base64UrlData.length === 0) return '';
  return atob(decodeURIComponent(base64UrlData));
}