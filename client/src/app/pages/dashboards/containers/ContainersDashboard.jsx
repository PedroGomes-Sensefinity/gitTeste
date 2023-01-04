import React, { useEffect, useState } from "react";
import apiService from "../../../services/apiService";
import apiServiceV2 from "../../../services/v2/apiServiceV2";
import BlockUi from "react-block-ui";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { injectIntl } from "react-intl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";

import { LocationsList } from "../../../components/lists/locations/LocationsList";
import { LongStandingList } from "../../../components/lists/longStanding/LongStandingList";
import Progress from "../../../utils/Progress/Progress";
import toaster from "../../../utils/toaster";
import { HistoryList } from "../../../components/lists/history/HistoryList";

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

export function ContainersDashboard() {
    //Styles
    const locationStyle = { fontWeight: "bold", textAlign: "center", cursor: "pointer", borderColor: "#808080" };
    const geofencesStyle = { backgroundColor: "#D8D8D8" };
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

    const [blocking, setBlocking] = useState(false);

    //Should be a object to reduce useState use
    const [locationDataDashboard, setLocationDataDashboard] = useState({
        Madeira: 0,
        Açores: 0,
        Continente: 0,
        "Cabo Verde": 0,
        Outros: 0,
        "In Transit": 0
    });

    const [ports, setPorts] = useState(["PORT"]);
    const [intervalData, setIntervalData] = useState({
        data15: [0],
        data15_30: [0],
        data30_60: [0],
        data60_90: [0],
        data90: [0]
    });
    const [data15, setData15] = useState([0]);
    const [data15_30, setData15_30] = useState([0]);
    const [data30_60, setData30_60] = useState([0]);
    const [data60_90, setData60_90] = useState([0]);
    const [, setData90] = useState([0]);

    //Selected
    const [containersOptions, setContainersOptions] = useState([{ id: 0, label: "Containers Not Found" }]);
    const [selectedContainer, setselectedContainer] = useState(0);

    const [selectedLocation, setSelectedLocation] = React.useState("");
    const [selectedPortCode, setSelectedPortCode] = React.useState("");
    const [selectedInterval, setSelectedInterval] = React.useState("");

    const [containerId, setContainerId] = React.useState(0);

    const [openLocation, setOpenLocation] = React.useState(false);
    const [openGeofences, setOpenGeofences] = React.useState(false);
    const [buttonDisabled, setButtonDisabled] = React.useState(false);
    const [buttonLabel, setButtonLabel] = React.useState("Generate Report");
    const [showProgress, setShowProgress] = React.useState(false);

    //handlers for pop ups (modal)
    const handleOpenLocation = m => {
        console.log(m);
        setSelectedLocation(m);
        setOpenLocation(true);
    };
    const handleOpenGeofences = () => {
        setOpenGeofences(true);
    };
    const handleCloseLocation = () => {
        setOpenLocation(false);
    };

    const handleCloseGeofences = () => {
        setOpenGeofences(false);
    };

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
        a.dispatchEvent(clickEvt);
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
                    setShowProgress(false);
                }
            })
            .catch(r => {
                toaster.notify("error", "Error on Generate Report!");
                setButtonDisabled(false);
                setButtonLabel("Generate Report");
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
                    toaster.notify("error", "Error on Generate Report!");
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
                    toaster.notify("error", "Error on Generate Report!");
                    setButtonDisabled(false);
                    setButtonLabel("Generate Report");
                    setShowProgress(false);
                });
        }
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
                toaster.notify("error", "Error on Generate Report!");
                setButtonDisabled(false);
                setButtonLabel("Generate Report");
                setShowProgress(false);
            });
    };

    const [openLongStanding, setOpenLongStanding] = React.useState(false);

    const handleCloseLongStanding = () => {
        setOpenLongStanding(false);
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
            case 0:
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
                        const locations = {};
                        if (response.locations["Madeira"] !== undefined) {
                            locations["Madeira"] = response.locations["Madeira"];
                        } else {
                            locations["Madeira"] = 0;
                        }
                        if (response.locations["Açores"] !== undefined) {
                            locations["Açores"] = response.locations["Açores"];
                        } else {
                            locations["Açores"] = 0;
                        }
                        if (response.locations["Cabo Verde"] !== undefined) {
                            locations["Cabo Verde"] = response.locations["Cabo Verde"];
                        } else {
                            locations["Cabo Verde"] = 0;
                        }
                        if (response.locations["Continente"] !== undefined) {
                            locations["Continente"] = response.locations["Continente"];
                        } else {
                            locations["Continente"] = 0;
                        }
                        if (response.locations["Outros"] !== undefined) {
                            locations["Outros"] = response.locations["Outros"];
                        } else {
                            locations["Outros"] = 0;
                        }
                        if (response.locations["In Transit"] !== undefined) {
                            locations["In Transit"] = response.locations["In Transit"];
                        } else {
                            locations["In Transit"] = 0;
                        }
                        setLocationDataDashboard(locations);
                    });
                apiService
                    .getByEndpointDashboard(
                        "dashboards/containers/longstandings?container_id=" + containersOptionsR[0].id
                    )
                    .then(response => {
                        const ports_R = [];
                        const data15_R = [];
                        const data15_30_R = [];
                        const data30_60_R = [];
                        const data60_90_R = [];
                        const data90_R = [];
                        for (const longStanding of response) {
                            ports_R.push(longStanding.port_code);
                            data15_R.push(longStanding.interval_count.less15);
                            data15_30_R.push(longStanding.interval_count.interval15_30);
                            data30_60_R.push(longStanding.interval_count.interval30_60);
                            data60_90_R.push(longStanding.interval_count.interval60_90);
                            data90_R.push(longStanding.interval_count.more90);
                        }
                        if (ports.length !== 0) {
                            setPorts(ports_R);
                            setData15(data15_R);
                            setData15_30(data15_30_R);
                            setData30_60(data30_60_R);
                            setData60_90(data60_90_R);
                            setData90(data90_R);
                        }
                        setBlocking(false);
                    });
            }
        });

        apiService.getByEndpointDashboard("dashboards/containers").then(response => {});
    }, []);

    //Handle container changes
    function onChangeContainer(e) {
        setBlocking(true);
        setselectedContainer(e.target.value);
        setContainerId(e.target.value);
        apiService
            .getByEndpointDashboard("dashboards/containers/locations?container_id=" + e.target.value)
            .then(response => {
                const locations = {};
                if (response.locations["Madeira"] !== undefined) {
                    locations["Madeira"] = response.locations["Madeira"];
                } else {
                    locations["Madeira"] = 0;
                }
                if (response.locations["Açores"] !== undefined) {
                    locations["Açores"] = response.locations["Açores"];
                } else {
                    locations["Açores"] = 0;
                }
                if (response.locations["Cabo Verde"] !== undefined) {
                    locations["Cabo Verde"] = response.locations["Cabo Verde"];
                } else {
                    locations["Cabo Verde"] = 0;
                }
                if (response.locations["Continente"] !== undefined) {
                    locations["Continente"] = response.locations["Continente"];
                } else {
                    locations["Continente"] = 0;
                }
                if (response.locations["Outros"] !== undefined) {
                    locations["Outros"] = response.locations["Outros"];
                } else {
                    locations["Outros"] = 0;
                }
                if (response.locations["In Transit"] !== undefined) {
                    locations["In Transit"] = response.locations["In Transit"];
                } else {
                    locations["In Transit"] = 0;
                }
                setLocationDataDashboard(locations);
            })
            .catch(r => {
                const locations = {};
                locations["Madeira"] = 0;
                locations["Açores"] = 0;
                locations["Cabo Verde"] = 0;
                locations["Continente"] = 0;
                locations["Outros"] = 0;
                locations["In Transit"] = 0;
                setLocationDataDashboard(locations);
            });
        apiService
            .getByEndpointDashboard("dashboards/containers/longstandings?container_id=" + e.target.value)
            .then(response => {
                const ports_R = [];
                const data15_R = [];
                const data15_30_R = [];
                const data30_60_R = [];
                const data60_90_R = [];
                const data90_R = [];
                for (const longStanding of response) {
                    ports_R.push(longStanding.port_code);
                    data15_R.push(longStanding.interval_count.less15);
                    data15_30_R.push(longStanding.interval_count.interval15_30);
                    data30_60_R.push(longStanding.interval_count.interval30_60);
                    data60_90_R.push(longStanding.interval_count.interval60_90);
                    data90_R.push(longStanding.interval_count.more90);
                }

                setPorts(ports_R);
                setData15(data15_R);
                setData15_30(data15_30_R);
                setData30_60(data30_60_R);
                setData60_90(data60_90_R);
                setData90(data90_R);
                setBlocking(false);
            });
    }

    //Modal:
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

    const columnsGeofences = [
        { field: "asset_label", title: "Label" },
        { field: "timestamp", title: "Location Timestamp" },
        { field: "asset_type", title: "Asset Type" },
        { field: "reverse_geocoding", title: "Reverse Geocoding" },
        { field: "geofence_label", title: "Geofence Label" },
        { field: "geofence_status", title: "Geofence Status" }
    ];

    //Modal:
    const geofencesModal = (
        <Modal
            hideBackdrop
            open={openGeofences}
            onClose={handleCloseGeofences}
            style={OVERLAY_STYLE}
            aria-labelledby="child-modal-title"
            aria-describedby="child-modal-description"
        >
            <Box sx={{ ...style, width: "90%", height: "90%" }}>
                <Button
                    size="small"
                    onClick={handleCloseGeofences}
                    type="button"
                    style={{ margin: "15px" }}
                    className={`btn btn-danger mr-1 d-block mr-0 ml-auto`}
                >
                    X
                </Button>
                <HistoryList
                    columns={columnsGeofences}
                    key={selectedContainer}
                    title={"Histórico Geofences"}
                    container_id={selectedContainer}
                    endpoint={"v2/geofences/history"}
                    dataField={"assets_tracking"}
                ></HistoryList>
            </Box>
        </Modal>
    );

    return (
        <BlockUi tag="div" blocking={blocking}>
            {locationsModal}
            {longStandingModal}
            {geofencesModal}
            <FormControl style={{ margin: "15px" }}>
                <InputLabel id="select-container">Group</InputLabel>
                <Select labelId="select-container" value={selectedContainer} label="Age" onChange={onChangeContainer}>
                    {containersOptions.map(c => (
                        <MenuItem value={c.id}>{c.label}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <div className="row mt-3">
                <div className="col-xl-2 col-lg-2">
                    <div className="card card-custom">
                        <div className="card-header">
                            <div className="card-title">
                                <h3 className="card-label">Madeira</h3>
                            </div>
                        </div>
                        <div className="card-body" style={locationStyle} onClick={() => handleOpenLocation("Madeira")}>
                            <h3>{locationDataDashboard["Madeira"]}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-xl-2 col-lg-2">
                    <div className="card card-custom">
                        <div className="card-header">
                            <div className="card-title">
                                <h3 className="card-label">Açores</h3>
                            </div>
                        </div>
                        <div className="card-body" style={locationStyle} onClick={() => handleOpenLocation("Açores")}>
                            <h3>{locationDataDashboard["Açores"]}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-xl-2 col-lg-2">
                    <div className="card card-custom">
                        <div className="card-header">
                            <div className="card-title">
                                <h3 className="card-label">Cabo Verde</h3>
                            </div>
                        </div>
                        <div
                            className="card-body"
                            style={locationStyle}
                            onClick={() => handleOpenLocation("Cabo Verde")}
                        >
                            <h3>{locationDataDashboard["Cabo Verde"]}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-xl-2 col-lg-2">
                    <div className="card card-custom">
                        <div className="card-header">
                            <div className="card-title">
                                <h3 className="card-label">Continente</h3>
                            </div>
                        </div>
                        <div
                            className="card-body"
                            style={locationStyle}
                            onClick={() => handleOpenLocation("Continente")}
                        >
                            <h3>{locationDataDashboard["Continente"]}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-xl-2 col-lg-2">
                    <div className="card card-custom">
                        <div className="card-header">
                            <div className="card-title">
                                <h3 className="card-label">Outros</h3>
                            </div>
                        </div>
                        <div className="card-body" style={locationStyle} onClick={() => handleOpenLocation("Outros")}>
                            <h3>{locationDataDashboard["Outros"]}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-xl-2 col-lg-2">
                    <div className="card card-custom">
                        <div className="card-header">
                            <div className="card-title">
                                <h3 className="card-label">Em Trânsito</h3>
                            </div>
                        </div>
                        <div
                            className="card-body"
                            style={locationStyle}
                            onClick={() => handleOpenLocation("In Transit")}
                        >
                            <h3>{locationDataDashboard["In Transit"]}</h3>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row mt-3">
                <div className="col-xl-12 col-lg-12">
                    <div className="card card-custom">
                        <TableContainer>
                            <Table sx={{ minWidth: 650 }} aria-label="a dense table" onClick={handleTable}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={sticky} component="th" scope="row">
                                            Long Standing
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
                                            &#60; 15
                                        </TableCell>
                                        {data15.map(data15i => (
                                            <StyledTableCell align="center">{data15i}</StyledTableCell>
                                        ))}
                                    </TableRow>
                                    <TableRow key={"15-30"} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                        <TableCell style={sticky} component="th" scope="row">
                                            15-30
                                        </TableCell>
                                        {data15_30.map(data15_30i => (
                                            <StyledTableCell align="center">{data15_30i}</StyledTableCell>
                                        ))}
                                    </TableRow>
                                    <TableRow key={"30-60"} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                        <TableCell style={sticky} component="th" scope="row">
                                            30-60
                                        </TableCell>
                                        {data30_60.map(data30_60i => (
                                            <StyledTableCell align="center">{data30_60i}</StyledTableCell>
                                        ))}
                                    </TableRow>
                                    <TableRow key={"60-90"} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                        <TableCell style={sticky} component="th" scope="row">
                                            60-90
                                        </TableCell>
                                        {data60_90.map(data60_90i => (
                                            <StyledTableCell align="center">{data60_90i}</StyledTableCell>
                                        ))}
                                    </TableRow>
                                    <TableRow key={">90"} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                        <TableCell style={sticky} component="th" scope="row">
                                            &#62; 90
                                        </TableCell>
                                        {data90.map(data90i => (
                                            <StyledTableCell align="center">{data90i}</StyledTableCell>
                                        ))}
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-xl-6 col-lg-6">
                        <div className="card card-custom" style={geofencesStyle}>
                            <div className="card-header">
                                <div className="card-title">
                                    <h3 className="card-label">Alertas De Impacto</h3>
                                </div>
                            </div>
                            <div className="card-body" style={locationStyle}>
                                <h3>Coming Soon</h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-6 col-lg-6">
                        <div className="card card-custom">
                            <div className="card-header">
                                <div className="card-title">
                                    <h3 className="card-label">Entradas / Saídas Geofences</h3>
                                </div>
                            </div>
                            <div className="card-body" style={{ margin: "auto" }}>
                                <button
                                    type="submit"
                                    className="btn btn-success mr-2"
                                    onClick={() => handleOpenGeofences()}
                                >
                                    Abrir Histórico
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BlockUi>
    );
}

export default injectIntl(ContainersDashboard);
