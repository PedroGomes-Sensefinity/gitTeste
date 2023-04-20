import axios from "axios";

const permissionService = {
    hasPermission: function (slug) {
        return new Promise(function (resolve, reject) {
            axios.get(`${process.env.REACT_APP_REST_API_URL}permission/check/${slug}`)
                .then(response => {
                    //only possible when request is successfull
                    resolve(response.data)
                })
                .catch((err) => {
                    //triggered on 4XX status code
                    reject(err.response.data);
                });
        });
    },
    getUserPermissions: function () {
        return new Promise((resolve, reject) => {
            axios.get(`${process.env.REACT_APP_REST_API_URL}permissions`)
                .then(response => {
                    //only possible when request is successfull)
                    resolve(response.data.data.permissions)
                }).catch((err) => {
                    //triggered on 4XX status code
                    reject(err.response.data);
                })
        })
    }
}

/**
 * Represents User Permissions that come from the API and come with snake case property names, this class is created to transform 
 * them to camelCase properties
 */
export function Permissions(permsArray) {
    const permsObj = permsArray.reduce((prev, perm) => {
        prev[perm.slug] = true
        return prev
    }, {});

    const defaultValue = permsObj['all'] || false
    return {

        hasAllPermissions: permsObj['all'],

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

        canOptionEmailNotificationTemplates: permsObj['notification_template_email'] || defaultValue,
        canOptionSMSEditNotificationTemplates: permsObj['notification_template_sms'] || defaultValue,
        canOptionWebhookEditNotificationTemplates: permsObj['notification_template_webhook'] || defaultValue,
        canOptionAlarmEditNotificationTemplates: permsObj['notification_template_alarm'] || defaultValue,


        // FloorMap related operations permissions
        canViewFloorMaps: permsObj['floormap_view'] || defaultValue,
        canCreateFloorMaps: permsObj['floormap_create'] || defaultValue,
        canEditFloorMaps: permsObj['floormap_edit'] || defaultValue,

        // Dashboards
        canViewRoutesDashboard: permsObj['dashboard_routes'] || defaultValue,
        canViewContainerDashboard: permsObj['dashboard_containers'] || defaultValue,
        canViewDashboardLists: permsObj['dashboard_lists'] || defaultValue,
        canViewDeviceDashboardExtras: permsObj['device_dashboard_extras'] || defaultValue,

        // Location (and sublocations) related operations permissions
        canViewLocations: permsObj['locations_view'] || defaultValue,
        canCreateLocations: permsObj['locations_create'] || defaultValue,
        canEditLocations: permsObj['locations_edit'] || defaultValue,

        // Location (and sublocations) related operations permissions
        canViewSubLocations: permsObj['sub_locations_view'] || defaultValue,
        canCreateSubLocations: permsObj['sub_locations_create'] || defaultValue,
        canEditSubLocations: permsObj['sub_locations_edit'] || defaultValue,

        //Impacts
        canViewImpacts: permsObj['impacts_view'] || defaultValue,

        //Thresholds:
        canCreateThresholdTemperature: permsObj['threshold_temperaturedegree'] || defaultValue,
        canCreateThresholdHumidity: permsObj['threshold_humidityrelative'] || defaultValue,
        canCreateThresholdGeofences: permsObj['threshold_geofences'] || defaultValue,
        canCreateThresholdButtonPressed: permsObj['threshold_routes'] || defaultValue,
        canCreateThresholdMovementStatus: permsObj['threshold_movementstatus'] || defaultValue,
        canCreateThresholdAcceleration: permsObj['threshold_acceleration'] || defaultValue,
    }
}

export default permissionService