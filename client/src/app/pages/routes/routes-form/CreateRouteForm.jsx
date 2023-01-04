import React from "react";
import { TabContainer } from "react-bootstrap";
import { Outlet, useParams } from "react-router-dom";
import RoutePageHeader from "./RoutePageHeader";
import RouteFormComponent from "../../../components/form/RoutesFormComponent"
import { Layout } from "../../../../_metronic/layout";

export function CreateRoutePage() {
    return (
        <Layout>
            <RoutePageHeader />
            <TabContainer>
                <RouteFormComponent />
            </TabContainer>
        </Layout>
    );
}