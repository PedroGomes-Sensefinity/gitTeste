import { Paper, Tab, Tabs } from "@material-ui/core";
import React from "react";
import { TabContainer } from "react-bootstrap";
import GeofencingComponent from "../../../components/form/GeofencingComponent";
import PermissionGate from "../../../modules/Permission/permissionGate";


export function CreateGeofence() {
    return (
        <PermissionGate permission={'geofence_create'}>
            <div>
                <Paper square>
                    <Tabs value={0} indicatorColor="primary" textColor="primary" onChange={() => { }}>
                        <Tab label="Geofence Info" />
                    </Tabs>
                </Paper>
                <TabContainer>
                    <GeofencingComponent entity={undefined} ></GeofencingComponent>
                </TabContainer>
            </div>
        </PermissionGate>
    )
}
