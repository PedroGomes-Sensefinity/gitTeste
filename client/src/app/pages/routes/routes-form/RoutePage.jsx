import React from "react";
import { TabContainer } from "react-bootstrap";
import { Outlet, useParams } from "react-router-dom";
import { Layout } from "../../../../_metronic/layout";
import RoutePageHeader from "./RoutePageHeader";

export function RoutesPage() {
    const { id } = useParams()
    const context = { routeId: id }

    return (
        <Layout>
            <RoutePageHeader routeId={id} />
            <TabContainer>
                <Outlet context={context} />
            </TabContainer>
        </Layout>
    );
}