import React, { useEffect, useState } from 'react';
import '../../utils/yup-validations';
import BlockUi from "react-block-ui";
import {injectIntl} from 'react-intl';
import {BsBatteryFull, BsClock, BsFillCloudArrowUpFill} from "react-icons/bs";
import {MdBatterySaver, MdOutlineWarningAmber, MdPower, MdWifiTethering} from "react-icons/md";
import PositionMap from "../position-map/positionMap";
import apiService from "../../services/apiService";
import deviceService from "../../services/deviceService";
import utils from "../../utils/utils";
import {OverlayTrigger, Tooltip} from "react-bootstrap";

function DeviceDashboard(props) {
    
    const [blocking, setBlocking] = useState(true);
    const [device, setDevice] = useState({});
    const [dashboard, setDashboard] = useState({});
    const [pendingConfigMessages, setPendingConfigMessages] = useState(0)

    function initDashboard() {
        Promise.all([
            apiService.getById('device', props.id),
            deviceService.dashboard(props.id),
            deviceService.getPendingConfig(props.id)
        ]).then(allResponses => {
            const device = allResponses[0]
            const dashboard = allResponses[1]
            const pendingConfigMessages = allResponses[2]
            
            setDevice(device.devices[0])
            setDashboard(dashboard)
            setPendingConfigMessages(pendingConfigMessages.length)
            setBlocking(false);
        });
    }

    useEffect(()=> {
        initDashboard();
    },[])
    
    return (
            <BlockUi tag='div' blocking={blocking}>
                <form className='card card-custom'>
                    <div className={`card-header py-3`}>
                        <div className='card-title align-items-start flex-column'>
                            <h3 className='card-label font-weight-bolder text-dark'>
                                Device {device.id}
                                <small> {device.label}</small>
                            </h3>
                        </div>
                    </div>
                </form>

                <div className='row mt-3'>
                    <div className='col-xl-4 col-lg-4'>
                        <div className='card card-custom'>
                            <div className='card-header'>
                                <div className='card-title'>
                                    <h3 className="card-label">
                                        Last communication
                                    </h3>
                                </div>
                            </div>
                            <div className='card-body'>
                                <ul style={{'listStyle': 'none'}}>
                                    <li><BsClock /> Timestamp: {dashboard.last_communication_timestamp}</li>
                                    <li><BsFillCloudArrowUpFill /> Timeserver: {utils.either(dashboard.last_communication_timeserver, 'N/A')}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className='col-xl-4 col-lg-4'>
                        <div className='card card-custom'>
                            <div className='card-header'>
                                <div className='card-title'>
                                    <h3 className="card-label">
                                        Last Battery voltage
                                    </h3>
                                </div>
                            </div>
                            <div className='card-body'>
                                <ul style={{'listStyle': 'none'}}>
                                    <li><BsBatteryFull /> Battery: {dashboard.last_battery_voltage_value}</li>
                                    <li><BsClock /> Timestamp: {utils.either(dashboard.last_battery_voltage_timestamp, 'N/A')}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className='col-xl-4 col-lg-4'>
                        <div className='card card-custom'>
                            <div className='card-header'>
                                <div className='card-title'>
                                    <h3 className="card-label">
                                        Last device power on/off"
                                    </h3>
                                </div>
                            </div>
                            <div className='card-body'>
                                <ul style={{'listStyle': 'none'}}>
                                    <li><MdPower /> On/Off: {dashboard.last_power_on_off_value}</li>
                                    <li><BsClock /> Timestamp: {utils.either(dashboard.last_power_on_off_timestamp, 'N/A')}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='row mt-3'>
                    <div className='col-xl-4 col-lg-4'>
                        <div className='card card-custom'>
                            <div className='card-header'>
                                <div className='card-title'>
                                    <h3 className="card-label">
                                        Last power saving mode
                                    </h3>
                                </div>
                            </div>
                            <div className='card-body'>
                                <ul style={{'listStyle': 'none'}}>
                                    <li><MdBatterySaver /> Value: {dashboard.last_power_saving_mode_value}</li>
                                    <li><BsClock /> Timestamp: {utils.either(dashboard.last_power_saving_mode_timestamp, 'N/A')}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className='col-xl-4 col-lg-4'>
                        <div className='card card-custom'>
                            <div className='card-header'>
                                <div className='card-title'>
                                    <h3 className="card-label">
                                        Last gateway used
                                    </h3>
                                </div>
                            </div>
                            <div className='card-body'>
                                <ul style={{'listStyle': 'none'}}>
                                    <li><MdWifiTethering /> {utils.either(dashboard.last_gateway_used,'N/A')}</li>
                                    <li style={{visibility: 'hidden'}}><MdWifiTethering /></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className='col-xl-4 col-lg-4'>
                        <div className='card card-custom'>
                            <div className='card-header'>
                                <div className='card-title'>
                                    <h3 className="card-label">
                                        Last alarm
                                    </h3>
                                </div>
                            </div>
                            <div className='card-body'>
                                <ul style={{'listStyle': 'none'}}>
                                    <li><MdOutlineWarningAmber /> ID: {dashboard.last_alarm_id}</li>
                                    <li><BsClock /> Timestamp: {utils.either(dashboard.last_alarm_timestamp, 'N/A')}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='row mt-3'>
                    <div className='col-xl-10 col-lg-10'>
                        <div className='card card-custom'>
                            <div className='card-header'>
                                <div className='card-title'>
                                    <h3 className="card-label">
                                        Last position
                                    </h3>
                                </div>
                            </div>
                            <div className='card-body'>
                                <PositionMap position={dashboard.last_position} />
                            </div>
                        </div>
                    </div>
                    <div className='col-xl-2 col-lg-2'>
                        <div className='card card-custom'>
                            <div className='card-body'>
                                <div className="d-flex align-items-center py-lg-0 py-2">
                                    <div className="d-flex flex-column text-right">
                                        <span className="text-dark-75 font-weight-bolder font-size-h4">
                                            {pendingConfigMessages}
                                        </span>
                                        <span className="text-muted font-size-sm font-weight-bolder">
                                            <OverlayTrigger
                                                key={'top'}
                                                placement={'top'}
                                                overlay={
                                                    <Tooltip id={`tooltip-top`}>
                                                        {props.intl.formatMessage({id: 'DEVICE.QTT_PENDING_MESSAGES'})}
                                                    </Tooltip>
                                                }
                                            >
                                            <span>config messages</span>
                                            </OverlayTrigger>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </BlockUi>)
}

export default injectIntl(DeviceDashboard);