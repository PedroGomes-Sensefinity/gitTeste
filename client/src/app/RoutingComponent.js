/**
 * High level router.
 *
 * Note: It's recommended to compose related routes in internal router
 * components (e.g: `src/app/modules/Auth/pages/AuthPage`, `src/app/BasePage`).
 */

import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import AssetDevicesComponent from "./components/form/AssetDevicesComponent";
import AssetFormExtraFields from "./components/form/AssetFormExtraFields";
import AssetsFormComponent from "./components/form/AssetsFormComponent";
import BoardFamiliesFormComponent from "./components/form/BoardFamiliesFormComponent";
import BoardFamilyTemplatesComponent from "./components/form/BoardFamilyTemplatesComponent";
import DeviceConfigMessageComponent from "./components/form/DeviceConfigMessageComponent";
import DeviceDashboard from "./components/form/DeviceDashboard";
import DeviceFormComponent from "./components/form/DeviceFormComponent";
import DeviceThresholdComponent from "./components/form/DeviceThresholdComponent";
import FloorMapAnchorsFormComponent from "./components/form/FloorMapAnchorsFormComponent";
import FloorMapFormComponent from "./components/form/FloorMapFormComponent";
import FloorMapMapFormComponent from "./components/form/FloorMapMapFormComponent";
import RoutesFormComponent from "./components/form/RoutesFormComponent";
import RoutesMapComponent from "./components/form/RoutesMapComponent";
import TenantsComponent from "./components/form/TenantsComponent";
import TenantsPersonalizationComponent from "./components/form/TenantsPersonalizationComponent";
import ThresholdActionComponent from "./components/form/ThresholdActionComponent";
import ThresholdDevicesComponent from "./components/form/ThresholdDevicesComponent";
import ThresholdFormComponent from "./components/form/ThresholdFormComponent";
import ThresholdGroupsComponent from "./components/form/ThresholdGroupsComponent";
import TrackingOperation from "./components/form/TrackingOperation";
import { AuthPage } from "./modules/Auth/pages/AuthPage";
import ForgotPassword from "./modules/Auth/pages/ForgotPassword";
import Login from "./modules/Auth/pages/Login";
import Logout from "./modules/Auth/pages/Logout";
import RecoverPassword from "./modules/Auth/pages/RecoverPassword";
import { ErrorPage1 } from './modules/ErrorsExamples/ErrorPage1';
import { ErrorPage2 } from './modules/ErrorsExamples/ErrorPage2';
import { ErrorPage4 } from './modules/ErrorsExamples/ErrorPage4';
import { ErrorPage5 } from './modules/ErrorsExamples/ErrorPage5';
import { ErrorPage6 } from './modules/ErrorsExamples/ErrorPage6';
import { UnderDevelopmentPage } from './modules/ErrorsExamples/UnderDevelopmentPage';
import { AlarmsPage } from "./pages/alarms/alarms-form/AlarmsPage";
import { AlarmsList } from "./pages/alarms/alarms-list/AlarmsList";
import { AssetDetailPage } from "./pages/assets/assets-form/AssetsDetailPage";
import { CreateAssetPage } from "./pages/assets/assets-form/CreateAssetPage";
import DeviceSelector from "./pages/assets/assets-form/DeviceSelector";
import { AssetsList } from "./pages/assets/assets-list/AssetsList";
import { BoardFamilyDetailPage } from "./pages/board-families/form/BoardFamilyDetailPage";
import { CreateBoardFamilyPage } from "./pages/board-families/form/CreateBoardFamiliesPage";
import { BoardFamiliesList } from "./pages/board-families/list/BoardFamiliesList";
import { DashboardsContainers } from "./pages/dashboards/containers/DashboardsContainers";
import { Dashboard } from "./pages/dashboards/Dashboard";
import { DashboardsRoutes } from "./pages/dashboards/routes/DashboardsRoutes";
import { CreateDevicePage } from "./pages/devices/device/CreateDevicePage";
import { DeviceDetailPage } from "./pages/devices/device/DeviceDetailPage";
import { DevicesList } from "./pages/devices/devices-list/DevicesList";
import { DevicesProvision } from "./pages/devices/devices-provision/DevicesProvision";
import { DevicesUpload } from "./pages/devices/devices-upload/DevicesUpload";
import { CreateFloorMapForm } from "./pages/floor-maps/form/CreateFloorMapForm";
import { FloorMapDetailPage } from "./pages/floor-maps/form/FloorMapDetailPage";
import { FloorMapsList } from "./pages/floor-maps/list/FloorMapsList";
import { GeofencesDetailPage } from "./pages/geofences/geofences-form/GeofencesDetailPage";
import { GeofencesList } from "./pages/geofences/geofences-list/GeofencesList";
import { GroupDetailPage } from "./pages/groups/groups-form/GroupDetailPage";
import { GroupsList } from "./pages/groups/groups-list/GroupsList";
import { Impacts } from "./pages/impacts/Impacts";
import { LocationDetailPage } from "./pages/locations/locations-form/LocationDetailPage";
import { LocationsList } from "./pages/locations/locations-list/LocationsList";
import { SubLocationsDetailPage } from "./pages/locations/sublocation-form/SubLocationsDetailPage";
import { SubLocationsList } from "./pages/locations/sublocations-list/SublocationsList";
import { News } from "./pages/news/News";
import { NotificationTemplatesPage } from "./pages/notification-templates/notifications-templates-form/NotificationTemplatesPage";
import { NotificationTemplatesList } from "./pages/notification-templates/notifications-templates-list/NotificationTemplatesList";
import { ProfilesPage } from "./pages/profiles/profiles-form/ProfilesPage";
import { ProfilesList } from "./pages/profiles/profiles-list/ProfilesList";
import { CreateRoutePage } from "./pages/routes/routes-form/CreateRouteForm";
import { RoutesPage } from "./pages/routes/routes-form/RoutePage";
import { RouteCompletionPage } from "./pages/routes/routes-list/RouteCompletionPage";
import { RoutesList } from "./pages/routes/routes-list/RoutesList";
import { CreateTenantPage } from "./pages/tenants/tenants-form/CreateTenantPage";
import { TenantsPage } from "./pages/tenants/tenants-form/TenantsPage";
import { TenantsList } from "./pages/tenants/tenants-list/TenantsList";
import { CreateThresholdPage } from "./pages/thresholds/thresholds-form/CreateThresholdPage";
import { ThresholdsPage } from "./pages/thresholds/thresholds-form/ThresholdsPage";
import { ThresholdsList } from "./pages/thresholds/thresholds-list/ThresholdsList";
import { UsersPage } from "./pages/users/users-form/UsersPage";
import { UsersList } from "./pages/users/users-list/UsersList";
import templates from "./utils/links";

