import React from 'react';
import deviceService from '../../services/deviceService';
import apiService from '../../services/apiService';
import '../../utils/yup-validations';
import BlockUi from "react-block-ui";
import {injectIntl} from 'react-intl';
import {BsClock, BsFillCloudArrowUpFill, BsBatteryFull} from "react-icons/bs";
import {MdPower, MdBatterySaver, MdWifiTethering, MdOutlineWarningAmber} from "react-icons/md";
import PositionMap from "../position-map/positionMap";
class DeviceDashboardComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            intl: props.intl,
            id: props.entity,
            device: {},
            dashboard: {
                last_communication_timestamp: '',
                last_communication_timeserver: '',
                last_gateway_used: '',
                last_power_on_off_timestamp: '',
                last_power_on_off_value: '',
                last_battery_voltage_timestamp: '',
                last_battery_voltage_value: '',
                last_power_saving_mode_timestamp: '',
                last_power_saving_mode_value: '',
                last_position: {
                    lat: 46.94795471025061,
                    lon: 7.4510452289808615
                },
                last_alarm_timestamp: '',
                last_alarm_id: '',
            },
            loading: false,
            blocking: false,
        };
    }

    componentDidMount() {
        this.setState({blocking: true});
        apiService.getById('device', this.state.id).then((response) => {
            const device = response.devices[0];
            this.setState({device: device})
            this.setState({blocking: false});
        });
        deviceService.dashboard(this.state.id).then((response) => {
            this.setState({dashboard: response})
            this.setState({blocking: false});
        });
    }

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
                                    <li><BsClock /> Timestamp: {this.state.dashboard.last_communication_timestamp}</li>
                                    <li><BsFillCloudArrowUpFill /> Timeserver: {this.state.dashboard.last_communication_timeserver}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className='col-xl-4 col-lg-4'>
                        <div className='card card-custom'>
                            <div className='card-header'>
                                <div className='card-title'>
                                    <h3 className="card-label">
                                        Battery voltage
                                    </h3>
                                </div>
                            </div>
                            <div className='card-body'>
                                <ul style={{'listStyle': 'none'}}>
                                    <li><BsBatteryFull /> Battery: {this.state.dashboard.last_battery_voltage_value}</li>
                                    <li><BsClock /> Timestamp: {this.state.dashboard.last_battery_voltage_timestamp}</li>
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
                                    <li><MdPower /> On/Off: {this.state.dashboard.last_power_on_off_timestamp}</li>
                                    <li><BsClock /> Timestamp: {this.state.dashboard.last_power_on_off_value}</li>
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
                                    <li><MdBatterySaver /> Value: {this.state.dashboard.last_power_saving_mode_value}</li>
                                    <li><BsClock /> Timestamp: {this.state.dashboard.last_power_saving_mode_timestamp}</li>
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
                                    <li><MdWifiTethering /> {this.state.dashboard.last_gateway_used}</li>
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
                                    <li><MdOutlineWarningAmber /> ID: {this.state.dashboard.last_alarm_id}</li>
                                    <li><BsClock /> Timestamp: {this.state.dashboard.last_alarm_timestamp}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='row mt-3'>
                    <div className='col-xl-12 col-lg-12'>
                        <div className='card card-custom'>
                            <div className='card-header'>
                                <div className='card-title'>
                                    <h3 className="card-label">
                                        Last position
                                    </h3>
                                </div>
                            </div>
                            <div className='card-body'>
                                <PositionMap position={this.state.dashboard.last_position} />
                            </div>
                        </div>
                    </div>
                </div>
            </BlockUi>
        );
    }
}

export default injectIntl(DeviceDashboardComponent);