import { Paper, Tab, Tabs } from "@material-ui/core";
import React from "react";
import { Link, useLocation, generatePath } from "react-router-dom";
import templates from '../../../utils/links';

const floorMapMapTemplate = templates.floorMapsMap
const floorMapEditTemplate = templates.floorMapsEdit
const floorMapAnchorsTemplate = templates.floorMapsAnchors

const mapSegment = floorMapMapTemplate.split('/').pop()
const anchorsSegment = floorMapAnchorsTemplate.split('/').pop()

export function FloorMapHeader(props) {
    const { id } = props
    const isAddMode = id === undefined
    const location = useLocation()

    const getInitialValue = () => {
        const firstSegment = isAddMode ? 'new' : `${id}`

        const lastSegment = location.pathname.split('/').pop()
        switch (lastSegment) {
            case firstSegment: return 0
            case mapSegment: return 1
            case anchorsSegment: return 2
        }
    }

    const value = getInitialValue()
    const firstLink = isAddMode ? templates.floorMapsCreate : generatePath(floorMapEditTemplate, { id: id })
    return (
        <Paper square>
            <Tabs value={value} indicatorColor="primary" textColor="primary">
                <Tab label="General info" component={Link} to={firstLink} />
                <Tab label="Map" disabled={isAddMode} component={Link} to={isAddMode ? '' : generatePath(floorMapMapTemplate, { id: id })} />
                <Tab label="Anchors" disabled={isAddMode} component={Link} to={isAddMode ? '' : generatePath(floorMapAnchorsTemplate, { id: id })} />
            </Tabs>
        </Paper>
    )
}
