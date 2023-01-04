import { Paper, Tab, Tabs } from "@material-ui/core";
import React from "react";
import { generatePath, Link, useLocation } from "react-router-dom";
import templates from "../../../utils/links";


const personalizationSegment = templates.tenantsPersonalization.split('/').pop()
const createSegment = templates.tenantsCreate.split('/').pop()

export default function TenantPageHeader(props) {
    const { tenantId } = props
    const isAddMode = tenantId === undefined
    const location = useLocation();

    const getFirstValue = () => {
        const lastSegment = location.pathname.split('/').pop()
        const firstSegment = isAddMode ? createSegment : `${tenantId}`

        switch (lastSegment) {
            case firstSegment: return 0
            case personalizationSegment: return 1
        }
    }

    const value = getFirstValue()
    const firstLink = isAddMode ? templates.tenantsCreate : generatePath(templates.tenantsEdit, { id: tenantId })

    return <Paper square>
        <Tabs value={value} indicatorColor="primary" textColor="primary">
            <Tab label="Tenant" component={Link} to={firstLink} />
            <Tab label="Personalization" disabled={isAddMode} component={Link} to={isAddMode ? '' : generatePath(templates.tenantsPersonalization, { id: tenantId })} />
        </Tabs>
    </Paper>

} 