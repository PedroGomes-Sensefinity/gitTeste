import { Paper, Tab, Tabs } from "@material-ui/core";
import React, { useState } from "react";
import { Link, useRouteMatch } from "react-router-dom";
import templates from "../../../utils/links";

const dashboardSegment = templates.assetsDashboard.templateString.split('/').pop()
const devicesSegment = templates.assetsDevices.templateString.split('/').pop()
const extraFields = templates.assetsExtraFields.templateString.split('/').pop()



export default function AssetsFormHeader(props) {
    const { assetId, hasMetadataSchema } = props
    const isAddMode = assetId === undefined
    let { url } = useRouteMatch();


    const [value, setValue] = useState(() => {
        const lastSegment = url.split('/').pop()
        const editSegment = `${assetId}`

        switch (lastSegment) {
            case dashboardSegment: return 0
            case editSegment: return 1
            case devicesSegment: return 2
            case extraFields: return 3
        }
    })

    const handleChange = (_event, newValue) => {
        setValue(newValue)
    }

    return <Paper square>
        <Tabs value={value} indicatorColor="primary" textColor="primary" onChange={handleChange}>
            <Tab label="Dashboard" component={Link} to={templates.assetsDashboard.templateObj.expand({ id: assetId })} />
            <Tab label="Asset Info" component={Link} to={templates.assetsEdit.templateObj.expand({ id: assetId })} />
            <Tab label="Devices" disabled={isAddMode} component={Link} to={templates.assetsDevices.templateObj.expand({ id: assetId })} />
            <Tab label="Extra Fields" disabled={isAddMode || hasMetadataSchema === false} component={Link} to={templates.assetsExtraFields.templateObj.expand({ id: assetId })} />
        </Tabs>
    </Paper>
}