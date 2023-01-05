import React from "react"
import { Paper, Tab, Tabs } from "@material-ui/core"
import { TabContainer } from "react-bootstrap";
import ThresholdFormComponent from "../../../components/form/ThresholdFormComponent";

export function CreateThreshold() {

    return <div>
        <Paper square>
            <Tabs value={0} indicatorColor="primary" textColor="primary">
                <Tab label="Threshold Info" />
            </Tabs>
        </Paper>
        <TabContainer>
            <ThresholdFormComponent id={undefined} onChange={() => {}}/>
        </TabContainer>
    </div>
}