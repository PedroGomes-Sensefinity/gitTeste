import { Paper, Tab, Tabs } from "@material-ui/core";
import React, { useState } from "react";
import { Link, useLocation, generatePath } from "react-router-dom";
import templates from "../../../utils/links";

const actionsSegment = templates.thresholdsActions.split('/').pop()
const devicesSegment = templates.thresholdsDevices.split('/').pop()
const groupsSegment = templates.thresholdsGroups.split('/').pop()

export default function ThresholdPageHeader(props) {
    const { thresholdId } = props
    const isAddMode = thresholdId === undefined
    let location = useLocation();


    const [value, setValue] = useState(() => {
        const lastSegment = location.pathname.split('/').pop()
        const infoSegment = `${thresholdId}`

        switch (lastSegment) {
            case infoSegment: return 0
            case actionsSegment: return 1
            case devicesSegment: return 2
            case groupsSegment: return 3
        }
    })

    const handleChange = (_event, newValue) => {
        setValue(newValue)
    }

    const firstLink = isAddMode ? templates.thresholdsCreate : generatePath(templates.thresholdsEdit, { id: thresholdId })

    return <Paper square>
        <Tabs value={value} indicatorColor="primary" textColor="primary" onChange={handleChange}>
            <Tab label="Threshold Info" component={Link} to={firstLink} />
            <Tab label="Action" component={Link} to={generatePath(templates.thresholdsActions, { id: thresholdId })} disabled={isAddMode} />
            <Tab label="Devices" component={Link} to={generatePath(templates.thresholdsDevices, { id: thresholdId })} disabled={isAddMode} />
            <Tab label="Groups" component={Link} to={generatePath(templates.thresholdsGroups, { id: thresholdId })} disabled={isAddMode} />
        </Tabs>
    </Paper>

} 