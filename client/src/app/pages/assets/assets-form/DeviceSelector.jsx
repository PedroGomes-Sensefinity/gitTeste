import { Card, CardContent, MenuItem, Select } from '@material-ui/core';
import React, { useState } from 'react';
import DeviceDashboard from "../../../components/form/DeviceDashboard";

export default function DeviceSelector({ asset }) {
    const devices = asset.devices || []
    const [selectedDevice, setDeviceId] = useState(() => {
        let toReturn = ""
        if (devices.length !== 0)
            toReturn = devices[0].id
        return toReturn
    })

    function handleOnChange(event) {
        const newId = event.target.value
        setDeviceId(newId)
    }

    // add transition to smooth things up, currently change just flashes
    return <><Card>
        <CardContent>
            <div>
                <h3 className='card-label font-weight-bolder text-dark d-inline-block'>Select Device:</h3>
                <div className='d-inline-block pl-5'>
                    <Select onChange={handleOnChange} value={selectedDevice} disabled={devices.length === 0}>
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
        {selectedDevice !== "" ? <DeviceDashboard key={selectedDevice} id={selectedDevice} /> : <></>}
    </>
}