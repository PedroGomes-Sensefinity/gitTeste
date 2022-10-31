import { Paper, Tab, Tabs } from "@material-ui/core";
import React, { useEffect } from "react";
import { TabContainer } from "react-bootstrap";
import DeviceConfigMessageComponent from "../../../components/form/deviceConfigMessageComponent";
import DeviceDashboard from "../../../components/form/DeviceDashboard";
import DeviceFormComponent from "../../../components/form/deviceFormComponent";
import DeviceThresholdComponent from "../../../components/form/deviceThresholdComponent";
import PermissionGate from "../../../modules/Permission/permissionGate";

export function Device({ history, match }) {
    console.log('Entered device page')
    const { id } = match.params;
    const [value, setValue] = React.useState(0);

    useEffect(() => {
        if (typeof id !== 'undefined') {
            setValue(0);
        }
    }, []);

    return (
        <PermissionGate permission={'device_create'}>
            <div>
                <Paper square>
                    <Tabs value={value} indicatorColor="primary" textColor="primary" onChange={handleChange}>
                        {(typeof id !== 'undefined') ? <Tab label="Dashboard" /> : null}
                        <Tab label="Device Info" />
                        <Tab label="Thresholds" disabled={typeof id === 'undefined'} />
                        <Tab label="Config Message" disabled={typeof id === 'undefined'} />
                    </Tabs>
                </Paper>
                {(typeof id !== 'undefined') ?
                    <TabContainer>
                        {value === 0 && <DeviceDashboard id={id} />}
                    </TabContainer> : null}

                <TabContainer>
                    {(typeof id === 'undefined' || value === 1) && <DeviceFormComponent entity={id} />}
                </TabContainer>
                <TabContainer>
                    {value === 2 && <DeviceThresholdComponent entity={id} />}
                </TabContainer>
                <TabContainer>
                    {value === 3 && <DeviceConfigMessageComponent entity={id} />}
                </TabContainer>
            </div>
        </PermissionGate>
    )

    function handleChange(event, newValue) {
        setValue(newValue);
    }
}