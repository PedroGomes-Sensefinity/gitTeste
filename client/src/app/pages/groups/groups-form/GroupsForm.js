import React from "react";
import GroupsFormComponent from "../../../components/form/groupsFormComponent";
import {Paper, Tab, Tabs} from "@material-ui/core";
import {TabContainer} from "react-bootstrap";
import GroupsDevicesComponent from "../../../components/form/groupsDevicesComponent";

export function GroupsForm({match}) {
    const {id} = match.params;
    const [value, setValue] = React.useState(0);

    function handleChange(event, newValue) {
        setValue(newValue);
    }

    return (
        <div>
            <Paper square>
                <Tabs value={value} indicatorColor="primary" textColor="primary" onChange={handleChange}>
                    <Tab label="Group Info"/>
                    <Tab label="Devices" disabled={typeof id === 'undefined'}/>
                </Tabs>
            </Paper>
            <TabContainer>
                {value === 0 && <GroupsFormComponent id={id} />}
            </TabContainer>
            <TabContainer>
                {value === 1 && <GroupsDevicesComponent id={id} /> }
            </TabContainer>
        </div>
    );
}