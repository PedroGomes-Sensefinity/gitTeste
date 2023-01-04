import React from "react";
import { TabContainer } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { Layout } from "../../../../_metronic/layout";
import SubLocationFormComponent from "../../../components/form/SubLocationFormComponent";
import { SubLocationsPageHeader } from "./SubLocationsPageHeader";

export function SubLocationsDetailPage() {
    const { id } = useParams()
    return (
        <Layout>
            <SubLocationsPageHeader subLocationId={id} />
            <TabContainer>
                <SubLocationFormComponent id={id} />
            </TabContainer>
        </Layout>
    );
}