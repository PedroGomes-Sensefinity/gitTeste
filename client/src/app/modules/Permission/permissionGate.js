import React, { useEffect } from "react";
import permissionService from "../../services/permissionService";
import PermissionDenied from "./permissionDenied";

export default function PermissionGate({
    children,
    permission,
}) {
    const [isAllowed, setIsAllowed] = React.useState(true);

    useEffect(() => {
        permissionService.hasPermission(permission).then(
            () => {
                setIsAllowed(true);
            },
            () => {
                setIsAllowed(false)
            });
    }, []);

    if (!isAllowed) return <PermissionDenied />;

    return <>{children}</>;
}