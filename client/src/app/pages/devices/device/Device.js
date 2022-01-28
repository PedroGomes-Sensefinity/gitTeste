import React, {useEffect} from "react";
import DeviceFormComponent from "../../../components/form/deviceFormComponent";
import DeviceConfigMessageComponent from "../../../components/form/deviceConfigMessageComponent";
import DeviceThresholdComponent from "../../../components/form/deviceThresholdComponent";
import tenantService from '../../../services/tenantService';
import {Paper, Tab, Tabs} from "@material-ui/core";
import {TabContainer} from "react-bootstrap";
import PermissionGate from "../../../modules/Permission/permissionGate";
import DeviceDashboardComponent from "../../../components/form/deviceDashboardComponent";

export function Device({history, match}) {
    const {id} = match.params;
    const [value, setValue] = React.useState(0);
    const [tenant, setTenant] = React.useState({});

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
                        { (typeof id !== 'undefined') ? <Tab label="Dashboard" /> : null }
                        <Tab label="Device Info"/>
                        <Tab label="Thresholds" disabled={typeof id === 'undefined'}/>
                        <Tab label="Config Message" disabled={typeof id === 'undefined'}/>
                    </Tabs>
                </Paper>
                <TabContainer>
                    {value === 0 && <DeviceDashboardComponent entity={id} />}
                </TabContainer>
                <TabContainer>
                    {value === 1 && <DeviceFormComponent entity={id} />}
                </TabContainer>
                <TabContainer>
                    {value === 2 && <DeviceThresholdComponent entity={id} /> }
                </TabContainer>
                <TabContainer>
                    {value === 3 && <DeviceConfigMessageComponent entity={id} /> }
                </TabContainer>
            </div>
        </PermissionGate>
    )

    function handleChange(event, newValue) {
        setValue(newValue);
    }
}