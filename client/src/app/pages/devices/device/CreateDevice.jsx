import { Paper, Tab, Tabs } from "@material-ui/core";
import React from "react";
import { TabContainer } from "react-bootstrap";
import DeviceFormComponent from "../../../components/form/DeviceFormComponent";
import PermissionGate from "../../../modules/Permission/permissionGate";


export function CreateDevice() {
    return (
        <PermissionGate permission={'device_create'}>
            <div>
                <Paper square>
                    <Tabs value={0} indicatorColor="primary" textColor="primary" onChange={() => { }}>
                        <Tab label="Device Info" />
                    </Tabs>
                </Paper>
                <TabContainer>
                    <DeviceFormComponent entity={undefined} />
                </TabContainer>
            </div>
        </PermissionGate>
    )
}
