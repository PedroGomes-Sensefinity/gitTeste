import React, { Suspense, lazy } from "react";
import { useSelector } from "react-redux";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute, LayoutSplashScreen } from "../_metronic/layout";
import { ErrorPage1 } from './modules/ErrorsExamples/ErrorPage1';

const AlarmsForm = lazy(() => import("./pages/alarms/alarms-form/AlarmsForm"));
const AlarmsList = lazy(() => import('./pages/alarms/alarms-list/AlarmsList'));
const AssetsForm = lazy(() => import('./pages/assets/assets-form/AssetsForm'));
const CreateAsset = lazy(() => import('./pages/assets/assets-form/CreateAsset'));
const AssetsList = lazy(() => import('./pages/assets/assets-list/AssetsList'));
const BoardFamiliesForm = lazy(() => import('./pages/board-families/form/BoardFamiliesForm'));
const BoardFamiliesList = lazy(() => import('./pages/board-families/list/BoardFamiliesList'));
const Dashboard = lazy(() => import('./pages/dashboards/Dashboard'));
const CreateDevice = lazy(() => import('./pages/devices/device/CreateDevice'));
const Device = lazy(() => import('./pages/devices/device/Device'));
const DevicesList = lazy(() => import('./pages/devices/devices-list/DevicesList'));;
const DevicesProvision = lazy(() => import('./pages/devices/devices-provision/DevicesProvision'));
const DevicesUpload = lazy(() => import('./pages/devices/devices-upload/DevicesUpload'));
const FloorMapsForm = lazy(() => import('./pages/floor-maps/form/FloorMapsForm'));
const FloorMapsList = lazy(() => import('./pages/floor-maps/list/FloorMapsList'));
const GeofencesForm = lazy(() => import('./pages/geofences/geofences-form/GeofencesForm'));
const CreateGeofence = lazy(() => import('./pages/geofences/geofences-form/CreateGeofence'));
const GroupsForm = lazy(() => import('./pages/groups/groups-form/GroupsForm'));
const GroupsList = lazy(() => import('./pages/groups/groups-list/GroupsList'));
const News = lazy(() => import('./pages/news/News'));
const NotificationTemplatesForm = lazy(() => import('./pages/notification-templates/notifications-templates-form/NotificationTemplatesForm'));
const NotificationTemplatesList = lazy(() => import('./pages/notification-templates/notifications-templates-list/NotificationTemplatesList'));
const ProfilesForm = lazy(() => import('./pages/profiles/profiles-form/ProfilesForm'));
const ProfilesList = lazy(() => import('./pages/profiles/profiles-list/ProfilesList'));
const RoutesForm = lazy(() => import('./pages/routes/routes-form/RoutesForm'));
const RouteCompletion = lazy(() => import('./pages/routes/routes-list/RouteCompletion'));
const RoutesList = lazy(() => import('./pages/routes/routes-list/RoutesList'));
const TenantsForm = lazy(() => import('./pages/tenants/tenants-form/TenantsForm'));
const TenantsList = lazy(() => import('./pages/tenants/tenants-list/TenantsList'));
const ThresholdsForm = lazy(() => import('./pages/thresholds/thresholds-form/ThresholdsForm'));
const ThresholdsList = lazy(() => import('./pages/thresholds/thresholds-list/ThresholdsList'));
const UsersForm = lazy(() => import('./pages/users/users-form/UsersForm'));
const UsersList = lazy(() => import('./pages/users/users-list/UsersList'));
const GeofencesList = lazy(() => import('./pages/geofences/geofences-list/GeofencesList'));
const CreateThreshold = lazy(() => import('./pages/thresholds/thresholds-form/CreateThreshold'));
const LocationsList = lazy(() => import('./pages/locations/locations-list/LocationsList'));
const LocationsForm = lazy(() => import('./pages/locations/locations-form/LocationsForm'));
const SubLocationsList = lazy(() => import('./pages/locations/sublocations-list/SublocationsList'));
const SubLocationsForm = lazy(() => import('./pages/locations/sublocation-form/SubLocationsForm'));
const ImpactsList = lazy(() => import('./pages/impacts/impacts-list/ImpactsList'));
const DashboardsContainers = lazy(() => import('./pages/dashboards/containers/DashboardsContainers'));
const DashboardsRoutes = lazy(() => import('./pages/dashboards/routes/DashboardsRoutes'));
const TrackingOperation = lazy(() => import('./components/form/TrackingOperation'));
const Impacts = lazy(() => import('./pages/impacts/Impacts'));

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
          <Redirect exact from="/" to="/dashboard/default" />
        }
        {permissions.canViewContainerDashboard && [
          <ContentRoute key="/dashboard/containers" path="/dashboard/containers" component={DashboardsContainers} />,
        ]}
        {permissions.canViewRoutesDashboard && [
          <ContentRoute key="/dashboard/route" path="/dashboard/route" component={DashboardsRoutes} />,
        ]}
        <ContentRoute path="/dashboard/default" component={Dashboard} />

        { /* Devices Routes*/}
        {permissions.canViewDevices && [
          <ContentRoute key="/devices/edit/:id" path="/devices/edit/:id" component={Device} />,
          <ContentRoute key="/devices/provision" path="/devices/provision" component={DevicesProvision} />,
          <ContentRoute key="/devices/upload" path="/devices/upload" component={DevicesUpload} />,
          <ContentRoute key="/devices/new" path="/devices/new" component={CreateDevice} />,
          <ContentRoute key="/devices/list" path="/devices/list" component={DevicesList} />,
          <ContentRoute key="/devices/:id" path="/devices/:id" component={Device} />
        ]}

        { /* Board families Routes*/}
        {permissions.canViewBoardFamilies && [
          <ContentRoute key="/board-families/edit/:id" path="/board-families/edit/:id" component={BoardFamiliesForm} />,
          <ContentRoute key="/board-families/list" path="/board-families/list" component={BoardFamiliesList} />,
          <ContentRoute key="/board-families/new" path="/board-families/new" component={BoardFamiliesForm} />]
        }

        { /* Groups Routes*/}
        {permissions.canViewGroups &&
          [<ContentRoute key="/groups/edit/:id" path="/groups/edit/:id" component={GroupsForm} />,
          <ContentRoute key="/groups/list" path="/groups/list" component={GroupsList} />,
          <ContentRoute key="/groups/new" path="/groups/new" component={GroupsForm} />
          ]}

        { /* Thresholds Routes*/}
        {permissions.canViewThresholds && [
          <ContentRoute key="/thresholds/new" path="/thresholds/new" component={CreateThreshold} />,
          <ContentRoute key="/thresholds/list" path="/thresholds/list" component={ThresholdsList} />,
          <ContentRoute key="/thresholds/:id/edit" path="/thresholds/:id/edit" component={ThresholdsForm} />
        ]}

        { /* Profiles Routes*/}
        {permissions.canViewProfiles &&
          [
            <ContentRoute key="/profiles/edit/:id" path="/profiles/edit/:id" component={ProfilesForm} />,
            <ContentRoute key="/profiles/list" path="/profiles/list" component={ProfilesList} />,
            <ContentRoute key="/profiles/new" path="/profiles/new" component={ProfilesForm} />
          ]}

        { /* Assets Routes*/}
        {permissions.canViewAssets &&
          [<ContentRoute key="/assets/list" path="/assets/list" component={AssetsList} />,
          <ContentRoute key="/assets/new" path="/assets/new" component={CreateAsset} />,
          <ContentRoute key="/assets/:id" path="/assets/:id" component={AssetsForm} />,
          ]
        }
        { /* Routes Routes*/}
        {permissions.canViewRoutes && [
          <ContentRoute key="/routes/edit/:id" path="/routes/edit/:id" component={RoutesForm} />,
          <ContentRoute key="/routes/list" path="/routes/list" component={RoutesList} />,
          <ContentRoute key="/routes/new" path="/routes/new" component={RoutesForm} />,
          <ContentRoute key="/routes/completion" path="/routes/completion" component={RouteCompletion} />]
        }

        { /* Geofences Routes*/}
        {permissions.canViewGeofences && [
          <ContentRoute key="/geofences/list" path="/geofences/list" component={GeofencesList} />,
          <ContentRoute key="/geofences/new" path="/geofences/new" component={CreateGeofence} />,
          <ContentRoute key="/geofences/:id" path="/geofences/:id" component={GeofencesForm} />,]
        }

        { /* Users Routes*/}
        {permissions.canViewUsers && [
          <ContentRoute key="/users/edit/:id" path="/users/edit/:id" component={UsersForm} />,
          <ContentRoute key="/users/list" path="/users/list" component={UsersList} />,
          <ContentRoute key="/users/new" path="/users/new" component={UsersForm} />
        ]}
        { /* Tenants (as companies Routes*/}
        {permissions.canViewTenants && [
          <ContentRoute key="/tenants/edit/:id" path="/tenants/edit/:id" component={TenantsForm} />,
          <ContentRoute key="/tenants/list" path="/tenants/list" component={TenantsList} />,
          <ContentRoute key="/tenants/new" path="/tenants/new" component={TenantsForm} />
        ]}
        { /* Alarms Routes*/}
        {permissions.canViewAlarms && [
          <ContentRoute key="/alarms/edit/:id" path="/alarms/edit/:id" component={AlarmsForm} />,
          <ContentRoute key="/alarms/list" path="/alarms/list" component={AlarmsList} />,
          <ContentRoute key="/alarms/new" path="/alarms/new" component={AlarmsForm} />]
        }
        { /* NotificationTemplates Routes*/}
        {permissions.canViewNotificationTemplates && [
          <ContentRoute key="/notification-templates/edit/:id" path="/notification-templates/edit/:id" component={NotificationTemplatesForm} />,
          <ContentRoute key="/notification-templates/list" path="/notification-templates/list" component={NotificationTemplatesList} />,
          <ContentRoute key="/notification-templates/new" path="/notification-templates/new" component={NotificationTemplatesForm} />
        ]}
        { /* Floor Maps Routes*/}
        {permissions.canViewFloorMaps && [
          <ContentRoute key="/floor-maps/edit/:id" path="/floor-maps/edit/:id" component={FloorMapsForm} />,
          <ContentRoute key="/floor-maps/list" path="/floor-maps/list" component={FloorMapsList} />,
          <ContentRoute key="/floor-maps/new" path="/floor-maps/new" component={FloorMapsForm} />
        ]}
        { /* Locations Routes*/}
        {permissions.canViewLocations && [
          <ContentRoute key="/locations/edit/:id" path="/locations/edit/:id" component={LocationsForm} />,
          <ContentRoute key="/locations/list" path="/locations/list" component={LocationsList} />,
          <ContentRoute key="/locations/new" path="/locations/new" component={LocationsForm} />
        ]}
        { /* Sublocations Routes*/}
        {permissions.canViewSubLocations && [
          <ContentRoute key="/sublocations/edit/:id" path="/sublocations/edit/:id" component={SubLocationsForm} />,
          <ContentRoute key="/sublocations/list" path="/sublocations/list" component={SubLocationsList} />,
          <ContentRoute key="/sublocations/new" path="/sublocations/new" component={SubLocationsForm} />,
        ]}
        { /* what's new Page*/}
        <ContentRoute key="/whatsnew" path="/whatsnew" component={News} />,
        <ContentRoute key="/impacts" path="/impacts" component={Impacts} />,
        <ContentRoute key="/operation/tracking" path="/operation/tracking" component={TrackingOperation} />,

        <ContentRoute key="/*" path="/*" component={ErrorPage1} />,
      </Switch>
    </Suspense>
  );
}
