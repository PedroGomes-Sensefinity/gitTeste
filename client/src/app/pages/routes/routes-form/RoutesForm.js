import React from "react";
import {Paper, Tab, Tabs} from "@material-ui/core";
import {TabContainer} from "react-bootstrap";
import RoutesFormComponent from "../../../components/form/RoutesFormComponent";
import RoutesMapComponent from "../../../components/form/RoutesMapComponent";

export function RoutesForm({match}) {
    const {id} = match.params;
    const [value, setValue] = React.useState(0);

    function handleChange(event, newValue) {
        setValue(newValue);
    }

    return (
        <div>
            <Paper square>
                <Tabs value={value} indicatorColor="primary" textColor="primary" onChange={handleChange}>
                    <Tab label="Route Info"/>
                    <Tab label="Route Map" disabled={typeof id === 'undefined'} />
                </Tabs>
            </Paper>
            <TabContainer>
                {value === 0 && <RoutesFormComponent id={id} />}
            </TabContainer>
            <TabContainer>
                {value === 1 && <RoutesMapComponent id={id} />}
            </TabContainer>
        </div>
    );
}