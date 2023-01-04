import { Paper, Tab, Tabs } from "@material-ui/core";
import React from "react";

export function SubLocationsPageHeader(props) {

    // Since it's a single tab, we'll not add any clicking behavior
    //const { subLocationId } = props

    return <Paper square>
        <Tabs value={0} indicatorColor="primary" textColor="primary">
            <Tab label="SubLocations" />
        </Tabs>
    </Paper>
} 