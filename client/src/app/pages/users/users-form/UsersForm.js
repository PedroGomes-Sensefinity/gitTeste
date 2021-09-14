import React from "react";
import UserFormComponent from "../../../components/form/userFormComponent";

export function UsersForm({match}) {
    const {id} = match.params;

    return (
        <UserFormComponent id={id} />
    );
}