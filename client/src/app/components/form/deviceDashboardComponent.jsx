import React from 'react';
import '../../utils/yup-validations';
import BlockUi from "react-block-ui";
import {injectIntl} from 'react-intl';
import {BsBatteryFull, BsClock, BsFillCloudArrowUpFill} from "react-icons/bs";
import {MdBatterySaver, MdOutlineWarningAmber, MdPower, MdWifiTethering, MdLocationOn} from "react-icons/md";
import PositionMap from "../position-map/positionMap";
import apiService from "../../services/apiService";
import deviceService from "../../services/deviceService";
import {OverlayTrigger, Tooltip} from "react-bootstrap";

class DeviceDashboardComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            intl: props.intl,
            id: props.entity,
            device: {},
            last_communication_timestamp: '',
            last_communication_timeserver: '',
            last_gateway_used: '',
            last_power_on_off_timestamp: '',
            last_power_on_off_value: '',
            last_battery_voltage_timestamp: '',
            last_battery_voltage_value: '',
            last_power_saving_mode_timestamp: '',
            last_power_saving_mode_value: '',
            last_position: {},
            last_alarm_timestamp: '',
            last_alarm_id: '',
            pendingConfigMessages: [],
            loading: false,
            blocking: false,
            style: {"display":"inline-block","font-size": "0.875em","font-weight": "normal"}
        };
    }

    componentDidMount() {
        this.initDashboard();
    }

    componentDidUpdate(prevProps, prevState) {
        if (!this.isEqualObject(this.props, prevProps)) {
            this.setState({id: this.props.entity})
            this.initDashboard();
        }
    }

    componentWillUnmount() {
    }

    initDashboard() {
        this.setState({blocking: true});

        Promise.all([
            apiService.getById('device', this.state.id),
            deviceService.dashboard(this.state.id),
            deviceService.getPendingConfig(this.state.id)
        ]).then(allResponses => {
            const device = allResponses[0];
            const dashboard = allResponses[1];
            const pendingConfigMessages = allResponses[2];

            this.setState({device: device.devices[0]});
            this.setState({pendingConfigMessages: pendingConfigMessages.length});
            this.setDashboardValues(dashboard);

            this.setState({blocking: false});
        });
    }

    setDashboardValues(values) {
        if ('last_communication_timestamp' in values && values.last_communication_timestamp !== '') {
            this.setState({last_communication_timestamp: values.last_communication_timestamp});
        }

        if ('last_communication_timeserver' in values && values.last_communication_timeserver !== '') {
            this.setState({last_communication_timeserver: values.last_communication_timeserver});
        }

        if ('last_gateway_used' in values && values.last_gateway_used !== '') {
            this.setState({last_gateway_used: values.last_gateway_used});
        }

        if ('last_power_on_off_timestamp' in values && values.last_power_on_off_timestamp !== '') {
            this.setState({last_power_on_off_timestamp: values.last_power_on_off_timestamp});
            this.setState({last_power_on_off_value: values.last_power_on_off_value});
        }

        if ('last_battery_voltage_timestamp' in values && values.last_battery_voltage_timestamp !== '') {
            this.setState({last_battery_voltage_timestamp: values.last_battery_voltage_timestamp});
            this.setState({last_battery_voltage_value: `${values.last_battery_voltage_value}%`});
        }

        if ('last_power_saving_mode_timestamp' in values && values.last_power_saving_mode_timestamp !== '') {
            this.setState({last_power_saving_mode_timestamp: values.last_power_saving_mode_timestamp});
            this.setState({last_power_saving_mode_value: values.last_power_saving_mode_value});
        }

        if ('last_alarm_timestamp' in values && values.last_alarm_timestamp !== '') {
            this.setState({last_alarm_timestamp: values.last_alarm_timestamp});
            this.setState({last_alarm_id: values.last_alarm_id});
        }

        if ('last_position' in values && JSON.stringify(values.last_position) !== '{}') {
            this.setState({last_position: values.last_position});
        }
    }

    isEqualObject = (obj1, obj2) => {
        return JSON.stringify(obj1) === JSON.stringify(obj2);
    };

    

    render() {
        return (
            <BlockUi tag='div' blocking={this.state.blocking}>
                <form className='card card-custom'>
                    <div className={`card-header py-3`}>
                        <div className='card-title align-items-start flex-column'>
                            <h3 className='card-label font-weight-bolder text-dark'>
                                Device {this.state.device.id}
                                <small> {this.state.device.label}</small>
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
                                    <li><BsClock /> Timestamp: {this.state.last_communication_timestamp}</li>
                                    <li><BsFillCloudArrowUpFill /> Timeserver: {this.state.last_communication_timeserver}</li>
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
                                    <li><BsBatteryFull /> Battery: {this.state.last_battery_voltage_value}</li>
                                    <li><BsClock /> Timestamp: {this.state.last_battery_voltage_timestamp}</li>
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
                                    <li><MdPower /> On/Off: {this.state.last_power_on_off_value}</li>
                                    <li><BsClock /> Timestamp: {this.state.last_power_on_off_timestamp}</li>
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
                                    <li><MdBatterySaver /> Value: {this.state.last_power_saving_mode_value}</li>
                                    <li><BsClock /> Timestamp: {this.state.last_power_saving_mode_timestamp}</li>
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
                                    <li><MdWifiTethering /> {this.state.last_gateway_used}</li>
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
                                    <li><MdOutlineWarningAmber /> ID: {this.state.last_alarm_id}</li>
                                    <li><BsClock /> Timestamp: {this.state.last_alarm_timestamp}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='row mt-3'>
                    <div className='col-xl-10 col-lg-10'>
                        <div className='card card-custom'>
                            <div className='card-header'>
                                <div className='card-title' style={this.state.style}>
                                        <h3 className="card-label" style={this.state.pStyle}>
                                            Last Position
                                        </h3>
                                        <MdLocationOn /> Last Coordinates:  Lat:{this.state.device.latitude} Long:{this.state.device.longitude}
                                        <br></br>
                                    <BsClock /> Timestamp:  {this.state.device.position_timestamp}
                                
                                </div>
                            </div>
                            <div className='card-body'>
                                <PositionMap position={this.state.last_position} />
                            </div>
                        </div>
                    </div>
                    <div className='col-xl-2 col-lg-2'>
                        <div className='card card-custom'>
                            <div className='card-body'>
                                <div className="d-flex align-items-center py-lg-0 py-2">
                                    <div className="d-flex flex-column text-right">
                                        <span className="text-dark-75 font-weight-bolder font-size-h4">
                                            {this.state.pendingConfigMessages}
                                        </span>
                                        <span className="text-muted font-size-sm font-weight-bolder">
                                            <OverlayTrigger
                                                key={'top'}
                                                placement={'top'}
                                                overlay={
                                                    <Tooltip id={`tooltip-top`}>
                                                        {this.state.intl.formatMessage({id: 'DEVICE.QTT_PENDING_MESSAGES'})}
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
            </BlockUi>
        );
    }
}

export default injectIntl(DeviceDashboardComponent);