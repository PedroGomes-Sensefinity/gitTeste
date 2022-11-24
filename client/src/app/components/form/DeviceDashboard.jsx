import React, { useEffect, useState } from "react";
import "../../utils/yup-validations";
import BlockUi from "react-block-ui";
import { injectIntl } from "react-intl";
import { BsBatteryFull, BsClock, BsFillCloudArrowUpFill } from "react-icons/bs";
import {
    MdBatterySaver,
    MdOutlineWarningAmber,
    MdPower,
    MdWifiTethering,
    MdLocationOn,
    MdNavigation,
    MdBorderOuter
} from "react-icons/md";
import GeoPointMap from "../geo-point-map/GeoPointMap";
import apiService from "../../services/apiService";
import geoCoding from "../../services/geocoding";
import deviceService from "../../services/deviceService";
import utils from "../../utils/utils";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useSelector } from "react-redux";

function DeviceDashboard(props) {
    const [blocking, setBlocking] = useState(true);
    const [device, setDevice] = useState({});
    const [dashboard, setDashboard] = useState({});
    const [pendingConfigMessages, setPendingConfigMessages] = useState(0);
    const [geoCodingText, setGeoCodingText] = useState("");
    const [shapes, setShapes] = useState([]);
    const drawnItems = null;

    const { permissions } = useSelector(({ auth }) => ({ permissions: auth.permissions }));

    const style = { display: "inline-block", fontSize: "1em", fontWeight: "normal" };

    function initDashboard() {
        Promise.all([
            apiService.getById("device", props.id),
            deviceService.dashboard(props.id),
            deviceService.getPendingConfig(props.id)
        ]).then(allResponses => {
            const device = allResponses[0].devices[0];
            let dashboard = allResponses[1];
            const pendingConfigMessages = allResponses[2];

            if (device.position_timestamp === "0001-01-01 00:00:00 +0000 UTC") {
                device.position_timestamp = "N/A";
            }

            if (dashboard.last_geofence_json != undefined) {
                const shapes = JSON.parse(dashboard.last_geofence_json);
                const geofencesArr = [];
                Object.keys(shapes).forEach(key => {
                    geofencesArr.push(JSON.parse(shapes[key]));
                });
                setShapes([...geofencesArr]);
            }

            setDevice(device);
            setDashboard(dashboard);
            setPendingConfigMessages(pendingConfigMessages.length);
            setBlocking(false);
            if (dashboard.last_position.lat !== undefined && dashboard.last_position.lon !== undefined) {
                geoCoding.get(dashboard.last_position.lat, dashboard.last_position.lon).then(response => {
                    setGeoCodingText(response.data.display_name);
                });
            }
        });
    }

    useEffect(() => {
        initDashboard();
    }, []);

    return (
        <BlockUi tag="div" blocking={blocking}>
            <form className="card card-custom">
                <div className={`card-header py-3`}>
                    <div className="card-title align-items-start flex-column">
                        <h3 className="card-label font-weight-bolder text-dark">
                            Device {device.id}
                            <small> {device.label}</small>
                        </h3>
                    </div>
                </div>
            </form>

            {permissions.canViewContainerDashboard && (
                <div className="row mt-3">
                    <div className="col-xl-4 col-lg-4">
                        <div className="card card-custom">
                            <div className="card-header">
                                <div className="card-title">
                                    <h3 className="card-label">Last Location/Sublocation</h3>
                                </div>
                            </div>
                            <div className="card-body">
                                <ul style={{ listStyle: "none" }}>
                                    <li>
                                        <MdNavigation /> Location: {utils.either(dashboard.last_location, "In Transit")}
                                    </li>
                                    <li>
                                        <MdNavigation /> SubLocation:{" "}
                                        {utils.either(dashboard.last_sublocation, "In Transit")} (
                                        {utils.either(dashboard.last_port_code, "No Port Code")})
                                    </li>
                                    <li>
                                        <BsClock /> Timestamp: {utils.either(dashboard.last_geofence_timestamp, "N/A")}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-4">
                        <div className="card card-custom">
                            <div className="card-header">
                                <div className="card-title">
                                    <h3 className="card-label">Last Geofence</h3>
                                </div>
                            </div>
                            <div className="card-body">
                                <ul style={{ listStyle: "none" }}>
                                    <li>
                                        <MdBorderOuter /> Name: {utils.either(dashboard.last_geofence, "N/A")}
                                    </li>
                                    <li>
                                        <MdBorderOuter /> Alert Status:{" "}
                                        {utils.either(dashboard.last_geofence_status, "N/A")}
                                    </li>
                                    <li>
                                        <BsClock /> Timestamp: {utils.either(dashboard.last_position_timestamp, "N/A")}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-4">
                        <div className="card card-custom">
                            <div className="card-header">
                                <div className="card-title">
                                    <h3 className="card-label">Long Standing</h3>
                                </div>
                            </div>
                            <div className="card-body">
                                <ul style={{ listStyle: "none" }}>
                                    <li>Days: {utils.either(dashboard.long_standing, "0")}</li>
                                    <li style={{ visibility: "hidden" }}>
                                        <MdWifiTethering />
                                    </li>
                                    <li style={{ visibility: "hidden" }}>
                                        <MdWifiTethering />
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="row mt-3">
                <div className="col-xl-4 col-lg-4">
                    <div className="card card-custom">
                        <div className="card-header">
                            <div className="card-title">
                                <h3 className="card-label">Last Communication</h3>
                            </div>
                        </div>
                        <div className="card-body">
                            <ul style={{ listStyle: "none" }}>
                                <li>
                                    <BsClock /> Timestamp: {utils.either(dashboard.last_communication_timestamp, "N/A")}
                                </li>
                                <li>
                                    <BsFillCloudArrowUpFill /> Timeserver:{" "}
                                    {utils.either(dashboard.last_communication_timeserver, "N/A")}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                {permissions.canViewDeviceDashboardExtras && (
                    <div className="col-xl-4 col-lg-4">
                        <div className="card card-custom">
                            <div className="card-header">
                                <div className="card-title">
                                    <h3 className="card-label">Last Battery voltage</h3>
                                </div>
                            </div>
                            <div className="card-body">
                                <ul style={{ listStyle: "none" }}>
                                    <li>
                                        <BsBatteryFull /> Battery: {dashboard.last_battery_voltage_value}
                                    </li>
                                    <li>
                                        <BsClock /> Timestamp:{" "}
                                        {utils.either(dashboard.last_battery_voltage_timestamp, "N/A")}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
                {permissions.canViewDeviceDashboardExtras && (
                    <div className="col-xl-4 col-lg-4">
                        <div className="card card-custom">
                            <div className="card-header">
                                <div className="card-title">
                                    <h3 className="card-label">Last device power on/off"</h3>
                                </div>
                            </div>
                            <div className="card-body">
                                <ul style={{ listStyle: "none" }}>
                                    <li>
                                        <MdPower /> On/Off: {dashboard.last_power_on_off_value}
                                    </li>
                                    <li>
                                        <BsClock /> Timestamp:{" "}
                                        {utils.either(dashboard.last_power_on_off_timestamp, "N/A")}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {permissions.canViewDeviceDashboardExtras && (
                <div className="row mt-3">
                    <div className="col-xl-4 col-lg-4">
                        <div className="card card-custom">
                            <div className="card-header">
                                <div className="card-title">
                                    <h3 className="card-label">Last power saving mode</h3>
                                </div>
                            </div>
                            <div className="card-body">
                                <ul style={{ listStyle: "none" }}>
                                    <li>
                                        <MdBatterySaver /> Value: {dashboard.last_power_saving_mode_value}
                                    </li>
                                    <li>
                                        <BsClock /> Timestamp:{" "}
                                        {utils.either(dashboard.last_power_saving_mode_timestamp, "N/A")}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-4">
                        <div className="card card-custom">
                            <div className="card-header">
                                <div className="card-title">
                                    <h3 className="card-label">Last gateway used</h3>
                                </div>
                            </div>
                            <div className="card-body">
                                <ul style={{ listStyle: "none" }}>
                                    <li>
                                        <MdWifiTethering /> {utils.either(dashboard.last_gateway_used, "N/A")}
                                    </li>
                                    <li style={{ visibility: "hidden" }}>
                                        <MdWifiTethering />
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-4">
                        <div className="card card-custom">
                            <div className="card-header">
                                <div className="card-title">
                                    <h3 className="card-label">Last alarm</h3>
                                </div>
                            </div>
                            <div className="card-body">
                                <ul style={{ listStyle: "none" }}>
                                    <li>
                                        <MdOutlineWarningAmber /> ID: {utils.either(dashboard.last_alarm_id, "N/A")}
                                    </li>
                                    <li>
                                        <BsClock /> Timestamp: {utils.either(dashboard.last_alarm_timestamp, "N/A")}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="row mt-3">
                <div className="col-xl-10 col-lg-10">
                    <div className="card card-custom">
                        <div className="card-header">
                            <div style={style} className="card-title font-size-sm ">
                                <h3 className="card-label">Last Position</h3>
                                <MdLocationOn /> Position:{" "}
                                {utils.either(
                                    geoCodingText,
                                    "Not possible to convert geographic coordinates to address!"
                                )}
                                <br></br>
                                <MdLocationOn /> Coordinates: {JSON.stringify(dashboard.last_position)}
                                <br></br>
                                <BsClock /> Timestamp: {dashboard.last_position_timestamp}
                            </div>
                        </div>
                        <div className="card-body">
                            <GeoPointMap position={dashboard.last_position} shapes={shapes} />
                        </div>
                    </div>
                </div>
                <div className="col-xl-2 col-lg-2 ">
                    <div className="card card-custom">
                        <div className="card-body">
                            <div className="d-flex align-items-center py-lg-0 py-2">
                                <div className="d-flex flex-column text-right">
                                    <span className="text-dark-75 font-weight-bolder font-size-h4">
                                        {pendingConfigMessages}
                                    </span>
                                    <span className="text-muted font-size-sm font-weight-bolder">
                                        <OverlayTrigger
                                            key={"top"}
                                            placement={"top"}
                                            overlay={
                                                <Tooltip id={`tooltip-top`}>
                                                    {props.intl.formatMessage({ id: "DEVICE.QTT_PENDING_MESSAGES" })}
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

export default injectIntl(DeviceDashboard);
