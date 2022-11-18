import { Paper, Tab, Tabs } from "@material-ui/core";
import React from "react";
import { TabContainer } from "react-bootstrap";
import LocationFormComponent from "../../../components/form/LocationFormComponent";

export function LocationsForm({match}) {
    const {id} = match.params;
    return (
        <div>
            <Paper square>
                <Tabs value={0} indicatorColor="primary" textColor="primary">
                    <Tab label="Locations"/>
                </Tabs>
            </Paper>
            <TabContainer>
                <LocationFormComponent id={id} />
            </TabContainer>
        </div>
    );
}