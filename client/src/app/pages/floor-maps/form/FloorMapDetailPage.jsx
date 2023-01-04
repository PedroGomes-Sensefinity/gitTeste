import React from "react";
import { TabContainer } from "react-bootstrap";
import { Outlet, useParams } from "react-router-dom";
import { Layout } from "../../../../_metronic/layout";
import { FloorMapHeader } from "./FloorMapHeader";

export function FloorMapDetailPage() {
    const { id } = useParams()

    const context = { floorMapId: id }

    return (
        <Layout>
            <FloorMapHeader id={id} />
            <TabContainer>
                <Outlet context={context} />
            </TabContainer>
        </Layout>
    )
}