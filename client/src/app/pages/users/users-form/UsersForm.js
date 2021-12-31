import React from "react";
import UserFormComponent from "../../../components/form/userFormComponent";
import PermissionGate from "../../../modules/Permission/permissionGate";

export function UsersForm({match}) {
    const {id} = match.params;

    return (
        <PermissionGate permission={'user_create'}>
            <UserFormComponent id={id} />
        </PermissionGate>
    );
}