import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import SVG from "react-inlinesvg";
import { useNavigate } from 'react-router-dom';
import { toAbsoluteUrl } from '../../../_metronic/_helpers';
import apiService from '../../services/apiService';
import notificationService from '../../services/notificationService';
import { useSelector } from 'react-redux';
import { Layout } from '../../../_metronic/layout';

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
    leftIcon: {
        marginRight: theme.spacing(1),
    }
}));


export function Dashboard() {
    const classes = useStyles();
    const navigate = useNavigate()
    const [devices, setDevices] = useState(0);
    const [groups, setGroups] = useState(0);
    const [thresholds, setThresholds] = useState(0);
    const [alarms, setAlarms] = useState(0);
    const { permissions } = useSelector(({ auth }) => ({ permissions: auth.permissions }))

    useEffect(() => {
        apiService.count('device').then((r) => { if ("affected" in r) setDevices(r.affected) });
        apiService.count('group').then((r) => { if ("affected" in r) setGroups(r.affected) });
        apiService.count('threshold').then((r) => { if ("affected" in r) setThresholds(r.affected) });
        notificationService.count('alarm', 'created', '-', '-').then((r) => {
            if (typeof r.affected !== 'undefined') {
                setAlarms(r.affected)
            }
        });
    }, []);

    return (
        <Layout>
            <div className={'row'} style={{ marginBottom: "1rem" }}>
                {permissions.canViewDevices ?
                    <div className={'col-lg-3 col-xxl-3'}>
                        <div className={'card'}>
                            <div className={'card-body p-0'} style={{ position: 'relative' }}>
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
                                            Devices
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> : <></>}
                {permissions.canViewGroups ?
                    <div className={'col-lg-3 col-xxl-3'}>
                        <div className={'card'}>
                            <div className={'card-body p-0'} style={{ position: 'relative' }}>
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
                                            Groups
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> : <></>}
                {permissions.canViewThresholds ?
                    <div className={'col-lg-3 col-xxl-3'}>
                        <div className={'card'}>
                            <div className={'card-body p-0'} style={{ position: 'relative' }}>
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
                                            Thresholds
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> : <></>}
                {permissions.canViewAlarms ?
                    <div className={'col-lg-3 col-xxl-3'}>
                        <div className={'card'}>
                            <div className={'card-body p-0'} style={{ position: 'relative' }}>
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
                                            Alarms
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> : <></>}
            </div>
            <div className={'row'}>
                <div className={'col-lg-3 col-xxl-3'}>
                    <div className={'card'}>
                        <div className={'card-body p-0'} style={{ position: 'relative' }}>
                            <div className={'d-flex align-items-center justify-content-between card-spacer flex-grow-1'}>
                                <span className={'symbol circle symbol-50 symbol-light-success mr-2'}>
                                    <span className={'symbol-label'}>
                                        <span className={'svg-icon svg-icon-xl svg-icon-success'}>
                                            <SVG src={toAbsoluteUrl("/media/svg/icons/Code/Info-circle.svg")} />
                                        </span>
                                    </span>
                                </span>
                                <div className={' text-right'}>
                                    <Button
                                        variant='outlined'
                                        color='secondary'
                                        className={classes.button}
                                        onClick={() => {
                                            navigate('/whatsnew')
                                        }}>
                                        What's New Page
                                    </Button>
                                    <br></br>
                                    <span className={'text-muted font-weight-bold mt-2'}>
                                        Discover the latest updates to the Sensefinty Web Application!
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
