import React from "react";
import { TabContainer } from "react-bootstrap";
import { Outlet, useParams } from "react-router-dom";
import { Layout } from "../../../../_metronic/layout";
import DevicePageHeader from "./DevicePageHeader";

export function DeviceDetailPage() {

    const { id } = useParams();
    const context = { deviceId: id }

    return (
        <Layout>
            <DevicePageHeader deviceId={id} />
            <TabContainer>
                <Outlet context={context} />
            </TabContainer>
        </Layout>
    )
}
