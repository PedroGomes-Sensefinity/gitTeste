import { Paper, Tab, Tabs } from "@material-ui/core";
import React from "react";
import { Link, useLocation, generatePath } from "react-router-dom";
import templates from "../../../utils/links";

const dashboardTemplate = templates.assetsDashboard
const devicesTemplate = templates.assetsDevices
const extraFieldsTemplate = templates.assetsExtraFields


const dashboardSegment = dashboardTemplate.split('/').pop()
const devicesSegment = devicesTemplate.split('/').pop()
const extraFields = extraFieldsTemplate.split('/').pop()



export default function AssetPageHeader(props) {
    const { assetId, hasMetadataSchema } = props
    const isAddMode = assetId === undefined
    const location = useLocation()

    const getInitialValue = () => {


        const currentSegment = location.pathname.split('/').pop()
        const infoSegment = isAddMode ? 'new' : `${assetId}`

        switch (currentSegment) {
            case dashboardSegment: return 0
            case infoSegment: return 1
            case devicesSegment: return 2
            case extraFields: return 3
        }
    }

    const value = getInitialValue()

    return <Paper square>
        <Tabs value={value} indicatorColor="primary" textColor="primary" >
            <Tab label="Dashboard" disabled={isAddMode} component={Link} to={isAddMode ? '' : generatePath(dashboardTemplate, { id: assetId })} />
            <Tab label="Asset Info" component={Link} to={isAddMode ? '' : generatePath(templates.assetsEdit, { id: assetId })} />
            <Tab label="Devices" disabled={isAddMode} component={Link} to={isAddMode ? '' : generatePath(devicesTemplate, { id: assetId })} />
            <Tab label="Extra Fields" disabled={isAddMode || hasMetadataSchema === false} component={Link} to={isAddMode ? '' : generatePath(extraFieldsTemplate, { id: assetId })} />
        </Tabs>
    </Paper>
}