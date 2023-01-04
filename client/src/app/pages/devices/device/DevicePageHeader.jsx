import { Paper, Tab, Tabs } from "@material-ui/core";
import React from "react";
import { generatePath, Link, useLocation } from "react-router-dom";
import templates from '../../../utils/links';

const deviceDashboardTemplate = templates.deviceDashboard
const deviceEditTemplate = templates.deviceDetail
const createDevice = templates.deviceCreate
const deviceThresholdsTemplate = templates.deviceThresholds
const deviceConfigurationsTemplate = templates.deviceConfigurations

const dashboardSegment = deviceDashboardTemplate.split('/').pop()
const thresholdSegment = deviceThresholdsTemplate.split('/').pop()
const configurationSegment = deviceConfigurationsTemplate.split('/').pop()

export default function DevicePageHeader(props) {
    const { deviceId } = props
    const isAddMode = !deviceId
    const location = useLocation()

    const getInitialValue = () => {
        const lastSegment = location.pathname.split('/').pop()
        const detailSegment = isAddMode ? 'new' : `${deviceId}`
        switch (lastSegment) {
            case dashboardSegment: return 0
            case detailSegment: return 1
            case thresholdSegment: return 2
            case configurationSegment: return 3
        }
    }

    const value = getInitialValue()
    const firstLink = isAddMode ? createDevice : generatePath(deviceEditTemplate, { id: deviceId })
    return <Paper square>
        <Tabs value={value} indicatorColor="primary" textColor="primary" >
            <Tab label="Dashboard" disabled={isAddMode} component={Link} to={isAddMode ? '' : generatePath(deviceDashboardTemplate, { id: deviceId })} />
            <Tab label="Device Info" component={Link} to={firstLink} />
            <Tab label="Thresholds" disabled={isAddMode} component={Link} to={isAddMode ? '' : generatePath(deviceThresholdsTemplate, { id: deviceId })} />
            <Tab label="Config Message" disabled={isAddMode} component={Link} to={isAddMode ? '' : generatePath(deviceConfigurationsTemplate, { id: deviceId })} />
        </Tabs>
    </Paper >
} 
