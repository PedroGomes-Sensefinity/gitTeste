import React from "react"
import { Paper, Tab, Tabs } from "@material-ui/core"
import { TabContainer } from "react-bootstrap";
import ThresholdFormComponent from "../../../components/form/ThresholdFormComponent";
import { Layout } from "../../../../_metronic/layout";

export function CreateThresholdPage() {

    return <Layout>
        <Paper square>
            <Tabs value={0} indicatorColor="primary" textColor="primary">
                <Tab label="Threshold Info" />
            </Tabs>
        </Paper>
        <TabContainer>
            <ThresholdFormComponent thresholdId={undefined} onChange={() => { }} />
        </TabContainer>
    </Layout>
}