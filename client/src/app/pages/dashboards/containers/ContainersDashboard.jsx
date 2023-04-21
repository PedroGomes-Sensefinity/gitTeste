import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import Select from "@mui/material/Select";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React, { useEffect, useState } from "react";
import BlockUi from "react-block-ui";
import { injectIntl } from "react-intl";
import { HistoryList } from "../../../components/lists/history/HistoryList";
import { LocationsList } from "../../../components/lists/locations/LocationsList";
import { LongStandingList } from "../../../components/lists/longStanding/LongStandingList";
import apiService from "../../../services/apiService";
import apiServiceV2 from "../../../services/v2/apiServiceV2";
import Progress from "../../../utils/Progress/Progress";
import toaster from "../../../utils/toaster";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

// General Styles
const style = {
    position: "absolute",
    bgcolor: "background.paper",
    border: "3px solid #000",
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
    overflowY: "auto",
    marginTop: "50px",
    marginLeft: "550px",
    marginRight: "550px"
};

const OVERLAY_STYLE = {
    position: "fixed",
    display: "flex",
    justifyContent: "center",
    top: "0",
    left: "0",
    width: "auto",
    height: "auto",
    backgroundColor: "rgba(0,0,0, .8)",
    zIndex: "1000",
    overflowY: "auto",
    overflowX: "auto"
};

const shadeStyle = {
    margin: "15px",
    "box-shadow":
        "rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset"
};

const redirectStyleShape = {
    margin: "25px",
    "box-shadow": "rgba(3, 102, 214, 0.3) 0px 0px 0px 3px"
};

