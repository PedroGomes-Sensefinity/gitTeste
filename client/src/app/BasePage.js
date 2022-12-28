import React, { Suspense } from "react";
import { useSelector } from "react-redux";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute, LayoutSplashScreen } from "../_metronic/layout";
import { AlarmsForm } from "./pages/alarms/alarms-form/AlarmsForm";
import { AlarmsList } from "./pages/alarms/alarms-list/AlarmsList";
import { AssetsForm } from "./pages/assets/assets-form/AssetsForm";
import { CreateAsset } from "./pages/assets/assets-form/CreateAsset";
import { AssetsList } from "./pages/assets/assets-list/AssetsList";
import { BoardFamiliesForm } from "./pages/board-families/form/BoardFamiliesForm";
import { BoardFamiliesList } from "./pages/board-families/list/BoardFamiliesList";
import { Dashboard } from "./pages/dashboards/Dashboard";
import { CreateDevice } from "./pages/devices/device/CreateDevice";
import { Device } from "./pages/devices/device/Device";
import { DevicesList } from "./pages/devices/devices-list/DevicesList";
import { DevicesProvision } from "./pages/devices/devices-provision/DevicesProvision";
import { DevicesUpload } from "./pages/devices/devices-upload/DevicesUpload";
import { FloorMapsForm } from "./pages/floor-maps/form/FloorMapsForm";
import { FloorMapsList } from "./pages/floor-maps/list/FloorMapsList";
import { GeofencesForm } from "./pages/geofences/geofences-form/GeofencesForm";
import { GroupsForm } from "./pages/groups/groups-form/GroupsForm";
import { GroupsList } from "./pages/groups/groups-list/GroupsList";
import { News } from "./pages/news/News";
import { NotificationTemplatesForm } from "./pages/notification-templates/notifications-templates-form/NotificationTemplatesForm";
import { NotificationTemplatesList } from "./pages/notification-templates/notifications-templates-list/NotificationTemplatesList";
import { ProfilesForm } from "./pages/profiles/profiles-form/ProfilesForm";
import { ProfilesList } from "./pages/profiles/profiles-list/ProfilesList";
import { RoutesForm } from "./pages/routes/routes-form/RoutesForm";
import { RouteCompletion } from "./pages/routes/routes-list/RouteCompletion";
import { RoutesList } from "./pages/routes/routes-list/RoutesList";
import { TenantsForm } from "./pages/tenants/tenants-form/TenantsForm";
import { TenantsList } from "./pages/tenants/tenants-list/TenantsList";
import { ThresholdsForm } from "./pages/thresholds/thresholds-form/ThresholdsForm";
import { ThresholdsList } from "./pages/thresholds/thresholds-list/ThresholdsList";
import { UsersForm } from "./pages/users/users-form/UsersForm";
import { UsersList } from "./pages/users/users-list/UsersList";
import { GeofencesList } from "./pages/geofences/geofences-list/GeofencesList";
import { CreateThreshold } from "./pages/thresholds/thresholds-form/CreateThreshold";
import { LocationsList } from "./pages/locations/locations-list/LocationsList";
import { LocationsForm } from "./pages/locations/locations-form/LocationsForm";
import { SubLocationsList } from "./pages/locations/sublocations-list/SublocationsList";
import { SubLocationsForm } from "./pages/locations/sublocation-form/SubLocationsForm";
import { ErrorPage1 } from "./modules/ErrorsExamples/ErrorPage1";
import { Impacts } from "./pages/impacts/Impacts";
import { DashboardsContainers } from "./pages/dashboards/containers/DashboardsContainers";
import { DashboardsRoutes } from "./pages/dashboards/routes/DashboardsRoutes";
import TrackingOperation from "./components/form/TrackingOperation";
import templates from "./utils/links";



/*const UserProfilepage = lazy(() =>
  import("./modules/UserProfile/UserProfilePage")
);*/


