import React from "react";
import {Paper, Tab, Tabs} from "@material-ui/core";
import {TabContainer} from "react-bootstrap";
import FloorMapFormComponent from "../../../components/form/FloorMapFormComponent";
import FloorMapAnchorsFormComponent from "../../../components/form/FloorMapAnchorsFormComponent";
import FloorMapMapFormComponent from "../../../components/form/FloorMapMapFormComponent";
import { injectIntl } from "react-intl";

export function FloorMapsForm({match}) {
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
                    <Tab label="General" />
                </Tabs>
            </Paper>
            <TabContainer>
                {value === 0 && <FloorMapFormComponent id={id} />}
            </TabContainer>
        </div>
    )
}
export default injectIntl(FloorMapsForm);