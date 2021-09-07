import React from "react";
import {Paper, Tab, Tabs} from "@material-ui/core";
import {TabContainer} from "react-bootstrap";
import ProfilesFormComponent from "../../../components/form/ProfilesComponent";

export function ProfilesForm({match}) {
    const {id} = match.params;
    const [value, setValue] = React.useState(0);

    function handleChange(event, newValue) {
        setValue(newValue);
    }

    return (
        <div>
            <Paper square>
                <Tabs value={value} indicatorColor="primary" textColor="primary" onChange={handleChange}>
                    <Tab label="Profile"/>
                </Tabs>
            </Paper>
            <TabContainer>
                {value === 0 && <ProfilesFormComponent id={id} />}
            </TabContainer>
        </div>
    )
}