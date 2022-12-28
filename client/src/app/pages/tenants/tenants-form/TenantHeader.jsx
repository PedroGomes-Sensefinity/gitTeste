import { Paper, Tab, Tabs } from "@material-ui/core";
import React, { useState } from "react";
import { Link, useRouteMatch } from "react-router-dom";
import templates from "../../../utils/links";


export default function TenantFormHeader(props) {
    const { tenantId } = props
    const isAddMode = tenantId === undefined
    let { url } = useRouteMatch();


    const [value, setValue] = useState(() => {
        const lastSegment = url.split('/').pop()
        if (lastSegment === templates.tenantsPersonalization.templateString.split('/').pop()) {
            return 1
        } else {
            return 0
        }
    })
    const handleChange = (_event, newValue) => {
        setValue(newValue)
    }

    return <Paper square>
        <Tabs value={value} indicatorColor="primary" textColor="primary" onChange={handleChange}>
            <Tab label="Tenant" component={Link} to={templates.tenantsEdit.templateObj.expand({ id: tenantId })} />
            <Tab label="Personalization" disabled={isAddMode} component={Link} to={templates.tenantsPersonalization.templateObj.expand({ id: tenantId })} />
        </Tabs>
    </Paper>

} 