import React, {useState, useEffect} from 'react'
import DeviceDashboard from "../../../components/form/DeviceDashboard";
import deviceService from "../../../services/deviceService";
import {Card, CardContent, CircularProgress, Select, MenuItem} from '@material-ui/core';


export default function DeviceSelector() {
    const [devices, setDevices] = useState([])
    const [deviceId, setDeviceId] = useState("")
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        deviceService.getToAsset(" ", 100, 0).then((results) => {
            console.log(results.devices)
            setDevices(results.devices)

            setLoading(false)
        })
    },[])

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