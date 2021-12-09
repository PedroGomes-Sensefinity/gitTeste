import React, {useEffect} from "react";
import ThresholdFormComponent from "../../../components/form/thresholdFormComponent";
import ThresholdActionComponent from "../../../components/form/thresholdActionComponent";
import ThresholdDevicesComponent from "../../../components/form/thresholdDevicesComponent";
import ThresholdGroupsComponent from "../../../components/form/thresholdGroupsComponent";
import { Paper, Tab, Tabs } from "@material-ui/core";
import {TabContainer} from "react-bootstrap";
import apiService from "../../../services/apiService";
import ThresholdGeofencingComponent from "../../../components/form/thresholdGeofencingComponent";

export function ThresholdsForm({match}) {
    const {id} = match.params;
    const [value, setValue] = React.useState(0);
    const [thresholdType, setThresholdType] = React.useState('');

    function handleChange(event, newValue) {
        setValue(newValue);
    }

    function hasGeofencing() {
        return (thresholdType === 'geofences');
    }

    useEffect(() => {
        if (typeof id !== 'undefined') {
            apiService.getById('threshold', id)
                .then((response) => {
                    let threshold = response.thresholds[0];
                    let rule = JSON.parse(threshold.rule);
                    setThresholdType(rule.type);
                });
        }
    }, []);

    return (
        <div>
            <Paper square>
                <Tabs value={value} indicatorColor="primary" textColor="primary" onChange={handleChange}>
                    <Tab label="Threshold Info"/>
                    <Tab label="Geofencing" disabled={typeof id === 'undefined' && !hasGeofencing()} />
                    <Tab label="Action" disabled={typeof id === 'undefined'} />
                    <Tab label="Devices" disabled={typeof id === 'undefined'} />
                    <Tab label="Groups" disabled={typeof id === 'undefined'} />
                </Tabs>
            </Paper>
            <TabContainer>
                {value === 0 && <ThresholdFormComponent id={id} />}
            </TabContainer>
            <TabContainer>
                {value === 1 && <ThresholdGeofencingComponent id={id} />}
            </TabContainer>
            <TabContainer>
                {value === 2 && <ThresholdActionComponent id={id} />}
            </TabContainer>
            <TabContainer>
                {value === 3 && <ThresholdDevicesComponent id={id} />}
            </TabContainer>
            <TabContainer>
                {value === 4 && <ThresholdGroupsComponent id={id} />}
            </TabContainer>
        </div>
    );
}