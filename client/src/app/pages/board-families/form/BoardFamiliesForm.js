import React from "react";
import BoardFamiliesFormComponent from "../../../components/form/BoardFamiliesFormComponent";
                  
export function BoardFamiliesForm({match}) {
    const {id} = match.params;

    return <BoardFamiliesFormComponent id={id}  />
}  