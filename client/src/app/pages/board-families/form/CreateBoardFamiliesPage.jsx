import React from "react";
import { TabContainer } from "react-bootstrap";
import { Layout } from "../../../../_metronic/layout";
import BoardFamiliesFormComponent from "../../../components/form/BoardFamiliesFormComponent";
import BoardFamiliesFormHeader from "./BoardFamilyPageHeader";

export function CreateBoardFamilyPage() {

    return (
        <Layout>
            <BoardFamiliesFormHeader />
            <TabContainer>
                <BoardFamiliesFormComponent />
            </TabContainer>
        </Layout>
    )
}