import React, { useContext, useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux"
import { LayoutSplashScreen } from "../../../_metronic/layout"
import permissionService from '../../services/permissionService'

const PermissionsContext = React.createContext({ permissions: [] })

function PermissionsProvider({ children }) {
    const [permissions, setPermissions] = useState(undefined)
    //get user from redux
    const { user } = useSelector(({ auth }) => ({
        user: auth.user,
    }))

    useEffect(() => {
        if(user) {
            permissionService.getUserPermissions()
            .then(userPerms => {
                const perms = userPerms.reduce((prev, perm) => {
                    prev[perm.slug] = true
                    return prev
                }, {});
                setPermissions(Permissions(perms))
            }).catch(() => { 
                setPermissions({})
            })
        } else {
            setPermissions({})
        }
    }, [user])

    const perms = useMemo(() => {
        return { user, permissions }
    }, [permissions, user])

    return <PermissionsContext.Provider value={perms}>
        {/* Maybe insert some loading mechanism while permissions are being fetched*/}
        {perms.permissions === undefined ? <LayoutSplashScreen /> : children}
    </PermissionsContext.Provider>
}

const usePermissions = () => useContext(PermissionsContext)

export { PermissionsProvider, usePermissions }

/**
 * Represents User Permissions that come from the API and come with snake case property names, this class is created to transform 
 * them to camelCase properties
 */
function Permissions(permsObj) {

    const defaultValue = permsObj['all'] || false
    return {

        // Device permissions
        canViewDevices: permsObj['device_view'] || defaultValue,
        canCreateDevices: permsObj['device_create'] || defaultValue,
        canEditDevices: permsObj['device_edit'] || defaultValue,

        // Board Families permissions
        canViewBoardFamilies: permsObj['board_family_view'] || defaultValue,
        canCreateBoardFamilies: permsObj['board_family_create'] || defaultValue,
        canEditBoardFamilies: permsObj['board_family_edit'] || defaultValue,
        
        // Group related operations permissions
        canViewGroups: permsObj['group_view'] || defaultValue,
        canCreateGroups: permsObj['group_create'] || defaultValue,
        canEditGroups: permsObj['group_edit'] || defaultValue,

        // Thresholds permissions
        canViewThresholds: permsObj['threshold_view'] || defaultValue,
        canCreateThresholds: permsObj['threshold_create'] || defaultValue,
        canEditThresholds: permsObj['threshold_edit'] || defaultValue,

        // Thresholds permissions
        canViewProfiles: permsObj['profile_view'] || defaultValue,
        canCreateProfiles: permsObj['profile_create'] || defaultValue,
        canEditProfiles: permsObj['profile_edit'] || defaultValue,
        
        // Assets permissions
        canViewAssets: permsObj['asset_view'] || defaultValue,
        canCreateAssets: permsObj['asset_create'] || defaultValue,
        canEditAssets: permsObj['asset_edit'] || defaultValue,

        // Route related operations permissions
        canViewRoutes: permsObj['route_view'] || defaultValue,
        canCreateRoutes: permsObj['route_create'] || defaultValue,
        canEditRoutes: permsObj['route_edit'] || defaultValue,

        // Geofence related operations permissions
        canViewGeofences: permsObj['geofence_view'] || defaultValue,
        canCreateGeofences: permsObj['geofence_create'] || defaultValue,
        canEditGeofences: permsObj['geofence_edit'] || defaultValue,

        // User related operations permissions
        canViewUsers: permsObj['user_view'] || defaultValue,
        canCreateUsers: permsObj['user_create'] || defaultValue,
        canEditUsers: permsObj['user_edit'] || defaultValue,

        // Tenant related operations permissions
        canViewTenants: permsObj['tenant_view'] || defaultValue,
        canCreateTenants: permsObj['tenant_create'] || defaultValue,
        canEditTenants: permsObj['tenant_edit'] || defaultValue,
        
        // Alarms related operations permissions
        canViewAlarms: permsObj['alarm_view'] || defaultValue,
        canCreateAlarms: permsObj['alarm_create'] || defaultValue,
        canEditAlarms: permsObj['alarm_edit'] || defaultValue,

        // Notification Templates permissions
        canViewNotificationTemplates: permsObj['notification_template_view'] || defaultValue,
        canCreateNotificationTemplates: permsObj['notification_template_create'] || defaultValue,
        canEditNotificationTemplates: permsObj['notification_template_edit'] || defaultValue,

        // FloorMap related operations permissions
        canViewFloorMaps: permsObj['floormap_view'] || defaultValue,
        canCreateFloorMaps: permsObj['floormap_create'] || defaultValue,
        canEditFloorMaps: permsObj['floormap_edit'] || defaultValue,
    
        canViewContainerDashboard: permsObj['dashboard_containers'] || defaultValue
    }
}


