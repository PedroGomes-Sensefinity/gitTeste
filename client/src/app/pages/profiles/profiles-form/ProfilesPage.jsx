import { Paper, Tab, Tabs } from "@material-ui/core";
import React from "react";
import { TabContainer } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { Layout } from "../../../../_metronic/layout";
import ProfilesFormComponent from "../../../components/form/ProfilesComponent";

export function ProfilesPage() {
    const { id } = useParams()

    return (
        <Layout>
            <Paper square>
                <Tabs value={0} indicatorColor="primary" textColor="primary" >
                    <Tab label="Profile" />
                </Tabs>
            </Paper>
            <TabContainer>
                <ProfilesFormComponent id={id} />
            </TabContainer>
        </Layout>
    )
}