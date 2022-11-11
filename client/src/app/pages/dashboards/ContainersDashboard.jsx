import React, { useEffect, useState } from 'react';
import apiService from '../../services/apiService';
import BlockUi from "react-block-ui";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';



export function ContainersDashboard() {

    const locationStyle = {  "fontWeight": "bold" , "textAlign": "center"}
    const geofencesStyle = {  "backgroundColor": "#D8D8D8"}

    const [rows, setRows] = useState([
        createData('PORT CODE', 0, 0,0,0, 0)
      ]);

    const [madeiraCount, setMadeiraCount] = useState(0)
    const [acoresCount, setAcoresCount] = useState(0)
    const [contineteCount, setContinenteCount] = useState(0)
    const [caboVerdeCount, setCaboVerdeCount] = useState(0)
    const [outrosCount, setOutrosCount] = useState(0)


    useEffect(() => {
        apiService.getByEndpointDashboard("dashboards/containers/locations").then((response) => { 
            if(response.locations["Madeira"] !== undefined){
                setMadeiraCount(response.locations["Madeira"])
            }
            if(response.locations["Açores"] !== undefined){
                setAcoresCount(response.locations["Açores"])
            }
            if(response.locations["Cabo Verde"] !== undefined){
                setCaboVerdeCount(response.locations["Cabo Verde"])
            }
            if(response.locations["Continente"] !== undefined){
                setContinenteCount(response.locations["Continente"])
            }
            if(response.locations["Outros"] !== undefined){
                setOutrosCount(response.locations["Outros"])
            }
        });
        apiService.getByEndpointDashboard("dashboards/containers/longstandings").then((response) => { 
            let rowsResponse = []
            for (const longStanding of response) {
                rowsResponse.push(createData(longStanding.port_code,
                    longStanding.interval_count.less15,
                    longStanding.interval_count.interval15_30,
                    longStanding.interval_count.interval30_60,
                    longStanding.interval_count.interval60_90,
                    longStanding.interval_count.more90,
                    ))
            }
            if(rowsResponse.length !== 0){
                setRows(rowsResponse)
            }
        });
        apiService.getByEndpointDashboard("dashboards/containers").then((response) => { 
            
        });
    },[]);

    function locationClick(){
        console.log("LOCATION")
    }

    function tableClick(e, days){
        console.log(days)
        console.log(e.target.textContent)
    }

    function createData(
        codePort,
        less15,   
        interval15_30,
        interval30_60,
        interval60_90,
        more90,
      ) {
        return { codePort, less15, interval15_30, interval30_60, interval60_90 ,more90};
      }


    return (<BlockUi tag='div'>
                <div className='row mt-3'>
                    <div className='col-xl-2 col-lg-2'>
                        <div className='card card-custom' >
                            <div className='card-header'>
                                <div className='card-title'>
                                    <h3 className="card-label">
                                        Madeira
                                    </h3>
                                </div>
                            </div>
                            <div className='card-body' style={locationStyle}>
                                    <h3>{madeiraCount}</h3>
                            </div>
                        </div>
                    </div>
                    <div className='col-xl-2 col-lg-2'>
                        <div className='card card-custom'>
                            <div className='card-header'>
                                <div className='card-title'>
                                    <h3 className="card-label">
                                        Açores
                                    </h3>
                                </div>
                            </div>
                                <div className='card-body' style={locationStyle} >
                                    <h3>{acoresCount}</h3>
                                </div>
                        </div>
                    </div>
                    <div className='col-xl-2 col-lg-2'>
                        <div className='card card-custom'>
                            <div className='card-header'>
                                <div className='card-title'>
                                    <h3 className="card-label">
                                        Cabo Verde
                                    </h3>
                                </div>
                            </div>
                                <div className='card-body' style={locationStyle} >
                                    <h3>{caboVerdeCount}</h3>
                            </div>
                        </div>
                    </div>
                    <div className='col-xl-2 col-lg-2'>
                        <div className='card card-custom'>
                            <div className='card-header'>
                                <div className='card-title'>
                                    <h3 className="card-label">
                                        Continente
                                    </h3>
                                </div>
                            </div>
                                <div className='card-body' style={locationStyle} >
                                    <h3>{contineteCount}</h3>
                                </div>
                        </div>
                    </div>
                    <div className='col-xl-2 col-lg-2'>
                        <div className='card card-custom'>
                            <div className='card-header'>
                                <div className='card-title'>
                                    <h3 className="card-label">
                                        Outros
                                    </h3>
                                </div>
                            </div>
                                <div className='card-body' style={locationStyle} >
                                    <h3>{outrosCount}</h3>
                                </div>
                        </div>
                    </div>
                    <div className='col-xl-2 col-lg-2'>
                        <div className='card card-custom' style={geofencesStyle}>
                            <div className='card-header'>
                                <div className='card-title'>
                                    <h3 className="card-label">
                                        Entradas / Saídas Geofences
                                    </h3>
                                </div>
                            </div>
                            <div className='card-body' style={locationStyle} >
                                    <h3>Coming Soon</h3>
                                </div>
                        </div>
                    </div>
                </div>
                <div className='row mt-3'>
                <div className='col-xl-8 col-lg-8'>
                        <div className='card card-custom' >
                <TableContainer>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell>LongStanding</TableCell>
                            <TableCell align="right">&#60; 15</TableCell>
                            <TableCell align="right">15-30</TableCell>
                            <TableCell align="right">30-60</TableCell>
                            <TableCell align="right">60-90</TableCell>
                            <TableCell align="right">&#62; 90</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {rows.map((row) => (
                            <TableRow
                            key={row.codePort}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                            <TableCell component="th" scope="row">
                                {row.codePort}
                            </TableCell>
                            <TableCell onClick={(e) => tableClick(e, "<15")} align="right">{row.less15}</TableCell>
                            <TableCell onClick={(e) => tableClick(e, "15-30")} align="right">{row.interval15_30}</TableCell>
                            <TableCell onClick={(e) => tableClick(e, "30-60")} align="right">{row.interval30_60}</TableCell>
                            <TableCell onClick={(e) => tableClick(e, "60-90")} align="right">{row.interval60_90}</TableCell>
                            <TableCell onClick={(e) => tableClick(e, ">90")} align="right">{row.more90}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                </div>
                </div>
                    <div className='col-xl-4 col-lg-4'>
                        <div className='card card-custom' style={geofencesStyle}>
                            <div className='card-header'>
                                <div className='card-title'>
                                    <h3 className="card-label">
                                        Alertas De Impacto
                                    </h3>
                                </div>
                            </div>
                            <div className='card-body' style={locationStyle} >
                                    <h3>Coming Soon</h3>
                                </div>
                        </div>  
                    </div>
                </div>
    </BlockUi>)
}