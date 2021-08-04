import React from "react";
import GroupsFormComponent from "../../../components/form/groupsFormComponent";
                  
export function GroupsForm({match}) {
    const {id} = match.params;

    return <GroupsFormComponent id={id}  />
}  