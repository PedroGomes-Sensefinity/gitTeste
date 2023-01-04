import { Paper, Tab, Tabs } from "@material-ui/core";
import React from "react";
import { Link, useLocation, generatePath } from "react-router-dom";
import templates from "../../../utils/links";

const assetDevicesDashboard = templates.assetsDashboard
const assetDevices = templates.assetsDevices
const assetsHistory = templates.assetsHistory
const extraFieldsTemplate = templates.assetsExtraFields


const dashboardSegment = assetDevicesDashboard.split('/').pop()
const devicesSegment = assetDevices.split('/').pop()
const historySegment = assetsHistory.split('/').pop()
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
            case historySegment: return 3
            case extraFields: return 4
        }
    }

    const value = getInitialValue()

    return <Paper square>
        <Tabs value={value} indicatorColor="primary" textColor="primary" >
            <Tab label="Dashboard" disabled={isAddMode} component={Link} to={isAddMode ? '' : generatePath(assetDevicesDashboard, { id: assetId })} />
            <Tab label="Asset Info" component={Link} to={isAddMode ? '' : generatePath(templates.assetsEdit, { id: assetId })} />
            <Tab label="Devices" disabled={isAddMode} component={Link} to={isAddMode ? '' : generatePath(assetDevices, { id: assetId })} />
            <Tab label="History" disabled={isAddMode} component={Link} to={isAddMode ? '' : generatePath(assetsHistory, { id: assetId })} />
            <Tab label="Extra Fields" disabled={isAddMode || hasMetadataSchema === false} component={Link} to={isAddMode ? '' : generatePath(extraFieldsTemplate, { id: assetId })} />
        </Tabs>
    </Paper>
}