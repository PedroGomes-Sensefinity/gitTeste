import { Paper, Tab, Tabs } from "@material-ui/core";
import React, { useEffect, useMemo, useState } from "react";
import BlockUi from "react-block-ui";
import { TabContainer } from "react-bootstrap";
import ThresholdActionComponent from "../../../components/form/ThresholdActionComponent";
import ThresholdAssetsComponent from "../../../components/form/ThresholdAssetsComponent";
import ThresholdDevicesComponent from "../../../components/form/ThresholdDevicesComponent";
import ThresholdFormComponent from "../../../components/form/ThresholdFormComponent";
import ThresholdGeofencesComponent from "../../../components/form/ThresholdGeofencesComponent";
import ThresholdGroupsComponent from "../../../components/form/ThresholdGroupsComponent";
import apiServiceV2 from "../../../services/v2/apiServiceV2";
import { injectIntl } from "react-intl";

export function ThresholdsForm({ match }) {
    const { id } = match.params;
    const [value, setValue] = useState(0);
    const [threshold, setThreshold] = useState({})
    const [isLoading, setLoading] = useState(true)

    function handleChange(event, newValue) {
        setValue(newValue);
    }

    useEffect(() => {
        apiServiceV2.get('v2/thresholds/' + id)
            .then((response) => {
                let threshold = response.threshold;
                let rule = JSON.parse(threshold.rule);
                threshold.rule = rule
                setThreshold(threshold)
                setLoading(false)
            });
    }, []);

    const componentToBeRendered = useMemo(() => {
        if (isLoading) {
            return <></>
        }
        switch (value) {
            case 0:
                return <ThresholdFormComponent id={id} threshold={threshold} onChange={setThreshold} />
            case 1:
                return <ThresholdActionComponent id={id} threshold={threshold} onChange={setThreshold} />
            case 2:
                return <ThresholdAssetsComponent id={id} threshold={threshold} />
            case 3:
                return <ThresholdGeofencesComponent id={id} threshold={threshold} />
            case 4:
                return <ThresholdDevicesComponent id={id} />
            case 5:
                return <ThresholdGroupsComponent id={id} />
        }
    }, [value, threshold, isLoading]);

    return (
        <BlockUi tag='div' blocking={isLoading}>
            <div>
                <Paper square>
                    <Tabs value={value} indicatorColor="primary" textColor="primary" onChange={handleChange}>
                        <Tab label="Threshold Info" />
                        <Tab label="Notification Template" disabled={typeof id === 'undefined'} />
                        <Tab label="Assets" disabled={typeof id === 'undefined'} />
                        <Tab label="Geofences" disabled={typeof id === 'undefined'} />
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

export default injectIntl(ThresholdsForm);