import React from "react";
import TenantFormComponent from "../../../components/form/tenantFormComponent";

export function TenantsForm({match}) {
    const {id} = match.params;

    return (
        <TenantFormComponent id={id} />
    );
}