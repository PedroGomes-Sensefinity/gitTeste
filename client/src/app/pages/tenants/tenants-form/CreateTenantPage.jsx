import React from "react";
import { TabContainer } from "react-bootstrap";
import { Layout } from "../../../../_metronic/layout";
import TenantsComponent from "../../../components/form/TenantsComponent";
import TenantPageHeader from "./TenantPageHeader";


export function CreateTenantPage() {
    return (
        <Layout>
            <TenantPageHeader tenantId={undefined} />
            <TabContainer>
                <TenantsComponent tenantId={undefined} />
            </TabContainer >
        </Layout>
    )
}