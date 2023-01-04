import { Paper, Tab, Tabs } from "@material-ui/core";
import React from "react";
import { generatePath, Link, useLocation } from "react-router-dom";
import templates from "../../../utils/links";


const routeInfoTemplate = templates.routesEdit
const routeMapsTemplate = templates.routesMap

const mapsSegment = routeMapsTemplate.split('/').pop()


export default function RoutePageHeader(props) {
    const { routeId } = props
    const isAddMode = routeId === undefined
    const location = useLocation()

    const getInitialValue = () => {
        const currentSegment = location.pathname.split('/').pop()
        const infoSegment = isAddMode ? 'new' : `${routeId}`

        switch (currentSegment) {
            case infoSegment: return 0
            case mapsSegment: return 1
        }
    }

    const value = getInitialValue()
    const firstLink = isAddMode ? templates.routesCreate : generatePath(routeInfoTemplate, { id: routeId })
    return <Paper square>
        <Tabs value={value} indicatorColor="primary" textColor="primary">
            <Tab label="Route Info" component={Link} to={firstLink} />
            <Tab label="Route Map" disabled={isAddMode} component={Link} to={isAddMode ? '' : generatePath(routeMapsTemplate, { id: routeId })} />
        </Tabs>
    </Paper>
}