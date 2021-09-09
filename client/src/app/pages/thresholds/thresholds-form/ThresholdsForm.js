import React from "react";
import ThresholdFormComponent from "../../../components/form/thresholdFormComponent";
import ThresholdActionComponent from "../../../components/form/thresholdActionComponent";
import ThresholdDevicesComponent from "../../../components/form/thresholdDevicesComponent";
import ThresholdGroupsComponent from "../../../components/form/thresholdGroupsComponent";
import { Paper, Tab, Tabs } from "@material-ui/core";
import {TabContainer} from "react-bootstrap";
                  
export function ThresholdsForm({history, match}) {
    const {id} = match.params;
    const [value, setValue] = React.useState(0);

    function handleChange(event, newValue) {
        setValue(newValue);
    }

    return (
        <div>
            <Paper square>
                <Tabs value={value} indicatorColor="primary" textColor="primary" onChange={handleChange}>
                    <Tab label="Threshold Info"/>
                    <Tab label="Action" disabled={typeof id === 'undefined'} />
                    <Tab label="Devices" disabled={typeof id === 'undefined'} />
                    <Tab label="Groups" disabled={typeof id === 'undefined'} />
                </Tabs>
            </Paper>
            <TabContainer>
                {value === 0 && <ThresholdFormComponent id={id} />}
            </TabContainer>
            <TabContainer>
                {value === 1 && <ThresholdActionComponent id={id} />}
            </TabContainer>
            <TabContainer>
                {value === 2 && <ThresholdDevicesComponent id={id} />}
            </TabContainer>
            <TabContainer>
                {value === 3 && <ThresholdGroupsComponent id={id} />}
            </TabContainer>
        </div>
    );
}  