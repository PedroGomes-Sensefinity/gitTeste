import React, {useEffect} from "react";
import BoardFamiliesFormComponent from "../../../components/form/BoardFamiliesFormComponent";
import BoardFamilyTemplatesComponent from "../../../components/form/boardFamilyTemplatesComponent";
import {Paper, Tab, Tabs} from "@material-ui/core";
import {TabContainer} from "react-bootstrap";
                  
export function BoardFamiliesForm({match}) {
    const {id} = match.params;
    const [value, setValue] = React.useState(0);

    function handleChange(event, newValue) {
        setValue(newValue);
    }

    return (
        <div>
            <Paper square>
                <Tabs value={value} indicatorColor="primary" textColor="primary" onChange={handleChange}>
                    <Tab label="Board family Info"/>
                    <Tab label="Templates" disabled={typeof id === 'undefined'}/>
                </Tabs>
            </Paper>
            <TabContainer>
                {value === 0 && <BoardFamiliesFormComponent id={id} />}
            </TabContainer>
            <TabContainer>
                {value === 1 && <BoardFamilyTemplatesComponent id={id} /> }
            </TabContainer>
        </div>
    )
}  