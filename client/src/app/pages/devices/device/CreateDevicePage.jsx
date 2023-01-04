import React from "react";
import { TabContainer } from "react-bootstrap";
import { Layout } from "../../../../_metronic/layout";
import DeviceFormComponent from "../../../components/form/DeviceFormComponent";
import DevicePageHeader from "./DevicePageHeader";


export function CreateDevicePage() {
    return (
        <Layout>
            <DevicePageHeader />
            <TabContainer>
                <DeviceFormComponent />
            </TabContainer>
        </Layout>
    )
}
