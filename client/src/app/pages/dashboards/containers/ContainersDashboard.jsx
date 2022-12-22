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
import Select from "react-select";

export function ContainersDashboard() {
    const locationStyle = { fontWeight: "bold", textAlign: "center" };
    const geofencesStyle = { backgroundColor: "#D8D8D8" };
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white
        },
        [`&.${tableCellClasses.body}`]: {
            backgroundColor: "#B9D3EE",
            fontSize: 15,
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

    const [madeiraCount, setMadeiraCount] = useState(0);
    const [acoresCount, setAcoresCount] = useState(0);
    const [contineteCount, setContinenteCount] = useState(0);
    const [caboVerdeCount, setCaboVerdeCount] = useState(0);
    const [outrosCount, setOutrosCount] = useState(0);
    const [intrasitCount, setIntrasitCount] = useState(0);

    const [ports, setPorts] = useState(["PORT"]);
    const [data15, setData15] = useState([0]);
    const [data15_30, setData15_30] = useState([0]);
    const [data30_60, setData30_60] = useState([0]);
    const [data60_90, setData60_90] = useState([0]);
    const [data90, setData90] = useState([0]);

    const [containersOptions, setContainersOptions] = useState([{ id: 0, label: "Containers Not Found" }]);
    const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {
        apiServiceV2.get("v2/tenants/containers").then(response => {
            const respContainers = response.containers || [];

            const containersOptionsR = respContainers.map(container => {
                return { id: container.id, label: container.label };
            });
            setContainersOptions(containersOptionsR);
            if(containersOptionsR.length > 0 ){
                apiService.getByEndpointDashboard("dashboards/containers/locations?container_id=" + containersOptionsR[0].id).then(response => {
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
                        setIntrasitCount(response.locations["In Transit"]);
                    }
                });
                apiService.getByEndpointDashboard("dashboards/containers/longstandings?container_id=" + containersOptionsR[0].id).then(response => {
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
                });
            }
        });
        
        apiService.getByEndpointDashboard("dashboards/containers").then(response => {});
    }, []);

    function handleTable(e) {
        console.log(e.target.innerHTML);
        console.log(e.target.cellIndex);
        console.log(e.target.parentElement.rowIndex);
    }

    function onChangeContainer(e){
        apiService.getByEndpointDashboard("dashboards/containers/locations?container_id=" + e.id).then(response => {
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
                setIntrasitCount(response.locations["In Transit"]);
            }
        });
        apiService.getByEndpointDashboard("dashboards/containers/longstandings?container_id=" + e.id).then(response => {
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
        });
    }

    return (
        <BlockUi tag="div">
            <div className="row mt-6">
                <div className="col-xl-4 col-lg-4">
                    <Select defaultValue={selectedOption} onChange={onChangeContainer} options={containersOptions} />
                </div>
            </div>
            <div className="row mt-3">
                <div className="col-xl-2 col-lg-2">
                    <div className="card card-custom">
                        <div className="card-header">
                            <div className="card-title">
                                <h3 className="card-label">Madeira</h3>
                            </div>
                        </div>
                        <div className="card-body" style={locationStyle}>
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
                        <div className="card-body" style={locationStyle}>
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
                        <div className="card-body" style={locationStyle}>
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
                        <div className="card-body" style={locationStyle}>
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
                        <div className="card-body" style={locationStyle}>
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
                        <div className="card-body" style={locationStyle}>
                            <h3>{intrasitCount}</h3>
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
                                            <TableCell component="th" scope="row" align="center">
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
