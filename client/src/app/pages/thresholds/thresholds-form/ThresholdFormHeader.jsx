import { Paper, Tab, Tabs } from "@material-ui/core";
import React, { useState } from "react";
import { Link, useRouteMatch } from "react-router-dom";
import templates from "../../../utils/links";

const actionsSegment = templates.thresholdsActions.templateString.split('/').pop()
const devicesSegment = templates.thresholdsDevices.templateString.split('/').pop()
const groupsSegment = templates.thresholdsGroups.templateString.split('/').pop()

export default function ThresholdFormHeader(props) {
    const { thresholdId } = props
    const isAddMode = thresholdId === undefined
    let { url } = useRouteMatch();


    const [value, setValue] = useState(() => {
        const lastSegment = url.split('/').pop()
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

    return <Paper square>
        <Tabs value={value} indicatorColor="primary" textColor="primary" onChange={handleChange}>
            <Tab label="Threshold Info" component={Link} to={`${url} `} />
            <Tab label="Action" component={Link} to={isAddMode ? '/' : templates.thresholdsActions.templateObj.expand({ id: thresholdId })} disabled={isAddMode} />
            <Tab label="Devices" component={Link} to={isAddMode ? '/' : templates.thresholdsDevices.templateObj.expand({ id: thresholdId })} disabled={isAddMode} />
            <Tab label="Groups" component={Link} to={isAddMode ? '/' : templates.thresholdsGroups.templateObj.expand({ id: thresholdId })} disabled={isAddMode} />
        </Tabs>
    </Paper>

} 