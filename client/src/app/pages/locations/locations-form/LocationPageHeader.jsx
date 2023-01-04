import { Paper, Tab, Tabs } from "@material-ui/core";
import React from "react";

export function LocationPageHeader(props) {

    // Since it's a single tab, we'll not add any clicking behavior
    //const { locationId } = props

    return <Paper square>
        <Tabs value={0} indicatorColor="primary" textColor="primary">
            <Tab label="Locations" />
        </Tabs>
    </Paper>
} 