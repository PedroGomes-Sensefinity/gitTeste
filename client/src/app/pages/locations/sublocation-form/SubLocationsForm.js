import { Paper, Tab, Tabs } from "@material-ui/core";
import React from "react";
import { TabContainer } from "react-bootstrap";
import SubLocationFormComponent from "../../../components/form/SubLocationFormComponent";
import { injectIntl } from "react-intl";

export function SubLocationsForm({match}) {
    const {id} = match.params;
    return (
        <div>
            <Paper square>
                <Tabs value={0} indicatorColor="primary" textColor="primary">
                    <Tab label="SubLocations"/>
                </Tabs>
            </Paper>
            <TabContainer>
                <SubLocationFormComponent id={id} />
            </TabContainer>
        </div>
    );
}

export default injectIntl(SubLocationsForm);