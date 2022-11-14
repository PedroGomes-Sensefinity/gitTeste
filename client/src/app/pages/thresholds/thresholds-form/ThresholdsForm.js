import React, {useEffect, useState, useMemo} from "react";
import ThresholdFormComponent from "../../../components/form/ThresholdFormComponent";
import ThresholdActionComponent from "../../../components/form/ThresholdActionComponent";
import ThresholdDevicesComponent from "../../../components/form/ThresholdDevicesComponent";
import ThresholdGroupsComponent from "../../../components/form/ThresholdGroupsComponent";
import { Paper, Tab, Tabs } from "@material-ui/core";
import {TabContainer} from "react-bootstrap";
import apiService from "../../../services/apiService";
import BlockUi from "react-block-ui";

export function ThresholdsForm({match}) {
    const {id} = match.params;
    const [value, setValue] = useState(0);
    const [threshold, setThreshold] = useState({})
    const [isLoading, setLoading] = useState(true)

    function handleChange(event, newValue) {
        setValue(newValue);
    }

    useEffect(() => {
        apiService.getById('threshold', id)
            .then((response) => {
                let threshold = response.thresholds[0];
                let rule = JSON.parse(threshold.rule);
                threshold.rule = rule 
                setThreshold(threshold)
                setLoading(false)
            });
    }, []);

    const componentToBeRendered = useMemo(() => {
        if(isLoading) {
            return <></>
        }
        switch (value) {
            case 0:
                return <ThresholdFormComponent id={id} threshold={threshold} onChange={setThreshold}/>
            case 1: 
                return <ThresholdActionComponent id={id} threshold={threshold} onChange={setThreshold}/>
            case 2: 
                return <ThresholdDevicesComponent id={id} />
            case 3:
                return <ThresholdGroupsComponent id={id} />
        }
    } , [value, threshold, isLoading]);

    return (
        <BlockUi tag='div' blocking={isLoading}>
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
                    {componentToBeRendered}
                </TabContainer>
            </div>
        </BlockUi>
    );
}