import { Paper, Tab, Tabs } from "@material-ui/core";
import React from "react";
import { Link, useLocation, generatePath } from "react-router-dom";
import templates from '../../../utils/links';

const geofenceDetail = templates.geofencesEdit
const geofencesAssets = templates.geofencesAssets
const geofencesHistory = templates.geofencesHistory

const assetsHistory = geofencesHistory.split('/').pop()
const assetsSegment = geofencesAssets.split('/').pop()

export function GeofencesPageHeader(props) {
    const { id } = props
    const isAddMode = id === undefined
    const location = useLocation()

    const getInitialValue = () => {
        const firstSegment = isAddMode ? 'new' : `${id}`

        const lastSegment = location.pathname.split('/').pop()
        switch (lastSegment) {
            case firstSegment: return 0
            case assetsHistory: return 1
            case assetsSegment: return 2
        }
    }

    const value = getInitialValue()
    const firstLink = isAddMode ? templates.geofencesCreate : generatePath(geofenceDetail, { id: id })
    return (
        <Paper square>
            <Tabs value={value} indicatorColor="primary" textColor="primary">
                <Tab label="Geofence Info" component={Link} to={firstLink} />
                <Tab label="History" disabled={isAddMode} component={Link} to={isAddMode ? '' : generatePath(geofencesHistory, { id: id })} />
                <Tab label="Assets" disabled={isAddMode} component={Link} to={isAddMode ? '' : generatePath(geofencesAssets, { id: id })} />
            </Tabs>
        </Paper>
    )
}