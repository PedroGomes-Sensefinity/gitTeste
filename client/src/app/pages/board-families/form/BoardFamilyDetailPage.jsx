import React from "react";
import { TabContainer } from "react-bootstrap";
import { Outlet, useParams } from "react-router-dom";
import { Layout } from "../../../../_metronic/layout";
import BoardFamilyPageHeader from "./BoardFamilyPageHeader";

export function BoardFamilyDetailPage() {

    const { id } = useParams();
    const context = { boardFamilyId: id }

    return (
        <Layout>
            <BoardFamilyPageHeader boardFamilyId={id} />
            <TabContainer>
                <Outlet context={context} />
            </TabContainer>
        </Layout>
    )
}