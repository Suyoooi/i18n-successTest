import { reqAlertDataType, resDashAlertType } from "./dashSaga";
import { DashboardState } from "./reducer";

export function DashDataWork(reqParams: reqAlertDataType, state: DashboardState, response: any) : resDashAlertType | null {
    if(!response) return null;

    const metricData = response;
    const alertState = state;

    const mergedState: resDashAlertType = {
        lastLabel: reqParams.eTime,
        dataFirstLabel: Number.MAX_VALUE,
        dataLastLabel: alertState.alertData.dataLastLabel,
        anomaly: [],
        failure: [],
        exception: [],
    }

    /* 10분 bar 값이 유지 되도록 하기 위해서 */
    let shiftStartLabel = (Math.ceil((mergedState.lastLabel - alertState.alertPeriod + 1) / alertState.alertTickValue) - 1)*alertState.alertTickValue + 1;
    let dataLastLabel = 0;
    let dataFirstLabel = Number.MAX_VALUE;
    if (alertState.alertData.anomaly && alertState.alertData.anomaly.length > 0) {
        let index = 0;
        let shiftCount = 0;
        while (alertState.alertData.anomaly && alertState.alertData.anomaly.length > 0 && alertState.alertData.anomaly[index++].label < shiftStartLabel) {
            shiftCount++;
        }
        if (metricData && metricData.anomaly && metricData.anomaly.length > 0) {
            if(shiftCount > 0) {
                mergedState.anomaly = [...alertState.alertData.anomaly.slice(shiftCount, alertState.alertData.anomaly.length), ...metricData.anomaly];
            }else{
                mergedState.anomaly = [...alertState.alertData.anomaly, ...metricData.anomaly];
            }
            dataLastLabel = (metricData.anomaly.at(-1).label > dataLastLabel)? metricData.anomaly.at(-1).label: dataLastLabel;
        } else {
            if (shiftCount > 0) {
                mergedState.anomaly = [...alertState.alertData.anomaly.slice(shiftCount, alertState.alertData.anomaly.length)];
            }else{
                mergedState.anomaly = alertState.alertData.anomaly;
            }
        }
        dataFirstLabel = (mergedState.anomaly.length > 0 && mergedState.anomaly[0].label < dataFirstLabel) ? mergedState.anomaly[0].label : dataFirstLabel;
    } else {
        if(metricData.anomaly && metricData.anomaly.length > 0){
            mergedState.anomaly = metricData.anomaly;
            dataLastLabel = (metricData.anomaly.at(-1).label > dataLastLabel)? metricData.anomaly.at(-1).label: dataLastLabel;
            dataFirstLabel = (metricData.anomaly.length > 0 && metricData.anomaly[0].label < dataFirstLabel) ? metricData.anomaly[0].label : dataFirstLabel;
        } 
    }

    if (alertState.alertData.failure && alertState.alertData.failure.length > 0) {
        let index = 0;
        let shiftCount = 0;
        while (alertState.alertData.failure && alertState.alertData.failure.length > 0 && alertState.alertData.failure[index++].label < shiftStartLabel) {
            shiftCount++;
        }
        if (metricData && metricData.failure && metricData.failure.length > 0) {
            if(shiftCount > 0) {
                mergedState.failure = [...alertState.alertData.failure.slice(shiftCount, alertState.alertData.failure.length), ...metricData.failure];
            }else{
                mergedState.failure = [...alertState.alertData.failure, ...metricData.failure];
            }
            dataLastLabel = (metricData.failure.at(-1).label > dataLastLabel)? metricData.failure.at(-1).label: dataLastLabel;
        } else {
            if (shiftCount > 0) {
                mergedState.failure = [...alertState.alertData.failure.slice(shiftCount, alertState.alertData.failure.length)];
            }else{
                mergedState.failure = alertState.alertData.failure;
            }
        }
        dataFirstLabel = (mergedState.failure.length > 0 && mergedState.failure[0].label < dataFirstLabel) ? mergedState.failure[0].label : dataFirstLabel;
    } else {
        if(metricData.failure && metricData.failure.length > 0) {
            mergedState.failure = metricData.failure;
            dataLastLabel = (metricData.failure.at(-1).label > dataLastLabel)? metricData.failure.at(-1).label: dataLastLabel;
            dataFirstLabel = (metricData.failure.length > 0 && metricData.failure[0].label < dataFirstLabel) ? metricData.failure[0].label : dataFirstLabel;
        } 
    }

    if (alertState.alertData.exception && alertState.alertData.exception.length > 0) {
        let index = 0;
        let shiftCount = 0;
        while (alertState.alertData.exception && alertState.alertData.exception.length > 0 && alertState.alertData.exception[index++].label < shiftStartLabel) {
            shiftCount++;
        }
        if (metricData && metricData.exception && metricData.exception.length > 0) {
            if(shiftCount > 0) {
                mergedState.exception = [...alertState.alertData.exception.slice(shiftCount, alertState.alertData.exception.length), ...metricData.exception];
            }else{
                mergedState.exception = [...alertState.alertData.exception, ...metricData.exception];
            }
            dataLastLabel = (metricData.exception.at(-1).label > dataLastLabel)? metricData.exception.at(-1).label: dataLastLabel;
        } else {
            if (shiftCount > 0) {
                mergedState.exception = [...alertState.alertData.exception.slice(shiftCount, alertState.alertData.exception.length)];
            }else{
                mergedState.exception = alertState.alertData.exception;
            }
        }
        dataFirstLabel = (mergedState.exception.length > 0 && mergedState.exception[0].label < dataFirstLabel) ? mergedState.exception[0].label : dataFirstLabel;
    } else {
        if(metricData.exception && metricData.exception.length > 0) {
            mergedState.exception = metricData.exception;
            dataLastLabel = (metricData.exception.at(-1).label > dataLastLabel)? metricData.exception.at(-1).label: dataLastLabel;
            dataFirstLabel = (metricData.exception.length > 0 && metricData.exception[0].label < dataFirstLabel) ? metricData.exception[0].label : dataFirstLabel;
        }
    }

    if(dataLastLabel > 0) {
        mergedState.dataLastLabel = dataLastLabel;
    }
    mergedState.dataFirstLabel = dataFirstLabel;

    return mergedState;
}