export function ContainersDashboard() {
    const { permissions } = useSelector(({ auth }) => ({ permissions: auth.permissions }))
    //Specific Styles
    const locationStyle = { fontWeight: "bold", textAlign: "center", cursor: "pointer", borderColor: "#808080" };
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white
        },
        [`&.${tableCellClasses.body}`]: {
            backgroundColor: "#B9D3EE",
            fontSize: 25,
            cursor: "pointer",
            borderColor: "#808080"
        },
        "&:nth-of-type(odd)": {
            backgroundColor: "#CAE1FF"
        }
    }));

    const sticky = {
        position: "sticky",
        left: 0,
        background: "white",
        boxShadow: "5px 2px 5px grey",
        borderRight: "2px solid black"
    };

    //Dashboard Data
    const [locationsRender, setLocationsRender] = useState([]);
    const [ports, setPorts] = useState(["PORT"]);
    const [intervalData, setIntervalData] = useState({
        data15: [0],
        data15_30: [0],
        data30_60: [0],
        data60_90: [0],
        data90: [0],
        total: [0]
    });

    //Container States
    const [containersOptions, setContainersOptions] = useState([{ id: 0, label: "Containers Not Found" }]);
    const [selectedContainer, setselectedContainer] = useState(0);
    const [containerId, setContainerId] = useState(0);

    //Selected States (use to ask for specific information)
    const [selectedLocation, setSelectedLocation] = useState("");
    const [selectedPortCode, setSelectedPortCode] = useState("");
    const [selectedInterval, setSelectedInterval] = useState("");
    //Modals States
    const [openLocation, setOpenLocation] = useState(false);
    const [openImpacts, setOpenImpacts] = useState(false);
    const [openGeofences, setOpenGeofences] = useState(false);
    const [openLongStanding, setOpenLongStanding] = useState(false);
    // Button States (Block report)
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [buttonLabel, setButtonLabel] = useState("Generate Report");
    const [buttonLabel24, setButtonLabel24] = useState("Generate Report for Last 24 Hours");
    const [showProgress, setShowProgress] = useState(false);

    //Default States
    const [blocking, setBlocking] = useState(false);

    //handlers for pop ups (modal)
    const handleOpenLocation = m => {
        setSelectedLocation(m);
        setOpenLocation(true);
    };
    const handleCloseLocation = () => {
        setOpenLocation(false);
    };

    const handleCloseGeofences = () => {
        setOpenGeofences(false);
    };

    const handleCloseLongStanding = () => {
        setOpenLongStanding(false);
    };

    const handleCloseImpacts = () => {
        setOpenImpacts(false);
    };

    //Report Functions
    const downloadFile = (data, fileName, fileType) => {
        const blob = new Blob([data], { type: fileType });

        const a = document.createElement("a");
        a.download = fileName;
        a.href = window.URL.createObjectURL(blob);
        const clickEvt = new MouseEvent("click", {
            view: window,
            bubbles: true,
            cancelable: true
        });
        a.remove();
    };

    const getReportFromElastic = (path, Fname) => {
        path = path.replace("/api/reporting/jobs/download/", "");
        apiServiceV2
            .get("v2/reports/" + path)
            .then(response => {
                if (response.report_result.result != undefined) {
                    downloadFile(response.report_result.result, "report_" + Fname + ".csv", "csv");
                    setButtonDisabled(false);
                    setButtonLabel("Generate Report");
                    setButtonLabel24("Generate Report for the Last 24 Hours");
                    setShowProgress(false);
                }
            })
            .catch(r => {
                toaster.notify("error", "Reports not available! Please try again later. Reports are not available for demo accounts.");
                setButtonDisabled(false);
                setButtonLabel("Generate Report");
                setButtonLabel24("Generate Report for the Last 24 Hours");
                setShowProgress(false);
            });
    };
    const getLocationReport = () => {
        setShowProgress(true);
        setButtonDisabled(true);
        setButtonLabel("Generating Report...");
        if (selectedLocation === "In Transit") {
            apiServiceV2
                .get(
                    "v2/reports/generate?container_id=" +
                    containerId +
                    "&filter=" +
                    selectedLocation +
                    "&type=locations_in_transit&file_format=csv"
                )
                .then(response => {
                    setTimeout(() => {
                        setButtonLabel("Downloading...");
                        getReportFromElastic(response.report.path, selectedLocation);
                    }, 50000);
                })
                .catch(r => {
                    toaster.notify("error", "Reports not available! Please try again later. Reports are not available for demo accounts.");
                    setButtonDisabled(false);
                    setButtonLabel("Generate Report");
                    setShowProgress(false);
                });
        } else {
            apiServiceV2
                .get(
                    "v2/reports/generate?container_id=" +
                    containerId +
                    "&filter=" +
                    selectedLocation +
                    "&type=locations&file_format=csv"
                )
                .then(response => {
                    setTimeout(() => {
                        setButtonLabel("Downloading...");
                        getReportFromElastic(response.report.path, selectedLocation);
                    }, 50000);
                })
                .catch(r => {
                    toaster.notify("error", "Reports not available! Please try again later. Reports are not available for demo accounts.");
                    setButtonDisabled(false);
                    setButtonLabel("Generate Report");
                    setShowProgress(false);
                });
        }
    };

    function setLocationsRenderFunc(locationsC) {
        const renders = [];
        Object.keys(locationsC).forEach(key => {
            renders.push(
                <div className="col-xl-2 col-lg-2">
                    <div className="card card-custom" style={shadeStyle}>
                        <div className="card-header">
                            <div className="card-title">
                                <h3 className="card-label">{key}</h3>
                            </div>
                        </div>
                        <div className="card-body" style={locationStyle} onClick={() => handleOpenLocation(key)}>
                            <h3>{locationsC[key]}</h3>
                        </div>
                    </div>
                </div>
            );
        });
        if (renders.length === 0) {
            renders.push(
                <div className="col-xl-2 col-lg-2">
                    <div className="card card-custom" style={shadeStyle}>
                        <div className="card-header">
                            <div className="card-title">
                                <h3 className="card-label">Locations Not Found!</h3>
                            </div>
                        </div>
                        <div className="card-body" style={locationStyle}>
                            <h3>0</h3>
                        </div>
                    </div>
                </div>
            );
        }
        setLocationsRender(renders);
    }

    const getGeofencesReport = () => {
        setShowProgress(true);
        setButtonDisabled(true);
        setButtonLabel24("Generating Report...");
        let url = "v2/reports/generate?container_id=" + containerId + "&file_format=csv" + "&type=geofences";
        apiServiceV2
            .get(url)
            .then(response => {
                setTimeout(() => {
                    setButtonLabel24("Downloading...");
                    getReportFromElastic(response.report.path, "geofences");
                }, 50000);
            })
            .catch(r => {
                toaster.notify("error", "Reports not available! Please try again later. Reports are not available for demo accounts.");
                setButtonDisabled(false);
                setButtonLabel24("Generate Report for the Last 24 Hours");
                setShowProgress(false);
            });
    };

    const getLongStandingReport = () => {
        setShowProgress(true);
        setButtonDisabled(true);
        setButtonLabel("Generating Report...");
        let url =
            "v2/reports/generate?container_id=" + containerId + "&filter=" + selectedPortCode + "&file_format=csv";
        if (selectedInterval != "") {
            switch (selectedInterval) {
                case "lte15":
                    url = url + "&start_interval=0&end_interval=15&type=port_code_interval";
                    break;
                case "15-30":
                    url = url + "&start_interval=16&end_interval=30&type=port_code_interval";
                    break;
                case "30-60":
                    url = url + "&start_interval=31&end_interval=60&type=port_code_interval";
                    break;
                case "60-90":
                    url = url + "&start_interval=61&end_interval=90&type=port_code_interval";
                    break;
                case "gte90":
                    url = url + "&start_interval=91&end_interval=1825&type=port_code_interval";
                    break;
            }
        } else {
            url = url + "&type=port_code";
        }
        apiServiceV2
            .get(url)
            .then(response => {
                setTimeout(() => {
                    setButtonLabel("Downloading...");
                    getReportFromElastic(response.report.path, selectedPortCode);
                }, 50000);
            })
            .catch(r => {
                toaster.notify("error", "Reports not available! Please try again later. Reports are not available for demo accounts.");
                setButtonDisabled(false);
                setButtonLabel("Generate Report");
                setShowProgress(false);
            });
    };

    //Handler to selection on table
    function handleTable(e) {
        if (e.target.cellIndex - 1 < 0) {
            return;
        }
        switch (e.target.parentElement.rowIndex) {
            case 1:
                setSelectedInterval("lte15");
                break;
            case 2:
                setSelectedInterval("15-30");
                break;
            case 3:
                setSelectedInterval("30-60");
                break;
            case 4:
                setSelectedInterval("60-90");
                break;
            case 5:
                setSelectedInterval("gte90");
                break;
            default:
                setSelectedInterval("");
        }
        setSelectedPortCode(ports[e.target.cellIndex - 1]);
        setOpenLongStanding(true);
    }

    //Get containers and get information for first container
    useEffect(() => {
        setBlocking(true);
        apiServiceV2.get("v2/tenants/containers").then(response => {
            const respContainers = response.containers || [];

            const containersOptionsR = respContainers.map(container => {
                return { id: container.id, label: container.label };
            });
            setselectedContainer(containersOptionsR[0].id);
            setContainersOptions(containersOptionsR);
            if (containersOptionsR.length > 0) {
                setContainerId(containersOptionsR[0].id);
                apiService
                    .getByEndpointDashboard("dashboards/containers/locations?container_id=" + containersOptionsR[0].id)
                    .then(response => {
                        if (response.locations !== undefined) {
                            setLocationsRenderFunc(response.locations);
                        } else {
                            setLocationsRenderFunc([{ "Locations Not Found": 0 }]);
                        }
                    })
                    .catch(r => {
                        setLocationsRenderFunc([{ "Locations Not Found": 0 }]);
                    });
                apiService
                    .getByEndpointDashboard(
                        "dashboards/containers/longstandings?container_id=" + containersOptionsR[0].id
                    )
                    .then(response => {
                        const ports_R = [];
                        // Special Case i have ports but they are all 0. Good for new clients demos
                        const ports_ZERO = [];
                        const data_ZERO = [];
                        const data15_R = [];
                        const data15_30_R = [];
                        const data30_60_R = [];
                        const data60_90_R = [];
                        const data90_R = [];
                        const total = [];
                        for (const longStanding of response) {
                            if (
                                longStanding.interval_count.less15 !== 0 ||
                                longStanding.interval_count.interval15_30 !== 0 ||
                                longStanding.interval_count.interval30_60 !== 0 ||
                                longStanding.interval_count.interval60_90 !== 0 ||
                                longStanding.interval_count.more90 !== 0
                            ) {
                                ports_R.push(longStanding.port_code);
                                data15_R.push(longStanding.interval_count.less15);
                                data15_30_R.push(longStanding.interval_count.interval15_30);
                                data30_60_R.push(longStanding.interval_count.interval30_60);
                                data60_90_R.push(longStanding.interval_count.interval60_90);
                                data90_R.push(longStanding.interval_count.more90);
                                total.push(
                                    longStanding.interval_count.less15 +
                                    longStanding.interval_count.interval15_30 +
                                    longStanding.interval_count.interval30_60 +
                                    longStanding.interval_count.interval60_90 +
                                    longStanding.interval_count.more90
                                );
                            } else {
                                ports_ZERO.push(longStanding.port_code);
                                data_ZERO.push(0)
                            }
                        }
                        if (ports_R.length !== 0) {
                            setPorts(ports_R);
                            const intervalData_R = {
                                data15: data15_R,
                                data15_30: data15_30_R,
                                data30_60: data30_60_R,
                                data60_90: data60_90_R,
                                data90: data90_R,
                                total: total
                            };
                            setIntervalData(intervalData_R);
                            setBlocking(false);
                        } else {
                            if (ports_ZERO.length === 0) {
                                setPorts(["SUBLOCATIONS NOT FOUND"]);
                                const intervalData_R = {
                                    data15: [0],
                                    data15_30: [0],
                                    data30_60: [0],
                                    data60_90: [0],
                                    data90: [0],
                                    total: [0]
                                };
                                setIntervalData(intervalData_R);
                                setBlocking(false);
                            } else {
                                // Special Case i have ports but they are all 0. Good for new clients demos
                                setPorts(ports_ZERO)
                                const intervalData_R = {
                                    data15: data_ZERO,
                                    data15_30: data_ZERO,
                                    data30_60: data_ZERO,
                                    data60_90: data_ZERO,
                                    data90: data_ZERO,
                                    total: data_ZERO
                                };
                                setIntervalData(intervalData_R);
                                setBlocking(false);
                            }
                        }
                    });
            }
        });

        apiService.getByEndpointDashboard("dashboards/containers").then(response => { });
    }, []);

    //Handle container changes
    function onChangeContainer(e) {
        setBlocking(true);
        setselectedContainer(e.target.value);
        setContainerId(e.target.value);
        apiService
            .getByEndpointDashboard("dashboards/containers/locations?container_id=" + e.target.value)
            .then(response => {
                if (response.locations !== undefined) {
                    setLocationsRenderFunc(response.locations);
                } else {
                    setLocationsRenderFunc([{ "Locations Not Found": 0 }]);
                }
            })
            .catch(r => {
                setLocationsRenderFunc([{ "Locations Not Found": 0 }]);
            });
        apiService
            .getByEndpointDashboard("dashboards/containers/longstandings?container_id=" + e.target.value)
            .then(response => {
                const ports_R = [];
                // Special Case i have ports but they are all 0. Good for new clients demos
                const ports_ZERO = [];
                const data_ZERO = [];
                const data15_R = [];
                const data15_30_R = [];
                const data30_60_R = [];
                const data60_90_R = [];
                const data90_R = [];
                const total = [];
                for (const longStanding of response) {
                    if (
                        longStanding.interval_count.less15 !== 0 ||
                        longStanding.interval_count.interval15_30 !== 0 ||
                        longStanding.interval_count.interval30_60 !== 0 ||
                        longStanding.interval_count.interval60_90 !== 0 ||
                        longStanding.interval_count.more90 !== 0
                    ) {
                        ports_R.push(longStanding.port_code);
                        data15_R.push(longStanding.interval_count.less15);
                        data15_30_R.push(longStanding.interval_count.interval15_30);
                        data30_60_R.push(longStanding.interval_count.interval30_60);
                        data60_90_R.push(longStanding.interval_count.interval60_90);
                        data90_R.push(longStanding.interval_count.more90);
                        total.push(
                            longStanding.interval_count.less15 +
                            longStanding.interval_count.interval15_30 +
                            longStanding.interval_count.interval30_60 +
                            longStanding.interval_count.interval60_90 +
                            longStanding.interval_count.more90
                        );
                    } else {
                        ports_ZERO.push(longStanding.port_code);
                        data_ZERO.push(0)
                    }
                }
                if (ports_R.length !== 0) {
                    setPorts(ports_R);
                    const intervalData_R = {
                        data15: data15_R,
                        data15_30: data15_30_R,
                        data30_60: data30_60_R,
                        data60_90: data60_90_R,
                        data90: data90_R,
                        total: total
                    };
                    setIntervalData(intervalData_R);
                    setBlocking(false);
                } else {
                    if (ports_ZERO.length === 0) {
                        setPorts(["SUBLOCATIONS NOT FOUND"]);
                        const intervalData_R = {
                            data15: [0],
                            data15_30: [0],
                            data30_60: [0],
                            data60_90: [0],
                            data90: [0],
                            total: [0]
                        };
                        setIntervalData(intervalData_R);
                        setBlocking(false);
                    } else {
                        setPorts(ports_ZERO)
                        const intervalData_R = {
                            data15: data_ZERO,
                            data15_30: data_ZERO,
                            data30_60: data_ZERO,
                            data60_90: data_ZERO,
                            data90: data_ZERO,
                            total: data_ZERO
                        };
                        setIntervalData(intervalData_R);
                        setBlocking(false);
                    }
                }
            });
    }

    //Modals:
    const locationsModal = (
        <Modal
            hideBackdrop
            open={openLocation}
            onClose={handleCloseLocation}
            style={OVERLAY_STYLE}
            aria-labelledby="child-modal-title"
            aria-describedby="child-modal-description"
        >
            <Box sx={{ ...style, width: "90%", height: "90%" }}>
                <Button
                    size="small"
                    onClick={handleCloseLocation}
                    type="button"
                    style={{ margin: "15px" }}
                    className={`btn btn-danger mr-1 d-block mr-0 ml-auto`}
                >
                    X
                </Button>
                <LocationsList container_id={containerId} location={selectedLocation}></LocationsList>
                <Button
                    size="small"
                    onClick={getLocationReport}
                    type="button"
                    disabled={buttonDisabled}
                    style={{ margin: "15px" }}
                    className={`btn btn-primary mr-3`}
                >
                    {buttonLabel}
                </Button>
                {showProgress && <Progress time={0.75} />}
            </Box>
        </Modal>
    );

    const longStandingModal = (
        <Modal
            hideBackdrop
            open={openLongStanding}
            onClose={handleCloseLongStanding}
            style={OVERLAY_STYLE}
            aria-labelledby="child-modal-title"
            aria-describedby="child-modal-description"
        >
            <Box sx={{ ...style, width: "90%", height: "90%" }}>
                <Button
                    size="small"
                    onClick={handleCloseLongStanding}
                    type="button"
                    style={{ margin: "15px" }}
                    className={`btn btn-danger mr-1 d-block mr-0 ml-auto`}
                >
                    X
                </Button>
                <LongStandingList
                    container_id={containerId}
                    port_code={selectedPortCode}
                    interval={selectedInterval}
                ></LongStandingList>
                <Button
                    size="small"
                    onClick={getLongStandingReport}
                    type="button"
                    disabled={buttonDisabled}
                    style={{ margin: "15px" }}
                    className={`btn btn-primary mr-3`}
                >
                    {buttonLabel}
                </Button>
                {showProgress && <Progress time={0.75} />}
            </Box>
        </Modal>
    );

    return (
        <BlockUi className="card card-custom" tag="div" blocking={blocking}>
            {locationsModal}
            {longStandingModal}
            <FormControl style={{ margin: "15px" }}>
                <InputLabel id="select-container">Group</InputLabel>
                <Select labelId="select-container" value={selectedContainer} label="Age" onChange={onChangeContainer}>
                    {containersOptions.map(c => (
                        <MenuItem value={c.id}>{c.label}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <div className="row mt-3">{locationsRender}</div>
            <div className="row mt-3">
                <div className="col-xl-12 col-lg-12">
                    <div className="card card-custom">
                        <TableContainer>
                            <Table sx={{ minWidth: 650 }} aria-label="a dense table" onClick={handleTable}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={sticky} component="th" scope="row">
                                            Long Standing By Sublocation
                                        </TableCell>
                                        {ports.map(port => (
                                            <TableCell style={locationStyle} component="th" scope="row" align="center">
                                                {port}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow key={"<15"} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                        <TableCell style={sticky} component="th" scope="row">
                                            &#60; 15 days
                                        </TableCell>
                                        {intervalData["data15"].map(data15i => (
                                            <StyledTableCell align="center">{data15i}</StyledTableCell>
                                        ))}
                                    </TableRow>
                                    <TableRow key={"15-30"} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                        <TableCell style={sticky} component="th" scope="row">
                                            15-30 days
                                        </TableCell>
                                        {intervalData["data15_30"].map(data15_30i => (
                                            <StyledTableCell align="center">{data15_30i}</StyledTableCell>
                                        ))}
                                    </TableRow>
                                    <TableRow key={"30-60"} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                        <TableCell style={sticky} component="th" scope="row">
                                            30-60 days
                                        </TableCell>
                                        {intervalData["data30_60"].map(data30_60i => (
                                            <StyledTableCell align="center">{data30_60i}</StyledTableCell>
                                        ))}
                                    </TableRow>
                                    <TableRow key={"60-90"} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                        <TableCell style={sticky} component="th" scope="row">
                                            60-90 days
                                        </TableCell>
                                        {intervalData["data60_90"].map(data60_90i => (
                                            <StyledTableCell align="center">{data60_90i}</StyledTableCell>
                                        ))}
                                    </TableRow>
                                    <TableRow key={">90"} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                        <TableCell style={sticky} component="th" scope="row">
                                            &#62; 90 days
                                        </TableCell>
                                        {intervalData["data90"].map(data90i => (
                                            <StyledTableCell align="center">{data90i}</StyledTableCell>
                                        ))}
                                    </TableRow>
                                    <TableRow key={"total"} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                        <TableCell style={sticky} component="th" scope="row">
                                            TOTAL (days)
                                        </TableCell>
                                        {intervalData["total"].map(total => (
                                            <StyledTableCell align="center">{total}</StyledTableCell>
                                        ))}
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
            </div>
            {permissions.canViewDashboardLists &&
                <div className="row mt-3">
                    <div className="col-sm-2 col-sm-2">
                        <div className="card card-custom" style={redirectStyleShape}>
                            <div className="card-body" style={{ margin: "auto" }}>
                                <Link to="/dashboard/lists/containers" className="btn btn-secondary">
                                    Abrir Impactos
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-2 col-sm-2">
                        <div className="card card-custom" style={redirectStyleShape}>
                            <div className="card-body" style={{ margin: "auto" }}>
                                <Link to="/dashboard/lists/containers" className="btn btn-secondary">
                                    Abrir Geofences
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </BlockUi>
    );
}

export default injectIntl(ContainersDashboard);
