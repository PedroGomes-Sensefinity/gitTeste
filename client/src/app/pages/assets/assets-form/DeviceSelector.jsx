import { Card, CardContent, MenuItem, Select, InputLabel, FormControl} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import DeviceDashboard from "../../../components/form/DeviceDashboard";
import apiService from '../../../services/apiService';
import BlockUi from "react-block-ui";

const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));

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
                    <FormControl className={classes.formControl}>
                        <InputLabel id='device-id-input-label'>Select Device</InputLabel>
                        <Select labelId='device-id-input-label' value={deviceId} onChange={handleOnChange} displayEmtpy className={classes.selectEmpty} >
                            {devices.map(device => 
                                <MenuItem key={device.id} value={device.id}>
                                    <h3 className='card-label font-weight-bolder text-dark'>{device.id}</h3>
                                </MenuItem>)
                                }
                        </Select>
                    </FormControl>
                </CardContent>
            </Card>
            {deviceId !== "" ? <DeviceDashboard key={deviceId} id={deviceId}/>: <></>}
            </BlockUi>
}