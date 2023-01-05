import { Card, CardContent, MenuItem, Select } from "@material-ui/core";
import React, { useState } from "react";
import DeviceDashboard from "../../../components/form/DeviceDashboard";

export default function DeviceSelector({ asset }) {
    const devicesIds = asset.devices_ids || [];
    const [deviceId, setDeviceId] = useState(() => {
        let toReturn = "";
        if (devicesIds.length !== 0) toReturn = devicesIds[0];
        return toReturn;
    });

    function handleOnChange(event) {
        const newId = event.target.value;
        setDeviceId(newId);
    }

    return (
        <>
            <Card>
                <CardContent>
                    <div>
                        <h3 className="card-label font-weight-bolder text-dark d-inline-block">Select Device:</h3>
                        <div className="d-inline-block pl-5">
                            <Select onChange={handleOnChange} value={deviceId} disabled={devicesIds.length === 0}>
                                {devicesIds.map(id => (
                                    <MenuItem key={id} value={id}>
                                        {id}
                                    </MenuItem>
                                ))}
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>
            {deviceId !== "" ? <DeviceDashboard key={deviceId} id={deviceId} /> : <></>}
        </>
    );
}
