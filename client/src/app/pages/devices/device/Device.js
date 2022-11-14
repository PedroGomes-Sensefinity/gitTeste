import { Paper, Tab, Tabs } from "@material-ui/core";
import React, { useEffect, useMemo } from "react";
import { TabContainer } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import DeviceConfigMessageComponent from "../../../components/form/DeviceConfigMessageComponent";
import DeviceDashboard from "../../../components/form/DeviceDashboard";
import DeviceFormComponent from "../../../components/form/DeviceFormComponent";
import DeviceThresholdComponent from "../../../components/form/DeviceThresholdComponent";
import PermissionGate from "../../../modules/Permission/permissionGate";

export function Device({ match }) {
    const { id } = match.params;
    const [value, setValue] = React.useState(() => {
        if (id !== undefined)
            return 0
        else
            return -1
    });

    const handleChange = (event, newValue) => {
        setValue(newValue);
    }

    const componentToBeRendered = useMemo(() => {
        switch (value) {
            case -1: return <Redirect to="/error/error-v1" />
            case 0: return <DeviceDashboard id={id} />
            case 1: return <DeviceFormComponent entity={id} />
            case 2: return <DeviceThresholdComponent entity={id} />
            case 3: return <DeviceConfigMessageComponent entity={id} />
        }
    }, [value, id])

    return <PermissionGate permission={'device_create'}>
        <div>
            <Paper square>
                <Tabs value={value} indicatorColor="primary" textColor="primary" onChange={handleChange}>
                    {(typeof id !== 'undefined') ? <Tab label="Dashboard" /> : null}
                    <Tab label="Device Info" />
                    <Tab label="Thresholds" disabled={typeof id === 'undefined'} />
                    <Tab label="Config Message" disabled={typeof id === 'undefined'} />
                </Tabs>
            </Paper>
            <TabContainer>
                {componentToBeRendered}
            </TabContainer>
        </div>
    </PermissionGate>



}