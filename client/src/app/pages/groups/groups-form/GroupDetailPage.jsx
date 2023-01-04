import React from "react";
import { TabContainer } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { Layout } from "../../../../_metronic/layout";
import GroupsFormComponent from "../../../components/form/GroupsFormComponent";
import GroupPageHeader from "./GroupPageHeader";

export function GroupDetailPage() {
    const { id } = useParams()
    return (
        <Layout>
            <GroupPageHeader id={id} />
            <TabContainer>
                <GroupsFormComponent id={id} />
            </TabContainer>
        </Layout>
    );
}