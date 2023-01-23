import React from "react";
import UserFormComponent from "../../../components/form/UserFormComponent";
import PermissionGate from "../../../modules/Permission/permissionGate";
import { injectIntl } from "react-intl";

export function UsersForm({match}) {
    const {id} = match.params;

    return (
        <PermissionGate permission={'user_create'}>
            <UserFormComponent id={id} />
        </PermissionGate>
    );
}

export default injectIntl(UsersForm);