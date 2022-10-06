import { Card, CardContent, MenuItem, Select } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import BlockUi from "react-block-ui";
import { useHistory } from "react-router-dom";
import DeviceDashboard from "../../../components/form/DeviceDashboard";
import apiService from '../../../services/apiService';

export default function DeviceSelector({assetId}) {
    const [devices, setDevices] = useState([])
    const [deviceId, setDeviceId] = useState("")
    const [isLoading, setLoading] = useState(true)

    const classes = useStyles()
    // we use this hook so it doesn't show the splash screen
    const history = useHistory()

    useEffect(() => {
        setLoading(true)
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

    // add transition to smooth things up, currently change just flashes
    return <BlockUi tag='div' blocking={isLoading}>
            <Card>
                <CardContent>
                    <div>
                        <h3 className='card-label font-weight-bolder text-dark d-inline-block'>Select Device:</h3>
                        <div className='d-inline-block pl-5'>
                            <Select onChange={handleOnChange} value={deviceId}>
                                    {devices.map(device => 
                                        <MenuItem key={device.id} value={device.id}>
                                            {device.id}
                                        </MenuItem>)
                                    }
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>
            {deviceId !== "" ? <DeviceDashboard key={deviceId} id={deviceId}/>: <></>}
            </BlockUi>
}