import React from "react";
import { TabContainer } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { Layout } from "../../../../_metronic/layout";
import LocationFormComponent from "../../../components/form/LocationFormComponent";
import { LocationPageHeader } from "./LocationPageHeader";

export function LocationDetailPage() {
    const { id } = useParams()
    return (
        <Layout>
            <LocationPageHeader locationId={id} />
            <TabContainer>
                <LocationFormComponent id={id} />
            </TabContainer>
        </Layout>
    );
}