import React, {useEffect} from "react";
import tenantService from "../../../services/tenantService";
import TenantFormComponent from "../../../components/form/tenantFormComponent";
                  
export function TenantsForm({history, match}) {
    const {id} = match.params;

    return (
        <TenantFormComponent id={id} />
    );
}  