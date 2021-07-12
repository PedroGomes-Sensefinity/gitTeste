import React, {useEffect} from "react";
import tenantService from "../../../services/tenantService";
import TenantFormComponent from "../../../components/form/tenantFormComponent";
                  
export function TenantsForm({history, match}) {
    const {id} = match.params;
    const [value, setValue] = React.useState(0);
    const [tenant, setTenant] = React.useState({});

    useEffect(() => {
        tenantService.getInfo().then((response) => {
            setTenant(response);
        });
    }, []);
    return (
        <TenantFormComponent id={id} />
    );
}  