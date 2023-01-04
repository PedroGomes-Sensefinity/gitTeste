import { Paper, Tab, Tabs } from "@material-ui/core";
import React from "react";

export default function GroupPageHeader(props) {
    const { id } = props

    return <Paper square>
        <Tabs value={0} indicatorColor="primary" textColor="primary">
            <Tab label="Group Info" />
        </Tabs>
    </Paper>
}