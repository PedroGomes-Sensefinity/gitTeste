import React from "react";
import TenantsFormComponent from "../../../components/form/TenantsComponent";
import {Paper, Tab, Tabs} from "@material-ui/core";
import {TabContainer} from "react-bootstrap";
import TenantsPersonalizationComponent from "../../../components/form/TenantsPersonalizationComponent";

export function TenantsForm({match}) {
    const {id} = match.params;
    const [value, setValue] = React.useState(0);

    function handleChange(event, newValue) {
        setValue(newValue);
    }

    return (
        <div>
            <Paper square>
                <Tabs value={value}
                      indicatorColor="primary"
                      textColor="primary"
                      onChange={handleChange}>
                    <Tab label="Tenant"/>
                    {typeof id !== "undefined" &&
                        <Tab label="Personalization"/>
                    }
                </Tabs>
            </Paper>
            <TabContainer>
                {value === 0 && <TenantsFormComponent id={id} />}
            </TabContainer>
            <TabContainer>
                {value === 1 &&  <TenantsPersonalizationComponent id={id} />}
            </TabContainer>
        </div>
    )
}