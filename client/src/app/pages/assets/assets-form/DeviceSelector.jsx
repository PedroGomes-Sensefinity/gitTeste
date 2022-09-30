import { Card, CardContent, CircularProgress, MenuItem, Select } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import DeviceDashboard from "../../../components/form/DeviceDashboard";
import apiService from '../../../services/apiService';



export default function DeviceSelector({assetId}) {
    const [devices, setDevices] = useState([])
    const [deviceId, setDeviceId] = useState("")
    const [isLoading, setLoading] = useState(true)
    const history = useHistory()

    useEffect(() => {
        apiService.getById(`asset/`, assetId ).then((results) => {
            const asset = results.assets[0]
            const devices = asset.devices || []
            setDevices(devices)
            setLoading(false)
        }).catch(err => {
            console.log(err)
            if(err.status === 404) {
                history.push('/not-found')
            }
        })
    },[assetId])

    function handleOnChange(event) {
        const newId = event.target.value
        setDeviceId(newId)
    }

    if (isLoading)
            return <CircularProgress />
    else {
       return  <>
            <Card>
                <CardContent>
                    <h3 className='card-label font-weight-bolder text-dark'>Select Device:  
                    <Select autoWidth={true} onChange={handleOnChange} value={deviceId}>
                        {[<MenuItem key="asdsada" value=""></MenuItem>].concat(devices.map(device => 
                            <MenuItem key={device.id} value={device.id}>
                                <h3 className='card-label font-weight-bolder text-dark'>{device.id}</h3>
                            </MenuItem>)
                            )
                            }
                    </Select>
                    </h3>
                </CardContent>
            </Card>
            {deviceId !== "" ? <DeviceDashboard key={deviceId} id={deviceId}/>: <></>}
       </>
    }
}