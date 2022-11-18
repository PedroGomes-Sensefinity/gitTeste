import React, { Suspense, useEffect } from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute, LayoutSplashScreen } from "../_metronic/layout";


import { usePermissions } from "./modules/Permission/PermissionsProvider";
import { AlarmsForm } from "./pages/alarms/alarms-form/AlarmsForm";
import { AlarmsList } from "./pages/alarms/alarms-list/AlarmsList";
import { AssetsForm } from "./pages/assets/assets-form/AssetsForm";
import { CreateAsset } from "./pages/assets/assets-form/CreateAsset";
import { AssetsList } from "./pages/assets/assets-list/AssetsList";
import { BoardFamiliesForm } from "./pages/board-families/form/BoardFamiliesForm";
import { BoardFamiliesList } from "./pages/board-families/list/BoardFamiliesList";
import { ContainersDashboard } from "./pages/dashboards/ContainersDashboard";
import { Dashboard } from "./pages/dashboards/Dashboard";
import { GeneralContainers } from "./pages/dashboards/GeneralContainers";
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
import { Impacts } from "./pages/impacts/Impacts";


/*const UserProfilepage = lazy(() =>
  import("./modules/UserProfile/UserProfilePage")
);*/


export default function BasePage() {
  // useEffect(() => {
  //   console.log('Base page');
  // }, []) // [] - is required if you need only one call
  // https://reactjs.org/docs/hooks-reference.html#useeffect



  const { permissions } = usePermissions()
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          /* Redirect from root URL to /dashboard. */
          <Redirect exact from="/" to="/dashboard/default" />
        }
        {permissions.canViewContainerDashboard && [
          <ContentRoute key="/dashboard/containers" path="/dashboard/containers" component={ContainersDashboard} />,
          <ContentRoute key="/dashboard/containers/general" path="/dashboard/general/containers" component={GeneralContainers} />
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
          <ContentRoute key="/assets/:id" path="/assets/:id" component={AssetsForm} />
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
          <ContentRoute key="/geofences/edit/:id" path="/geofences/edit/:id" component={GeofencesForm} />,
          <ContentRoute key="/geofences/list" path="/geofences/list" component={GeofencesList} />,
          <ContentRoute key="/geofences/new" path="/geofences/new" component={GeofencesForm} />]
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
        {permissions.canViewLocations && [          
          <ContentRoute key="/sublocations/edit/:id" path="/sublocations/edit/:id" component={SubLocationsForm} />,
          <ContentRoute key="/sublocations/list" path="/sublocations/list" component={SubLocationsList} />,
          <ContentRoute key="/sublocations/new" path="/sublocations/new" component={SubLocationsForm} />
        ]}
        { /* what's new Page*/}
        <ContentRoute key="/whatsnew" path="/whatsnew" component={News} />

        <ContentRoute key="/impacts" path="/impacts" component={Impacts} />,


        <Redirect to="/error/error-v1" />
      </Switch>
    </Suspense>
  );
}
