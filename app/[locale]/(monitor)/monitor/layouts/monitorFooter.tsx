import { RES_FOOTER_END, RES_FOOTER_TITLE } from '@/data/monitor/resources';
import React from 'react';

const MonitorFooter = () => {
    return (
        <React.Fragment>
            <div className='d-flex justify-content-between'>
                <h6 className='col-form-label p-2'>{RES_FOOTER_TITLE}</h6>
                <h6 className='col-form-label p-2'>{RES_FOOTER_END}</h6>
            </div>
        </React.Fragment>
    );
};

export default MonitorFooter;
