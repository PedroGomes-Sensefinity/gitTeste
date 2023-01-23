import { Paper, Tab, Tabs } from "@material-ui/core";
import React from "react";
import { TabContainer } from "react-bootstrap";
import ProfilesFormComponent from "../../../components/form/ProfilesComponent";
import { injectIntl } from "react-intl";

export function ProfilesForm({ match }) {
    const { id } = match.params;

    return (
        <div>
            <Paper square>
                <Tabs value={0} indicatorColor="primary" textColor="primary" >
                    <Tab label="Profile" />
                </Tabs>
            </Paper>
            <TabContainer>
                <ProfilesFormComponent id={id} />
            </TabContainer>
        </div>
    )
}

export default injectIntl(ProfilesForm);