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
import elasticService from "../../../services/elasticService";
import ProgressBar from "react-bootstrap/ProgressBar";
import { formatMs } from "@material-ui/core";
import Progress from "../../../utils/Progress/Progress";

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
    const [madeiraCount, setMadeiraCount] = useState(0);
    const [acoresCount, setAcoresCount] = useState(0);
    const [contineteCount, setContinenteCount] = useState(0);
    const [caboVerdeCount, setCaboVerdeCount] = useState(0);
    const [outrosCount, setOutrosCount] = useState(0);
    const [intransitCount, setIntransitCount] = useState(0);

    const [ports, setPorts] = useState(["PORT"]);
    const [data15, setData15] = useState([0]);
    const [data15_30, setData15_30] = useState([0]);
    const [data30_60, setData30_60] = useState([0]);
    const [data60_90, setData60_90] = useState([0]);
    const [data90, setData90] = useState([0]);

    //Selected
    const [containersOptions, setContainersOptions] = useState([{ id: 0, label: "Containers Not Found" }]);
    const [selectedContainer, setselectedContainer] = useState(0);

    const [selectedLocation, setSelectedLocation] = React.useState("");
    const [selectedPortCode, setSelectedPortCode] = React.useState("");
    const [selectedInterval, setSelectedInterval] = React.useState("");

    const [containerId, setContainerId] = React.useState(0);

    const [openLocation, setOpenLocation] = React.useState(false);
    const [buttonDisabled, setButtonDisabled] = React.useState(false);
    const [buttonLabel, setButtonLabel] = React.useState("Generate Report");
    const [showProgress, setShowProgress] = React.useState(false);

    //handlers for pop ups (modal)
    const handleOpenLocation = m => {
        console.log(m);
        setSelectedLocation(m);
        setOpenLocation(true);
    };
    const handleCloseLocation = () => {
        setOpenLocation(false);
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

    const getReportFromElastic = path => {
        elasticService.get(path).then(response => {
            downloadFile(response.data, "report.csv", "csv");
            setButtonDisabled(false);
            setButtonLabel("Generate Report");
            setShowProgress(false)
        });
    }; 
    const getLocationReport = () => {
        setButtonDisabled(true);
        setButtonLabel("Generating Report...");
        setShowProgress(true)
        apiServiceV2
            .get("v2/reports/generate?container_id=" + containerId + "&type=locations&file_format=csv")
            .then(response => {
                setTimeout(() => {
                    setButtonLabel("Downloading...");
                    getReportFromElastic(response.report.path);
                }, 50000);
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
                        if (response.locations["Madeira"] !== undefined) {
                            setMadeiraCount(response.locations["Madeira"]);
                        }
                        if (response.locations["Açores"] !== undefined) {
                            setAcoresCount(response.locations["Açores"]);
                        }
                        if (response.locations["Cabo Verde"] !== undefined) {
                            setCaboVerdeCount(response.locations["Cabo Verde"]);
                        }
                        if (response.locations["Continente"] !== undefined) {
                            setContinenteCount(response.locations["Continente"]);
                        }
                        if (response.locations["Outros"] !== undefined) {
                            setOutrosCount(response.locations["Outros"]);
                        }
                        if (response.locations["In Transit"] !== undefined) {
                            setIntransitCount(response.locations["In Transit"]);
                        }
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
                if (response.locations["Madeira"] !== undefined) {
                    setMadeiraCount(response.locations["Madeira"]);
                } else {
                    setMadeiraCount(0);
                }
                if (response.locations["Açores"] !== undefined) {
                    setAcoresCount(response.locations["Açores"]);
                } else {
                    setAcoresCount(0);
                }
                if (response.locations["Cabo Verde"] !== undefined) {
                    setCaboVerdeCount(response.locations["Cabo Verde"]);
                } else {
                    setCaboVerdeCount(0);
                }
                if (response.locations["Continente"] !== undefined) {
                    setContinenteCount(response.locations["Continente"]);
                } else {
                    setContinenteCount(0);
                }
                if (response.locations["Outros"] !== undefined) {
                    setOutrosCount(response.locations["Outros"]);
                } else {
                    setOutrosCount(0);
                }
                if (response.locations["In Transit"] !== undefined) {
                    setIntransitCount(response.locations["In Transit"]);
                } else {
                    setIntransitCount(0);
                }
            })
            .catch(r => {
                setMadeiraCount(0);
                setAcoresCount(0);
                setCaboVerdeCount(0);
                setContinenteCount(0);
                setOutrosCount(0);
                setIntransitCount(0);
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
                {showProgress && <Progress time={0.75}/>}
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
            </Box>
        </Modal>
    );

    return (
        <BlockUi tag="div" blocking={blocking}>
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
            <div className="row mt-3">
                <div className="col-xl-2 col-lg-2">
                    <div className="card card-custom">
                        <div className="card-header">
                            <div className="card-title">
                                <h3 className="card-label">Madeira</h3>
                            </div>
                        </div>
                        <div className="card-body" style={locationStyle} onClick={() => handleOpenLocation("Madeira")}>
                            <h3>{madeiraCount}</h3>
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
                            <h3>{acoresCount}</h3>
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
                            <h3>{caboVerdeCount}</h3>
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
                            <h3>{contineteCount}</h3>
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
                            <h3>{outrosCount}</h3>
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
                            <h3>{intransitCount}</h3>
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
                        <div className="card card-custom" style={geofencesStyle}>
                            <div className="card-header">
                                <div className="card-title">
                                    <h3 className="card-label">Entradas / Saídas Geofences</h3>
                                </div>
                            </div>
                            <div className="card-body" style={locationStyle}>
                                <h3>Coming Soon</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BlockUi>
    );
}

export default injectIntl(ContainersDashboard);
