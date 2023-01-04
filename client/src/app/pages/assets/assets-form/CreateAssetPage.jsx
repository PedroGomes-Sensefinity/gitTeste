import React from "react";
import { TabContainer } from "react-bootstrap";
import { Layout } from "../../../../_metronic/layout";
import AssetsFormComponent from "../../../components/form/AssetsFormComponent";
import AssetsPageHeader from "./AssetsPageHeader";


export function CreateAssetPage() {

    return <Layout>
        <AssetsPageHeader />
        <TabContainer>
            <AssetsFormComponent />
        </TabContainer>
    </Layout>
}