import React from "react"
import {Paper, Tab, Tabs} from "@material-ui/core"
import { TabContainer } from "react-bootstrap";
import AssetsFormComponent from "../../../components/form/AssetsFormComponent";
import { injectIntl } from "react-intl";


export function CreateAsset() {

    return <div>
            <Paper square>
                <Tabs value={0} indicatorColor="primary" textColor="primary" >
                    <Tab label="Asset Info"/>
                </Tabs>
            </Paper>
            <TabContainer>
                <AssetsFormComponent id={undefined} />
            </TabContainer>
        </div>
}

export default injectIntl(CreateAsset);