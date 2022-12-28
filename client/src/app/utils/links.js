import { parseTemplate } from 'url-template';



const templates = {
    dashboardDefault: {
        templateString: '/dashboard/default',
        templateObj: parseTemplate('/dashboard/default')
    },
    dashboardsContainers: {
        templateString: '/dashboard/containers',
        templateObj: parseTemplate('/dashboard/containers')
    },
    dashboardsRoutes: {
        templateString: '/dashboard/route',
        templateObj: parseTemplate('/dashboard/route')
    },
    deviceEdit: {
        templateString: '/devices/:id/edit',
        templateObj: parseTemplate('/devices/{id}/edit')
    },
    deviceList: {
        templateString: '/devices/list',
        templateObj: parseTemplate('/devices/list')
    },
    deviceProvision: {
        templateString: '/devices/provision',
        templateObj: parseTemplate('/devices/provision')
    },
    deviceUpload: {
        templateString: '/devices/upload',
        templateObj: parseTemplate('/devices/upload')
    },
    deviceView: {
        templateString: '/devices/:id',
        templateObj: parseTemplate('/devices/{id}')
    },
    deviceCreate: {
        templateString: '/devices/new',
        templateObj: parseTemplate('/devices/new')
    },
    boardFamilyEdit: {
        templateString: "/board-families/edit/:id",
        templateObj: parseTemplate("/board-families/edit/{id}")
    },
    boardFamilyList: {
        templateString: "/board-families/list",
        templateObj: parseTemplate("/board-families/list")
    },
    boardFamilyCreate: {
        templateString: "/board-families/new",
        templateObj: parseTemplate("/board-families/new")
    },
    groupEdit: {
        templateString: "/groups/edit/:id",
        templateObj: parseTemplate("/groups/edit/{id}")

    },
    groupList: {
        templateString: "/groups/list",
        templateObj: parseTemplate("/groups/list")

    },
    groupCreate: {
        templateString: "/groups/new",
        templateObj: parseTemplate("/groups/new")

    },
    thresholdsEdit: {
        templateString: "/thresholds/:id",
        templateObj: parseTemplate("/thresholds/{id}")

    }, thresholdsDevices: {
        templateString: "/thresholds/:id/devices",
        templateObj: parseTemplate("/thresholds/{id}/devices")

    }, thresholdsActions: {
        templateString: "/thresholds/:id/actions",
        templateObj: parseTemplate("/thresholds/{id}/actions")

    }, thresholdsGroups: {
        templateString: "/thresholds/:id/groups",
        templateObj: parseTemplate("/thresholds/{id}/groups")

    },
    thresholdsList: {
        templateString: "/thresholds/list",
        templateObj: parseTemplate("/thresholds/list")

    },
    thresholdsCreate: {
        templateString: "/thresholds/new",
        templateObj: parseTemplate("/thresholds/new")

    },
    profilesEdit: {
        templateString: "/profiles/:id",
        templateObj: parseTemplate("/profiles/{id}")

    },
    profilesList: {
        templateString: "/profiles/list",
        templateObj: parseTemplate("/profiles/list")

    },
    profilesCreate: {
        templateString: "/profiles/new",
        templateObj: parseTemplate("/profiles/new")

    },
    assetsEdit: {
        templateString: "/assets/:id",
        templateObj: parseTemplate("/assets/{id}")

    },
    assetsDashboard: {
        templateString: "/assets/:id/dashboard",
        templateObj: parseTemplate("/assets/{id}/dashboard")

    }, assetsDevices: {
        templateString: "/assets/:id/devices",
        templateObj: parseTemplate("/assets/{id}/devices")

    }, assetsExtraFields: {
        templateString: "/assets/:id/extra-fields",
        templateObj: parseTemplate("/assets/{id}/extra-fields")

    },
    assetsList: {
        templateString: "/assets/list",
        templateObj: parseTemplate("/assets/list")

    },
    assetsCreate: {
        templateString: "/assets/new",
        templateObj: parseTemplate("/assets/new")

    }, routesEdit: {
        templateString: "/routes/:id",
        templateObj: parseTemplate("/routes/{id}")

    },
    routesList: {
        templateString: "/routes/list",
        templateObj: parseTemplate("/routes/list")

    },
    routesCreate: {
        templateString: "/routes/new",
        templateObj: parseTemplate("/routes/new")

    }, routesCompletion: {
        templateString: "/routes/completion",
        templateObj: parseTemplate("/routes/completion")

    }, geofencesEdit: {
        templateString: "/geofences/:id",
        templateObj: parseTemplate("/geofences/{id}")

    },
    geofencesList: {
        templateString: "/geofences/list",
        templateObj: parseTemplate("/geofences/list")

    },
    geofencesCreate: {
        templateString: "/geofences/new",
        templateObj: parseTemplate("/geofences/new")

    }, usersEdit: {
        templateString: "/users/:id",
        templateObj: parseTemplate("/users/{id}")

    },
    usersList: {
        templateString: "/users/list",
        templateObj: parseTemplate("/users/list")

    },
    usersCreate: {
        templateString: "/users/new",
        templateObj: parseTemplate("/users/new")

    },
    tenantsEdit: {
        templateString: "/tenants/:id",
        templateObj: parseTemplate("/tenants/{id}")

    }, tenantsPersonalization: {
        templateString: "/tenants/:id/personalization",
        templateObj: parseTemplate("/tenants/{id}/personalization")

    },
    tenantsList: {
        templateString: "/tenants/list",
        templateObj: parseTemplate("/tenants/list")

    },
    tenantsCreate: {
        templateString: "/tenants/new",
        templateObj: parseTemplate("/tenants/new")

    },
    alarmsEdit: {
        templateString: "/alarms/:id",
        templateObj: parseTemplate("/alarms/{id}")

    },
    alarmsList: {
        templateString: "/alarms/list",
        templateObj: parseTemplate("/alarms/list")

    },
    alarmsCreate: {
        templateString: "/alarms/new",
        templateObj: parseTemplate("/alarms/new")

    },
    notificationTemplatesEdit: {
        templateString: "/notification-templates/:id",
        templateObj: parseTemplate("/notification-templates/{id}")

    },
    notificationTemplatesList: {
        templateString: "/notification-templates/list",
        templateObj: parseTemplate("/notification-templates/list")

    },
    notificationTemplatesCreate: {
        templateString: "/notification-templates/new",
        templateObj: parseTemplate("/notification-templates/new")

    },
    floorMapsEdit: {
        templateString: "/floor-maps/:id",
        templateObj: parseTemplate("/floor-maps/{id}")

    },
    floorMapsList: {
        templateString: "/floor-maps/list",
        templateObj: parseTemplate("/floor-maps/list")

    },
    floorMapsCreate: {
        templateString: "/floor-maps/new",
        templateObj: parseTemplate("/floor-maps/new")
    },
    locationsEdit: {
        templateString: "/locations/:id",
        templateObj: parseTemplate("/locations/{id}")

    },
    locationsList: {
        templateString: "/locations/list",
        templateObj: parseTemplate("/locations/list")

    },
    locationsCreate: {
        templateString: "/locations/new",
        templateObj: parseTemplate("/locations/new")
    },
    subLocationsEdit: {
        templateString: "/sublocations/:id",
        templateObj: parseTemplate("/sublocations/{id}")

    },
    subLocationsList: {
        templateString: "/sublocations/list",
        templateObj: parseTemplate("/sublocations/list")

    },
    subLocationsCreate: {
        templateString: "/sublocations/new",
        templateObj: parseTemplate("/sublocations/new")
    },
    whatsNew: {
        templateString: "/whatsnew",
        templateObj: parseTemplate("/whatsnew")

    },
    impacts: {
        templateString: "/impacts",
        templateObj: parseTemplate("/impacts")

    },
    operationTracking: {
        templateString: "/operation/tracking",
        templateObj: parseTemplate("/operation/tracking")
    },

}

export default templates
