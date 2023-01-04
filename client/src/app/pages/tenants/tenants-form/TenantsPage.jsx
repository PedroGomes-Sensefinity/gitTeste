import React from "react";

import { TabContainer } from "react-bootstrap";
import { Outlet, useParams } from "react-router-dom";
import { Layout } from "../../../../_metronic/layout";
import TenantPageHeader from "./TenantPageHeader";


export function TenantsPage() {
    const { id } = useParams()

    const context = { tenantId: id }

    return (
        <Layout>
            <TenantPageHeader tenantId={id} />
            <TabContainer>
                <Outlet context={context} />
            </TabContainer >
        </Layout>
    )
}