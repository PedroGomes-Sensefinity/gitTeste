import React from "react";
import {Paper, Tab, Tabs} from "@material-ui/core";
import {TabContainer} from "react-bootstrap";
import RoutesFormComponent from "../../../components/form/RoutesFormComponent";

export function RoutesForm({match}) {
    const {id} = match.params;
    const [value, setValue] = React.useState(0);

    function handleChange(event, newValue) {
        setValue(newValue);
    }

    return (<div>
        <Paper square>
            <Tabs value={value} indicatorColor="primary" textColor="primary" onChange={handleChange}>
                <Tab label="Route Info"/>
                <Tab label="Route Layout" disabled={typeof id === 'undefined'} />
            </Tabs>
        </Paper>
        <TabContainer>
            {value === 0 && <RoutesFormComponent id={id} />}
        </TabContainer>
        <TabContainer>
            {/*{value === 1 && <RouteDevicesComponent id={id} />}*/}
        </TabContainer>
    </div>

    );
}