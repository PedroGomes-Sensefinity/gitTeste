import { Paper, Tab, Tabs } from "@material-ui/core";
import React, { useMemo, useState, useEffect } from "react";
import { TabContainer } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import PermissionGate from "../../../modules/Permission/permissionGate";
import ContainersDashboard from "./ContainersDashboard";
import { injectIntl } from "react-intl";
import BlockUi from "react-block-ui";
import { KibanaDashboard } from "../KibanaDashboard";
import apiServiceV2 from "../../../services/v2/apiServiceV2";
export function DashboardsContainers() {
    const [value, setValue] = useState(0);
    const [dashboards, setDashboards] = useState([{}]);

    const handleChange = (_event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        apiServiceV2.get("v2/tenants/dashboards?search=Containers").then(response => {
            let dashboard = [{ id: 0, name: "Containers Dashboard", url: "", group_name: "Containers", tenant_id: 1 }];
            if(response.dashboards_tenant != undefined){
                response.dashboards_tenant.forEach(d => dashboard.push(d));
            }
            setDashboards(dashboard)
        });
    }, []);

    const componentToBeRendered = useMemo(() => {
        switch (value) {
            case 0:
                return <ContainersDashboard />;
            default:
                return <KibanaDashboard url={dashboards[value].url} />;
        }
    }, [value]);

    return (
        <>
            <Paper square>
                <Tabs value={value} indicatorColor="secondary" textColor="secondary" onChange={handleChange} scrollButtons>
                    {dashboards.map(d => (
                        <Tab label={d.name} />
                    ))}
                </Tabs>
            </Paper>
            {componentToBeRendered} 
        </>
    );
}
export default injectIntl(DashboardsContainers);
