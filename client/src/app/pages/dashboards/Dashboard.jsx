import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import SVG from "react-inlinesvg";
import { useHistory } from "react-router-dom";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import apiService from "../../services/apiService";
import notificationService from "../../services/notificationService";
import { useSelector } from "react-redux";
import { injectIntl } from "react-intl";
import apiServiceV2 from "../../services/v2/apiServiceV2";

const useStyles = makeStyles(theme => ({
    button: {
        margin: theme.spacing(1)
    },
    leftIcon: {
        marginRight: theme.spacing(1)
    }
}));

const styleShade = {
    "box-shadow": "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)",
    margin: "10px"
};

export function Dashboard() {
    const classes = useStyles();
    const history = useHistory();
    const [devices, setDevices] = useState(0);
    const [groups, setGroups] = useState(0);
    const [thresholds, setThresholds] = useState(0);
    const [alarms, setAlarms] = useState(0);

    //Temporary Vars for Transinsular needes
    // This code is only here to help transinsular track the number of assets with devices MUST be removed ASAP
    const [tiAssetCount, setTiAssetCount] = useState(0);
    const [ticvAssetCount, setTicvAssetCount] = useState(0);

    //v2
    const [assets, setAssets] = useState(0);
    const { permissions } = useSelector(({ auth }) => ({ permissions: auth.permissions }));

    useEffect(() => {
        apiService.count("device").then(r => {
            if ("affected" in r) setDevices(r.affected);
        });
        apiService.count("group").then(r => {
            if ("affected" in r) setGroups(r.affected);
        });
        apiService.count("threshold").then(r => {
            if ("affected" in r) setThresholds(r.affected);
        });

        apiServiceV2.get("v2/assets").then(r => {
            if ("total" in r) setAssets(r.total);
        });
        apiServiceV2.get("v2/devices?asset=true&tenant_id=19").then(r => {
            if ("total" in r) setTiAssetCount(r.total);
        });
        apiServiceV2.get("v2/devices?asset=true&tenant_id=20").then(r => {
            if ("total" in r) setTicvAssetCount(r.total);
        });
        notificationService.count("alarm", "created", "-", "-").then(r => {
            if (typeof r.affected !== "undefined") {
                setAlarms(r.affected);
            }
        });
    }, []);

    return (
        <div>
            <div className={"row"} style={{ marginBottom: "1rem" }}>
                {permissions.canViewDevices ? (
                    <div className={"col-lg-3 col-xxl-3"}>
                        <div className={"card"} style={styleShade}>
                            <div className={"card-body p-0"} style={{ position: "relative" }}>
                                <div
                                    className={
                                        "d-flex align-items-center justify-content-between card-spacer flex-grow-1"
                                    }
                                >
                                    <span className={"symbol circle symbol-50 symbol-light-success mr-2"}>
                                        <span className={"symbol-label"}>
                                            <span className={"svg-icon svg-icon-xl svg-icon-success"}>
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/Devices/Router2.svg")} />
                                            </span>
                                        </span>
                                    </span>
                                    <div className={"d-flex flex-column text-right"}>
                                        <span className={"text-dark-75 font-weight-bolder font-size-h3"}>
                                            {devices}
                                        </span>
                                        <span className={"text-muted font-weight-bold mt-2"}>Devices</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <></>
                )}
                {permissions.canViewGroups ? (
                    <div className={"col-lg-3 col-xxl-3"}>
                        <div className={"card"} style={styleShade}>
                            <div className={"card-body p-0"} style={{ position: "relative" }}>
                                <div
                                    className={
                                        "d-flex align-items-center justify-content-between card-spacer flex-grow-1"
                                    }
                                >
                                    <span className={"symbol circle symbol-50 symbol-light-success mr-2"}>
                                        <span className={"symbol-label"}>
                                            <span className={"svg-icon svg-icon-xl svg-icon-success"}>
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")} />
                                            </span>
                                        </span>
                                    </span>
                                    <div className={"d-flex flex-column text-right"}>
                                        <span className={"text-dark-75 font-weight-bolder font-size-h3"}>{groups}</span>
                                        <span className={"text-muted font-weight-bold mt-2"}>Groups</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <></>
                )}
                {permissions.canViewAssets ? (
                    <div className={"col-lg-3 col-xxl-3"}>
                        <div className={"card"} style={styleShade}>
                            <div className={"card-body p-0"} style={{ position: "relative" }}>
                                <div
                                    className={
                                        "d-flex align-items-center justify-content-between card-spacer flex-grow-1"
                                    }
                                >
                                    <span className={"symbol circle symbol-50 symbol-light-success mr-2"}>
                                        <span className={"symbol-label"}>
                                            <span className={"svg-icon svg-icon-xl svg-icon-success"}>
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")} />
                                            </span>
                                        </span>
                                    </span>
                                    <div className={"d-flex flex-column text-right"}>
                                        <span className={"text-dark-75 font-weight-bolder font-size-h3"}>{assets}</span>
                                        <span className={"text-muted font-weight-bold mt-2"}>Assets</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <></>
                )}
                {permissions.canViewAlarms ? (
                    <div className={"col-lg-3 col-xxl-3"}>
                        <div className={"card"} style={styleShade}>
                            <div className={"card-body p-0"} style={{ position: "relative" }}>
                                <div
                                    className={
                                        "d-flex align-items-center justify-content-between card-spacer flex-grow-1"
                                    }
                                >
                                    <span className={"symbol circle symbol-50 symbol-light-success mr-2"}>
                                        <span className={"symbol-label"}>
                                            <span className={"svg-icon svg-icon-xl svg-icon-success"}>
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/General/Fire.svg")} />
                                            </span>
                                        </span>
                                    </span>
                                    <div className={"d-flex flex-column text-right"}>
                                        <span className={"text-dark-75 font-weight-bolder font-size-h3"}>{alarms}</span>
                                        <span className={"text-muted font-weight-bold mt-2"}>Alarms</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <></>
                )}
            </div>
            <div className={"row"}>
                <div className={"col-lg-3 col-xxl-3"}>
                    <div className={"card"} style={styleShade}>
                        <div className={"card-body p-0"} style={{ position: "relative" }}>
                            <div
                                className={"d-flex align-items-center justify-content-between card-spacer flex-grow-1"}
                            >
                                <span className={"symbol circle symbol-50 symbol-light-success mr-2"}>
                                    <span className={"symbol-label"}>
                                        <span className={"svg-icon svg-icon-xl svg-icon-success"}>
                                            <SVG src={toAbsoluteUrl("/media/svg/icons/Code/Info-circle.svg")} />
                                        </span>
                                    </span>
                                </span>
                                <div className={" text-right"}>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        className={classes.button}
                                        onClick={() => {
                                            history.push("/whatsnew");
                                        }}
                                    >
                                        What's New Page
                                    </Button>
                                    <br></br>
                                    <span className={"text-muted font-weight-bold mt-2"}>
                                        Discover the latest updates to the Sensefinty Web Application!
                                    </span>
                                    <br></br>
                                    <span className={"font-weight-bold mt-2"}>Last Update : V.1.0.0 - 23/03/2023</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {permissions.canViewAssets ? (
                    <div className={"col-lg-3 col-xxl-3"}>
                        <div className={"card"} style={styleShade}>
                            <div className={"card-body p-0"} style={{ position: "relative" }}>
                                <div
                                    className={
                                        "d-flex align-items-center justify-content-between card-spacer flex-grow-1"
                                    }
                                >
                                    <span className={"symbol circle symbol-50 symbol-light-success mr-2"}>
                                        <span className={"symbol-label"}>
                                            <span className={"svg-icon svg-icon-xl svg-icon-success"}>
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")} />
                                            </span>
                                        </span>
                                    </span>
                                    <div className={"d-flex flex-column text-right"}>
                                        <span className={"text-dark-75 font-weight-bolder font-size-h3"}>
                                            {tiAssetCount}
                                        </span>
                                        <span className={"font-weight-bold mt-2"}>Assets Tracked - TI</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <></>
                )}
                {permissions.canViewAssets ? (
                    <div className={"col-lg-3 col-xxl-3"}>
                        <div className={"card"} style={styleShade}>
                            <div className={"card-body p-0"} style={{ position: "relative" }}>
                                <div
                                    className={
                                        "d-flex align-items-center justify-content-between card-spacer flex-grow-1"
                                    }
                                >
                                    <span className={"symbol circle symbol-50 symbol-light-success mr-2"}>
                                        <span className={"symbol-label"}>
                                            <span className={"svg-icon svg-icon-xl svg-icon-success"}>
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")} />
                                            </span>
                                        </span>
                                    </span>
                                    <div className={"d-flex flex-column text-right"}>
                                        <span className={"text-dark-75 font-weight-bolder font-size-h3"}>
                                            {ticvAssetCount}
                                        </span>
                                        <span className={"font-weight-bold mt-2"} s>
                                            Assets Tracked - TICV
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}

export default injectIntl(Dashboard);