export function RoutingComponent() {
  const { isAuthorized } = useSelector(
    ({ auth }) => ({
      isAuthorized: auth.user != null
    }), shallowEqual
  );

  return (
    <Routes>
      <Route path="*" element={<Navigate to={templates.notFound} />} />
      <Route path="/auth/" element={!isAuthorized ? <AuthPage /> : <Navigate to="/" />}>
        <Route path="login" element={<Login />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="password-recover/:id" element={<RecoverPassword />} />
      </Route>
      <Route path={templates.logout} element={<Logout />} />
      <Route path="/error">
        <Route path={templates.notFound} element={<ErrorPage1 />} />
        <Route path="error-v2" element={<ErrorPage2 />} />
        <Route path="error-v3" element={<UnderDevelopmentPage />} />
        <Route path="error-v4" element={<ErrorPage4 />} />
        <Route path="error-v5" element={<ErrorPage5 />} />
        <Route path="error-v6" element={<ErrorPage6 />} />
      </Route>

      { /* Redirect from root URL to /dashboard. */}
      < Route path="/" element={
        <Navigate exact from="/" to={templates.dashboardDefault} />
      } />

      <Route key={templates.dashboardsContainers} path={templates.dashboardsContainers} element={<DashboardsContainers />} />,
      <Route key={templates.dashboardsRoutes} path={templates.dashboardsRoutes} element={<DashboardsRoutes />} />,
      <Route path={templates.dashboardDefault} element={<Dashboard />} />

      { /* Devices Routes*/}
      <Route key={templates.deviceProvision} path={templates.deviceProvision} element={<DevicesProvision />} />,
      <Route key={templates.deviceUpload} path={templates.deviceUpload} element={<DevicesUpload />} />,
      <Route key={templates.deviceCreate} path={templates.deviceCreate} element={<CreateDevicePage />} />,
      <Route key={templates.deviceList} path={templates.deviceList} element={<DevicesList />} />,
      <Route key={templates.deviceDetail} path={templates.deviceDetail} element={<DeviceDetailPage />}>
        <Route path={templates.deviceDashboard} element={<DeviceDashboard />} />
        <Route path={templates.deviceDetail} element={<DeviceFormComponent />} />
        <Route path={templates.deviceThresholds} element={<DeviceThresholdComponent />} />
        <Route path={templates.deviceConfigurations} element={<DeviceConfigMessageComponent />} ></Route>
      </Route>


      { /* Board families Routes*/}
      <Route key={templates.boardFamilyList} path={templates.boardFamilyList} element={<BoardFamiliesList />} />,
      <Route key={templates.boardFamilyCreate} path={templates.boardFamilyCreate} element={<CreateBoardFamilyPage />} />,
      <Route key={templates.boardFamilyDetail} path={templates.boardFamilyDetail} element={<BoardFamilyDetailPage />}>
        <Route path={templates.boardFamilyEdit} element={<BoardFamiliesFormComponent />}></Route>
        <Route path={templates.boardFamilyTemplates} element={<BoardFamilyTemplatesComponent />}></Route>
      </Route>

      { /* Groups Routes*/}
      <Route key={templates.groupEdit} path={templates.groupEdit} element={<GroupDetailPage />} />,
      <Route key={templates.groupList} path={templates.groupList} element={<GroupsList />} />,
      <Route key={templates.groupCreate} path={templates.groupCreate} element={<GroupDetailPage />} />


      { /* Thresholds Routes*/}
      <Route key={templates.thresholdsCreate} path={templates.thresholdsCreate} element={<CreateThresholdPage />} />,
      <Route key={templates.thresholdsList} path={templates.thresholdsList} element={<ThresholdsList />} />,
      <Route key={templates.thresholdsEdit} path={templates.thresholdsEdit} element={<ThresholdsPage />}>
        <Route path={templates.thresholdsActions} element={<ThresholdActionComponent />} />
        <Route path={templates.thresholdsDevices} element={<ThresholdDevicesComponent />} />
        <Route path={templates.thresholdsGroups} element={<ThresholdGroupsComponent />} />
        <Route path={templates.thresholdsEdit} element={<ThresholdFormComponent />} />
      </Route>

      { /* Profiles Routes*/}
      <Route key={templates.profilesList} path={templates.profilesList} element={<ProfilesList />} />,
      <Route key={templates.profilesCreate} path={templates.profilesCreate} element={<ProfilesPage />} />,
      <Route key={templates.profilesEdit} path={templates.profilesEdit} element={<ProfilesPage />} />,

      { /* Assets Routes*/}
      <Route key={templates.assetsList} path={templates.assetsList} element={<AssetsList />} />,
      <Route key={templates.assetsCreate} path={templates.assetsCreate} element={<CreateAssetPage />} />,
      <Route key={templates.assetsEdit} path={templates.assetsEdit} element={<AssetDetailPage />}>
        <Route exact path={templates.assetsDashboard} element={<DeviceSelector />} />
        <Route index path={templates.assetsDevices} element={<AssetDevicesComponent />} />
        <Route path={templates.assetsExtraFields} element={<AssetFormExtraFields />} />
        <Route path={templates.assetsEdit} element={<AssetsFormComponent />} />
      </Route >,

      { /* Routes Routes*/}
      <Route key={templates.routesList} path={templates.routesList} element={<RoutesList />} />,
      <Route key={templates.routesCreate} path={templates.routesCreate} element={<CreateRoutePage />} />,
      <Route key={templates.routesCompletion} path={templates.routesCompletion} element={<RouteCompletionPage />} />,
      <Route key={templates.routesEdit} path={templates.routesEdit} element={<RoutesPage />}>
        <Route key={templates.routesMap} path={templates.routesMap} element={<RoutesMapComponent />} />,
        <Route key={templates.routesEdit} path={templates.routesEdit} element={<RoutesFormComponent />} />
      </Route >

      { /* Geofences Routes*/}
      <Route key={templates.geofencesList} path={templates.geofencesList} element={<GeofencesList />} />,
      <Route key={templates.geofencesCreate} path={templates.geofencesCreate} element={<GeofencesDetailPage />} />,
      <Route key={templates.geofencesEdit} path={templates.geofencesEdit} element={<GeofencesDetailPage />} />,


      { /* Users Routes*/}
      <Route key={templates.usersList} path={templates.usersList} element={<UsersList />} />,
      <Route key={templates.usersCreate} path={templates.usersCreate} element={<UsersPage />} />,
      <Route key={templates.usersEdit} path={templates.usersEdit} element={<UsersPage />} />,

      { /* Tenants (as companies Routes*/}
      <Route key={templates.tenantsList} path={templates.tenantsList} element={<TenantsList />} />,
      <Route key={templates.tenantsCreate} path={templates.tenantsCreate} element={<CreateTenantPage />} />,
      <Route key={templates.tenantsEdit} path={templates.tenantsEdit} element={<TenantsPage />}>
        <Route path={templates.tenantsPersonalization} element={<TenantsPersonalizationComponent />} />
        <Route path={templates.tenantsEdit} element={<TenantsComponent />} />
      </Route>

      { /* Alarms Routes*/}
      <Route key={templates.alarmsList} path={templates.alarmsList} element={<AlarmsList />} />,
      <Route key={templates.alarmsCreate} path={templates.alarmsCreate} element={<AlarmsPage />} />,
      <Route key={templates.alarmsEdit} path={templates.alarmsEdit} element={<AlarmsPage />} />,

      { /* NotificationTemplates Routes*/}
      <Route key={templates.notificationTemplatesList} path={templates.notificationTemplatesList} element={<NotificationTemplatesList />} />,
      <Route key={templates.notificationTemplatesCreate} path={templates.notificationTemplatesCreate} element={<NotificationTemplatesPage />} />,
      <Route key={templates.notificationTemplatesEdit} path={templates.notificationTemplatesEdit} element={<NotificationTemplatesPage />} />,

      { /* Floor Maps Routes*/}
      <Route key={templates.floorMapsList} path={templates.floorMapsList} element={<FloorMapsList />} />,
      <Route key={templates.floorMapsCreate} path={templates.floorMapsCreate} element={<CreateFloorMapForm />} />,
      <Route key={templates.floorMapsEdit} path={templates.floorMapsEdit} element={<FloorMapDetailPage />}>
        <Route key={templates.floorMapsMap} path={templates.floorMapsMap} element={<FloorMapMapFormComponent />} />
        <Route key={templates.floorMapsAnchors} path={templates.floorMapsAnchors} element={<FloorMapAnchorsFormComponent />} />
        <Route key={templates.floorMapsEdit} path={templates.floorMapsEdit} element={<FloorMapFormComponent />} />
      </Route>,

      { /* Locations Routes*/}

      <Route key={templates.locationsList} path={templates.locationsList} element={<LocationsList />} />,
      <Route key={templates.locationsCreate} path={templates.locationsCreate} element={<LocationDetailPage />} />,
      <Route key={templates.locationsEdit} path={templates.locationsEdit} element={<LocationDetailPage />} />,

      { /* Sublocations Routes*/}

      <Route key={templates.subLocationsList} path={templates.subLocationsList} element={<SubLocationsList />} />,
      <Route key={templates.subLocationsCreate} path={templates.subLocationsCreate} element={<SubLocationsDetailPage />} />,
      <Route key={templates.subLocationsEdit} path={templates.subLocationsEdit} element={<SubLocationsDetailPage />} />,

      { /* what's new Page*/}
      <Route key={templates.whatsNew} path={templates.whatsNew} element={<News />} />
      <Route key={templates.impacts} path={templates.impacts} element={<Impacts />} />
      <Route key={templates.operationTracking} path={templates.operationTracking} element={<TrackingOperation />} />
    </Routes >
  );
}
