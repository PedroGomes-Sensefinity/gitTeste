import { useState, useEffect } from "react"
import permissionService from "../services/permissionService"

export default function usePermissions(...permissions) {

    const [permResults, setPerms] = useState({})

    useEffect(() => {
        Promise.allSettled(permissions.map(perm => {
            permissionService.hasPermission(perm)
        }))
        .then(results => results.map(res => res.status === "fulfilled"))
        .then(hasPermissions => {
            let tmp = {}
            permissions.forEach((element, idx) => {
                tmp[element] = hasPermissions[idx]
            });
            setPerms(tmp)
        })
    },[])

    return permResults
}