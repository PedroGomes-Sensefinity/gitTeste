import React from "react";

import { TabContainer } from "react-bootstrap";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import TenantsFormComponent from "../../../components/form/TenantsComponent";
import TenantsPersonalizationComponent from "../../../components/form/TenantsPersonalizationComponent";
import { LazyRender } from "../../../utils/LazyRender";
import TenantFormHeader from "./TenantHeader";


export function TenantsForm({ match }) {
    const { id } = match.params;
    let { path, url } = useRouteMatch();

    return (
        <>
            <TenantFormHeader tenantId={id} />
            <TabContainer>
                <Switch>
                    <Route exact path={`${path}`}>
                        {
                            <LazyRender>
                                <TenantsFormComponent id={id} />
                            </LazyRender>
                        }
                    </Route>
                    <Route path={`${path}/personalization`}>
                        {
                            <LazyRender >
                                <TenantsPersonalizationComponent id={id} />
                            </LazyRender>
                        }
                    </Route>
                </Switch>
            </TabContainer >
        </>
    )
}