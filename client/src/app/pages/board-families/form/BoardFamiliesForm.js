import { Paper, Tab, Tabs } from "@material-ui/core";
import React, { useMemo } from "react";
import { TabContainer } from "react-bootstrap";
import BoardFamiliesFormComponent from "../../../components/form/BoardFamiliesFormComponent";
import { injectIntl } from "react-intl";

export function BoardFamiliesForm({ match }) {
    const { id } = match.params;
    const [value, setValue] = React.useState(0);

    function handleChange(_event, newValue) {
        setValue(newValue);
    }

    const componentToBeRendered = useMemo(() => {
        switch (value) {
            case 0:
                return <BoardFamiliesFormComponent id={id} />
            case 1:
                return <BoardFamiliesFormComponent id={id} />
        }
    }, [value, id])

    return (
        <div>
            <Paper square>
                <Tabs value={value} indicatorColor="primary" textColor="primary" onChange={handleChange}>
                    <Tab label="Board family Info" />
                    <Tab label="Templates" disabled={typeof id === 'undefined'} />
                </Tabs>
            </Paper>
            <TabContainer>
                {componentToBeRendered}
            </TabContainer>
        </div>
    )
}

export default injectIntl(BoardFamiliesForm);