export default function BasePage() {
  // useEffect(() => {
  //   console.log('Base page');
  // }, []) // [] - is required if you need only one call
  // https://reactjs.org/docs/hooks-reference.html#useeffect

  const { permissions } = useSelector(({ auth }) => ({ permissions: auth.permissions }))
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          /* Redirect from root URL to /dashboard. */
          <Redirect exact from="/" to={templates.dashboardDefault.templateString} />
        }
        {permissions.canViewContainerDashboard && [
          <ContentRoute key={templates.dashboardsContainers.templateString} path={templates.dashboardsContainers.templateString} component={DashboardsContainers} />,
        ]}
        {permissions.canViewRoutesDashboard && [
          <ContentRoute key={templates.dashboardsRoutes.templateString} path={templates.dashboardsRoutes.templateString} component={DashboardsRoutes} />,
        ]}
        <ContentRoute path={templates.dashboardDefault.templateString} component={Dashboard} />

        { /* Devices Routes*/}
        {permissions.canViewDevices && [
          <ContentRoute key={templates.deviceEdit.templateString} path={templates.deviceEdit.templateString} component={Device} />,
          <ContentRoute key={templates.deviceProvision.templateString} path={templates.deviceProvision.templateString} component={DevicesProvision} />,
          <ContentRoute key={templates.deviceUpload.templateString} path={templates.deviceUpload.templateString} component={DevicesUpload} />,
          <ContentRoute key={templates.deviceCreate.templateString} path={templates.deviceCreate.templateString} component={CreateDevice} />,
          <ContentRoute key={templates.deviceList.templateString} path={templates.deviceList.templateString} component={DevicesList} />,
          <ContentRoute key={templates.deviceEdit.templateString} path={templates.deviceEdit.templateString} component={Device} />
        ]}

        { /* Board families Routes*/}
        {permissions.canViewBoardFamilies && [
          <ContentRoute key={templates.boardFamilyEdit.templateString} path={templates.boardFamilyEdit.templateString} component={BoardFamiliesForm} />,
          <ContentRoute key={templates.boardFamilyList.templateString} path={templates.boardFamilyList.templateString} component={BoardFamiliesList} />,
          <ContentRoute key={templates.boardFamilyCreate.templateString} path={templates.boardFamilyCreate.templateString} component={BoardFamiliesForm} />]
        }

        { /* Groups Routes*/}
        {permissions.canViewGroups &&
          [<ContentRoute key={templates.groupEdit.templateString} path={templates.groupEdit.templateString} component={GroupsForm} />,
          <ContentRoute key={templates.groupList.templateString} path={templates.groupList.templateString} component={GroupsList} />,
          <ContentRoute key={templates.groupCreate.templateString} path={templates.groupCreate.templateString} component={GroupsForm} />
          ]}

        { /* Thresholds Routes*/}
        {permissions.canViewThresholds && [
          <ContentRoute key={templates.thresholdsCreate.templateString} path={templates.thresholdsCreate.templateString} component={CreateThreshold} />,
          <ContentRoute key={templates.thresholdsList.templateString} path={templates.thresholdsList.templateString} component={ThresholdsList} />,
          <ContentRoute key={templates.thresholdsEdit.templateString} path={templates.thresholdsEdit.templateString} component={ThresholdsForm} />
        ]}

        { /* Profiles Routes*/}
        {permissions.canViewProfiles &&
          [
            <ContentRoute key={templates.profilesList.templateString} path={templates.profilesList.templateString} component={ProfilesList} />,
            <ContentRoute key={templates.profilesCreate.templateString} path={templates.profilesCreate.templateString} component={ProfilesForm} />,
            <ContentRoute key={templates.profilesEdit.templateString} path={templates.profilesEdit.templateString} component={ProfilesForm} />,

          ]}

        { /* Assets Routes*/}
        {permissions.canViewAssets &&
          [<ContentRoute key={templates.assetsList.templateString} path={templates.assetsList.templateString} component={AssetsList} />,
          <ContentRoute key={templates.assetsCreate.templateString} path={templates.assetsCreate.templateString} component={CreateAsset} />,
          <ContentRoute key={templates.assetsEdit.templateString} path={templates.assetsEdit.templateString} component={AssetsForm} />,
          ]
        }
        { /* Routes Routes*/}
        {permissions.canViewRoutes && [
          <ContentRoute key={templates.routesList.templateString} path={templates.routesList.templateString} component={RoutesList} />,
          <ContentRoute key={templates.routesCreate.templateString} path={templates.routesCreate.templateString} component={RoutesForm} />,
          <ContentRoute key={templates.routesCompletion.templateString} path={templates.routesCompletion.templateString} component={RouteCompletion} />,
          <ContentRoute key={templates.routesEdit.templateString} path={templates.routesEdit.templateString} component={RoutesForm} />,
        ]
        }

        { /* Geofences Routes*/}
        {permissions.canViewGeofences && [
          <ContentRoute key={templates.geofencesList.templateString} path={templates.geofencesList.templateString} component={GeofencesList} />,
          <ContentRoute key={templates.geofencesCreate.templateString} path={templates.geofencesCreate.templateString} component={GeofencesForm} />,
          <ContentRoute key={templates.geofencesEdit.templateString} path={templates.geofencesEdit.templateString} component={GeofencesForm} />,
        ]
        }

        { /* Users Routes*/}
        {permissions.canViewUsers && [
          <ContentRoute key={templates.usersList.templateString} path={templates.usersList.templateString} component={UsersList} />,
          <ContentRoute key={templates.usersCreate.templateString} path={templates.usersCreate.templateString} component={UsersForm} />,
          <ContentRoute key={templates.usersEdit.templateString} path={templates.usersEdit.templateString} component={UsersForm} />,
        ]}
        { /* Tenants (as companies Routes*/}
        {permissions.canViewTenants && [
          <ContentRoute key={templates.tenantsList.templateString} path={templates.tenantsList.templateString} component={TenantsList} />,
          <ContentRoute key={templates.tenantsCreate.templateString} path={templates.tenantsCreate.templateString} component={TenantsForm} />,
          <ContentRoute key={templates.tenantsEdit.templateString} path={templates.tenantsEdit.templateString} component={TenantsForm} />,

        ]}
        { /* Alarms Routes*/}
        {permissions.canViewAlarms && [
          <ContentRoute key={templates.alarmsList.templateString} path={templates.alarmsList.templateString} component={AlarmsList} />,
          <ContentRoute key={templates.alarmsCreate.templateString} path={templates.alarmsCreate.templateString} component={AlarmsForm} />,
          <ContentRoute key={templates.alarmsEdit.templateString} path={templates.alarmsEdit.templateString} component={AlarmsForm} />,
        ]
        }
        { /* NotificationTemplates Routes*/}
        {permissions.canViewNotificationTemplates && [
          <ContentRoute key={templates.notificationTemplatesList.templateString} path={templates.notificationTemplatesList.templateString} component={NotificationTemplatesList} />,
          <ContentRoute key={templates.notificationTemplatesCreate.templateString} path={templates.notificationTemplatesCreate.templateString} component={NotificationTemplatesForm} />,
          <ContentRoute key={templates.notificationTemplatesEdit.templateString} path={templates.notificationTemplatesEdit.templateString} component={NotificationTemplatesForm} />,

        ]}
        { /* Floor Maps Routes*/}
        {permissions.canViewFloorMaps && [
          <ContentRoute key={templates.floorMapsList.templateString} path={templates.floorMapsList.templateString} component={FloorMapsList} />,
          <ContentRoute key={templates.floorMapsCreate.templateString} path={templates.floorMapsCreate.templateString} component={FloorMapsForm} />,
          <ContentRoute key={templates.floorMapsEdit.templateString} path={templates.floorMapsEdit.templateString} component={FloorMapsForm} />,
        ]}
        { /* Locations Routes*/}
        {permissions.canViewLocations && [
          <ContentRoute key={templates.locationsList.templateString} path={templates.locationsList.templateString} component={LocationsList} />,
          <ContentRoute key={templates.locationsCreate.templateString} path={templates.locationsCreate.templateString} component={LocationsForm} />,           <ContentRoute key={templates.locationsEdit.templateString} path={templates.locationsEdit.templateString} component={LocationsForm} />,
          <ContentRoute key={templates.locationsEdit.templateString} path={templates.locationsEdit.templateString} component={LocationsForm} />,
        ]}
        { /* Sublocations Routes*/}
        {permissions.canViewSubLocations && [
          <ContentRoute key={templates.subLocationsList.templateString} path={templates.subLocationsList.templateString} component={SubLocationsList} />,
          <ContentRoute key={templates.subLocationsCreate.templateString} path={templates.subLocationsCreate.templateString} component={SubLocationsForm} />,
          <ContentRoute key={templates.subLocationsEdit.templateString} path={templates.subLocationsEdit.templateString} component={SubLocationsForm} />,
        ]}
        { /* what's new Page*/}
        <ContentRoute key={templates.whatsNew.templateString} path={templates.whatsNew.templateString} component={News} />,
        <ContentRoute key={templates.impacts.templateString} path={templates.impacts.templateString} component={Impacts} />,
        <ContentRoute key={templates.operationTracking.templateString} path={templates.operationTracking.templateString} component={TrackingOperation} />,

        <ContentRoute key="/*" path="/*" component={ErrorPage1} />,
      </Switch>
    </Suspense>
  );
}
