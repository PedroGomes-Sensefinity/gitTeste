import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../_metronic/layout";

import { Dashboard } from "./pages/dashboard/Dashboard";
import { Device } from "./pages/devices/device/Device";
import { DevicesList } from "./pages/devices/devices-list/DevicesList";
import { DevicesProvision } from "./pages/devices/devices-provision/DevicesProvision";
import { DevicesUpload } from "./pages/devices/devices-upload/DevicesUpload";
import { GroupsList } from "./pages/groups/groups-list/GroupsList";
import { GroupsForm } from "./pages/groups/groups-form/GroupsForm";
import { NotificationTemplatesForm } from "./pages/notification-templates/notifications-templates-form/NotificationTemplatesForm";
import { NotificationTemplatesList } from "./pages/notification-templates/notifications-templates-list/NotificationTemplatesList";
import { AlarmsList } from "./pages/alarms/alarms-list/AlarmsList";
import { AlarmsForm } from "./pages/alarms/alarms-form/AlarmsForm";
import { ThresholdsList } from "./pages/thresholds/thresholds-list/ThresholdsList";
import { ThresholdsForm } from "./pages/thresholds/thresholds-form/ThresholdsForm";
import {TenantsList} from "./pages/tenants/tenants-list/TenantsList";
import {TenantsForm} from "./pages/tenants/tenants-form/TenantsForm";
import { BoardFamiliesList } from "./pages/board-families/list/BoardFamiliesList";
import { BoardFamiliesForm } from "./pages/board-families/form/BoardFamiliesForm";
import {ProfilesForm} from "./pages/profiles/profiles-form/ProfilesForm";
import { ProfilesList } from "./pages/profiles/profiles-list/ProfilesList";
import {UsersList} from "./pages/users/users-list/UsersList";

/*const UserProfilepage = lazy(() =>
  import("./modules/UserProfile/UserProfilePage")
);*/

export default function BasePage() {
  // useEffect(() => {
  //   console.log('Base page');
  // }, []) // [] - is required if you need only one call
  // https://reactjs.org/docs/hooks-reference.html#useeffect

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          /* Redirect from root URL to /dashboard. */
          <Redirect exact from="/" to="/dashboard" />
        }
        <ContentRoute path="/dashboard" component={Dashboard} />

        { /* Devices Routes*/ }
        <ContentRoute path="/devices/list" component={DevicesList} />
        <ContentRoute path="/devices/new" component={Device} />
        <ContentRoute path="/devices/edit/:id" component={Device} />
        <ContentRoute path="/devices/provision" component={DevicesProvision} />
        <ContentRoute path="/devices/upload" component={DevicesUpload} />

        { /* Board families Routes*/ }
        <ContentRoute path="/board-families/list" component={BoardFamiliesList} />
        <ContentRoute path="/board-families/new" component={BoardFamiliesForm} />
        <ContentRoute path="/board-families/edit/:id" component={BoardFamiliesForm} />

        { /* Groups Routes*/}
        <ContentRoute path="/groups/list" component={GroupsList} />
        <ContentRoute path="/groups/new" component={GroupsForm} />
        <ContentRoute path="/groups/edit/:id" component={GroupsForm} />

        { /* Thresholds Routes*/}
        <ContentRoute path="/thresholds/list" component={ThresholdsList} />
        <ContentRoute path="/thresholds/new" component={ThresholdsForm} />
        <ContentRoute path="/thresholds/edit/:id" component={ThresholdsForm} />

        { /* Tenants Routes*/}
        <ContentRoute path="/tenants/list" component={TenantsList} />
        <ContentRoute path="/tenants/new" component={TenantsForm} />
        <ContentRoute path="/tenants/edit/:id" component={TenantsForm} />

        { /* Profiles Routes*/}
        <ContentRoute path="/profiles/list" component={ProfilesList} />
        <ContentRoute path="/profiles/new" component={ProfilesForm} />
        <ContentRoute path="/profiles/edit/:id" component={ProfilesForm} />

        { /* Users Routes*/}
        <ContentRoute path="/users/list" component={UsersList} />
        {/*<ContentRoute path="/users/new" component={ProfilesForm} />*/}
        {/*<ContentRoute path="/users/edit/:id" component={ProfilesForm} />*/}

        { /* Alarms Routes*/}
        <ContentRoute path="/alarms/list" component={AlarmsList} />
        <ContentRoute path="/alarms/new" component={AlarmsForm} />
        <ContentRoute path="/alarms/edit/:id" component={AlarmsForm} />

        { /* NotificationTemplates Routes*/}
        <ContentRoute path="/notification-templates/list" component={NotificationTemplatesList} />
        <ContentRoute path="/notification-templates/new" component={NotificationTemplatesForm} />
        <ContentRoute path="/notification-templates/edit/:id" component={NotificationTemplatesForm} />

        <Redirect to="error/error-v1" />
      </Switch>
    </Suspense>
  );
}
