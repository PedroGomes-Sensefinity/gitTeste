import React, { useEffect } from 'react';
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from '../../../_metronic/_helpers';
import apiService from '../../services/apiService';
import notificationService from '../../services/notificationService';

export function Dashboard() {
    const [devices, setDevices] = React.useState(0);
    const [groups, setGroups] = React.useState(0);
    const [thresholds, setThresholds] = React.useState(0);
    const [alarms, setAlarms] = React.useState(0);

    useEffect(() => {
        apiService.count('device').then((r) => { if ("affected" in r ) setDevices(r.affected) });
        apiService.count('group').then((r) => { if ("affected" in r ) setGroups(r.affected) });
        apiService.count('threshold').then((r) => { if ("affected" in r ) setThresholds(r.affected) });
        notificationService.count('alarm', 'created', '-', '-').then((r) => {
            if(typeof r.affected !== 'undefined') {
                setAlarms(r.affected)
            }
        });
    }, []);

    return (
        <div className={'row'}>
            <div className={'col-lg-3 col-xxl-3'}>
                <div className={'card'}>
                    <div className={'card-body p-0'} style={{position: 'relative'}}>
                        <div className={'d-flex align-items-center justify-content-between card-spacer flex-grow-1'}>
                            <span className={'symbol circle symbol-50 symbol-light-success mr-2'}>
                                <span className={'symbol-label'}>
                                    <span className={'svg-icon svg-icon-xl svg-icon-success'}>
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/Devices/Router2.svg")} />
                                    </span>
                                </span>
                            </span>
                            <div className={'d-flex flex-column text-right'}>
                                <span className={'text-dark-75 font-weight-bolder font-size-h3'}>
                                    {devices}
                                </span>
                                <span className={'text-muted font-weight-bold mt-2'}>
                                    devices
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={'col-lg-3 col-xxl-3'}>
                <div className={'card'}>
                    <div className={'card-body p-0'} style={{position: 'relative'}}>
                        <div className={'d-flex align-items-center justify-content-between card-spacer flex-grow-1'}>
                            <span className={'symbol circle symbol-50 symbol-light-success mr-2'}>
                                <span className={'symbol-label'}>
                                    <span className={'svg-icon svg-icon-xl svg-icon-success'}>
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")} />
                                    </span>
                                </span>
                            </span>
                            <div className={'d-flex flex-column text-right'}>
                                <span className={'text-dark-75 font-weight-bolder font-size-h3'}>
                                    {groups}
                                </span>
                                <span className={'text-muted font-weight-bold mt-2'}>
                                    groups
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={'col-lg-3 col-xxl-3'}>
                <div className={'card'}>
                    <div className={'card-body p-0'} style={{position: 'relative'}}>
                        <div className={'d-flex align-items-center justify-content-between card-spacer flex-grow-1'}>
                            <span className={'symbol circle symbol-50 symbol-light-success mr-2'}>
                                <span className={'symbol-label'}>
                                    <span className={'svg-icon svg-icon-xl svg-icon-success'}>
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/Devices/Diagnostics.svg")} />
                                    </span>
                                </span>
                            </span>
                            <div className={'d-flex flex-column text-right'}>
                                <span className={'text-dark-75 font-weight-bolder font-size-h3'}>
                                    {thresholds}
                                </span>
                                <span className={'text-muted font-weight-bold mt-2'}>
                                    thresholds
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={'col-lg-3 col-xxl-3'}>
                <div className={'card'}>
                    <div className={'card-body p-0'} style={{position: 'relative'}}>
                        <div className={'d-flex align-items-center justify-content-between card-spacer flex-grow-1'}>
                            <span className={'symbol circle symbol-50 symbol-light-success mr-2'}>
                                <span className={'symbol-label'}>
                                    <span className={'svg-icon svg-icon-xl svg-icon-success'}>
                                        <SVG src={toAbsoluteUrl("/media/svg/icons/General/Fire.svg")} />
                                    </span>
                                </span>
                            </span>
                            <div className={'d-flex flex-column text-right'}>
                                <span className={'text-dark-75 font-weight-bolder font-size-h3'}>
                                    {alarms}
                                </span>
                                <span className={'text-muted font-weight-bold mt-2'}>
                                    alarms
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
