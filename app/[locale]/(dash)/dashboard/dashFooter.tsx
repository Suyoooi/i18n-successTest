import { RES_FOOTER_LAST_UPDATE, RES_FOOTER_REFRESH_DATA, RES_FOOTER_REFRESH_RATE } from '@/data/dash/resources';
import { refreshOptions } from '@/data/monitor/chartConstants';
import { GetLocalTimeString } from '@/data/monitor/chartUtils';
import React, { useState, useEffect } from 'react';

interface footerProps {
    refreshModeIndex :  number,
    handleRefreshMode : (index: number) => void,
    handleRefreshData : () => void,
    refreshTime: number
}

const DashboardFooter = (props: footerProps) => {

    return (
        <React.Fragment>
            <div className="d-flex justify-content-end">
                <span className="col-form-label sol_mr_6">{RES_FOOTER_REFRESH_RATE}</span>
                <select className="form-select sol_w100 sol_mr_10 bg-transparent"
                    value={props.refreshModeIndex} onChange={(selected: any) => {
                        if (parseInt(selected.target.value) > 0) props.handleRefreshMode(parseInt(selected.target.value))
                    }}>
                    {
                        refreshOptions.map((item: any, index) =>
                            <option value={index} key={item.label} className='dash-default-backcolor'>{item.label}</option>)
                    }
                </select>
                <span className="col-form-label sol_mr_6" style={{width: '230px', paddingLeft: '5px'}}>{`${RES_FOOTER_LAST_UPDATE} ${GetLocalTimeString(props.refreshTime)}`}</span>
                <button className="btn hstack btn-outline-secondary"
                    onClick={props.handleRefreshData}>{RES_FOOTER_REFRESH_DATA}</button>
            </div>
        </React.Fragment>
    );
};

export default DashboardFooter;
