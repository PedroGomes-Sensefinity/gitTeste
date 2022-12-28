import React, { useEffect, useState } from "react";
import BlockUi from "react-block-ui";
import { TabContainer } from "react-bootstrap";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import ThresholdActionComponent from "../../../components/form/ThresholdActionComponent";
import ThresholdDevicesComponent from "../../../components/form/ThresholdDevicesComponent";
import ThresholdFormComponent from "../../../components/form/ThresholdFormComponent";
import ThresholdGroupsComponent from "../../../components/form/ThresholdGroupsComponent";
import apiServiceV2 from "../../../services/v2/apiServiceV2";
import { LazyRender } from "../../../utils/LazyRender";
import templates from "../../../utils/links";
import ThresholdFormHeader from "./ThresholdFormHeader";


export function ThresholdsForm({ match }) {
    const { id } = match.params;
    let { path } = useRouteMatch();

    const [threshold, setThreshold] = useState({})
    const [isLoading, setLoading] = useState(true)

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

    return (
        <div>
            <ThresholdFormHeader thresholdId={id} />
            <TabContainer>
                <Switch>
                    <Route exact path={templates.thresholdsEdit.templateString}>
                        {
                            <LazyRender isLoading={isLoading}>
                                <ThresholdFormComponent id={id} threshold={threshold} onChange={setThreshold} />
                            </LazyRender>
                        }
                    </Route>
                    <Route path={templates.thresholdsActions.templateString}>
                        {
                            <LazyRender isLoading={isLoading}>
                                <ThresholdActionComponent id={id} threshold={threshold} onChange={setThreshold} />
                            </LazyRender>
                        }
                    </Route>
                    <Route path={templates.thresholdsDevices.templateString}>
                        {<LazyRender isLoading={isLoading}>
                            <BlockUi tag='div' blocking={isLoading}>
                                <ThresholdDevicesComponent id={id} />
                            </BlockUi>
                        </LazyRender>
                        }
                    </Route>
                    <Route path={templates.thresholdsGroups.templateString}>
                        {
                            <LazyRender isLoading={isLoading}>
                                <BlockUi tag='div' blocking={isLoading}>
                                    <ThresholdGroupsComponent id={id} />
                                </BlockUi>
                            </LazyRender>
                        }
                    </Route>
                </Switch>
            </TabContainer>
        </div>
    );
}