import { Paper, Tab, Tabs } from "@material-ui/core";
import React, { useMemo, useState, useEffect } from "react";
import { injectIntl } from "react-intl";
import { KibanaDashboard } from "../KibanaDashboard";
import apiServiceV2 from "../../../services/v2/apiServiceV2";
export function ListDashboards() {
    const [value, setValue] = useState(-1);
    const [dashboards, setDashboards] = useState([]);

    const handleChange = (_event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        apiServiceV2.get("v2/tenants/dashboards?search=ContainersList").then(response => {
            if (response.dashboards_tenant != undefined) {
                let dashboard = [];
                response.dashboards_tenant.forEach(d => {
                    dashboard.push(d);
                });
                setDashboards(dashboard);
                setValue(0);
            }
        });
    }, []);

    const componentToBeRendered = useMemo(() => {

        if (dashboards[value] === undefined) {
            return <></>;
        } else {
            return <KibanaDashboard url={dashboards[value].url} />;
        }
    }, [value]);

    return (
        <>
            <Paper key={dashboards} square>
                <Tabs value={value} indicatorColor="secondary" textColor="secondary" onChange={handleChange}>
                    {dashboards.map(d => (
                        <Tab label={d.name} />
                    ))}
                </Tabs>
            </Paper>
            {componentToBeRendered}
        </>
    );
}
export default injectIntl(ListDashboards);
