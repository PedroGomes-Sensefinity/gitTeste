import React from "react";
import { TabContainer } from "react-bootstrap";
import { Layout } from "../../../../_metronic/layout";
import FloorMapFormComponent from "../../../components/form/FloorMapFormComponent";
import { FloorMapHeader } from "./FloorMapHeader";

export function CreateFloorMapForm() {

    return (
        <Layout>
            <FloorMapHeader />
            <TabContainer>
                <FloorMapFormComponent />
            </TabContainer>
        </Layout>
    )
}