import { Paper, Tab, Tabs } from "@material-ui/core";
import React from "react";
import { generatePath, Link, useLocation } from "react-router-dom";
import templates from '../../../utils/links';


const boardFamilyEditTemplate = templates.boardFamilyEdit
const boardFamilyCreateTemplate = templates.boardFamilyCreate
const boardFamilyTemplatesTemplate = templates.boardFamilyTemplates

const editSegment = boardFamilyEditTemplate.split('/').pop()
const createSegment = boardFamilyCreateTemplate.split('/').pop()
const templatesSegment = boardFamilyTemplatesTemplate.split('/').pop()

export default function BoardFamilyPageHeader(props) {

    const { boardFamilyId } = props
    const isAddMode = !boardFamilyId
    const location = useLocation()

    const getInitialValue = () => {
        const firstSegment = isAddMode ? createSegment : editSegment

        const lastSegment = location.pathname.split('/').pop()
        switch (lastSegment) {
            case firstSegment: return 0
            case templatesSegment: return 1
        }
    }

    const value = getInitialValue()
    const firstLink = isAddMode ? boardFamilyCreateTemplate : generatePath(boardFamilyEditTemplate, { id: boardFamilyId })

    return <Paper square>
        <Tabs value={value} indicatorColor="primary" textColor="primary" >
            <Tab label="Board family Info" component={Link} to={firstLink} />
            <Tab label="Templates" disabled={isAddMode} component={Link} to={isAddMode ? '' : generatePath(boardFamilyTemplatesTemplate, { id: boardFamilyId })} />
        </Tabs>
    </Paper>
}
