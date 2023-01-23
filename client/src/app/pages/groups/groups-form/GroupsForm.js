import { Paper, Tab, Tabs } from "@material-ui/core";
import React from "react";
import { TabContainer } from "react-bootstrap";
import GroupsFormComponent from "../../../components/form/GroupsFormComponent";
import { injectIntl } from "react-intl";

export function GroupsForm({match}) {
    const {id} = match.params;
    return (
        <div>
            <Paper square>
                <Tabs value={0} indicatorColor="primary" textColor="primary">
                    <Tab label="Group Info"/>
                    {/*<Tab label="Devices" disabled={typeof id === 'undefined'}/>*/}
                </Tabs>
            </Paper>
            <TabContainer>
                <GroupsFormComponent id={id} />
            </TabContainer>
        </div>
    );
}

export default injectIntl(GroupsForm);