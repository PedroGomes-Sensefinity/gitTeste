import { Paper, Tab, Tabs } from "@material-ui/core";
import React, { useMemo, useState, useEffect } from "react";
import { injectIntl } from "react-intl";
import { KibanaDashboard } from "../KibanaDashboard";
import apiServiceV2 from "../../../services/v2/apiServiceV2";
import { Layout } from "../../../../_metronic/layout";

export function DashboardsRoutes() {
    const [value, setValue] = useState(-1);
    const [dashboards, setDashboards] = useState([{}]);

    const handleChange = (_event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        apiServiceV2.get("v2/tenants/dashboards?search=Routes").then(response => {
            let dashboard = [];
            if (response.dashboards_tenant != undefined) {
                response.dashboards_tenant.forEach(d => dashboard.push(d));
            }
            if (dashboard.length === 0) {
                dashboard = [{}];
                setDashboards(dashboard);
            } else {
                console.log(dashboard)
                setDashboards(dashboard);
                setValue(0)
            }
        });
    }, []);

    const componentToBeRendered = useMemo(() => {
        console.log(value)
        console.log(dashboards)
        if (dashboards[value] !== undefined && dashboards[value].url !== undefined) {
            switch (value) {
                default:
                    return <KibanaDashboard url={dashboards[value].url} />;
            }
        }
    }, [value]);

    return (
        <Layout>
            <Paper square>
                <Tabs value={value} indicatorColor="secondary" textColor="secondary" onChange={handleChange}>
                    {dashboards.map(d => (
                        <Tab label={d.name} />
                    ))}
                </Tabs>
            </Paper>
            {componentToBeRendered}
        </Layout>
    );
}
export default injectIntl(DashboardsRoutes);
