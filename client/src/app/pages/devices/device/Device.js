import React, {useEffect} from "react";
import DeviceFormComponent from "../../../components/form/deviceFormComponent";
import DeviceConfigMessageComponent from "../../../components/form/deviceConfigMessageComponent";
import tenantService from '../../../services/tenantService';
import {Paper, Tab, Tabs} from "@material-ui/core";
import {TabContainer} from "react-bootstrap";

export function Device({history, match}) {
    const {id} = match.params;
    const [value, setValue] = React.useState(0);
    const [tenant, setTenant] = React.useState({});

    useEffect(() => {
        tenantService.getInfo().then((response) => {
            setTenant(response);
        });
    }, []);

    return (
        <div>
            <Paper square>
                <Tabs value={value} indicatorColor="primary" textColor="primary" onChange={handleChange}>
                    <Tab label="Device Info"/>
                    <Tab label="Thresholds" disabled={id === 'new'}/>
                    <Tab label="Configuration" disabled={id === 'new'} hidden={tenant.type !== 'master'} />
                </Tabs>
            </Paper>
            <TabContainer>
                {value === 0 && <DeviceFormComponent entity={id} />}
            </TabContainer>
            <TabContainer>
                {value === 1 && "Thresholds"}
            </TabContainer>
            <TabContainer>
                {value === 2 && <DeviceConfigMessageComponent entity={id} /> }
            </TabContainer>
        </div>
    )

    function handleChange(event, newValue) {
        setValue(newValue);
    }
}