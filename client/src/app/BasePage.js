import React, { Suspense, lazy } from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../_metronic/layout";
import { MyPage } from "./pages/MyPage";
import { DashboardPage } from "./pages/DashboardPage";
import { DevicesList } from "./pages/devices/devices-list/DevicesList";
import { DevicesProvision } from "./pages/devices/devices-provision/DevicesProvision";
import { DevicesUpload } from "./pages/devices/devices-upload/DevicesUpload";
import { DevicesForm } from "./pages/devices/devices-form/DevicesForm";
import { GroupsList } from "./pages/groups/groups-list/GroupsList";
import { GroupsForm } from "./pages/groups/groups-form/GroupsForm";
import { NotificationTemplatesForm } from "./pages/notification-templates/notifications-templates-form/NotificationTemplatesForm";
import { NotificationTemplatesList } from "./pages/notification-templates/notifications-templates-list/NotificationTemplatesList";
import { AlarmsList } from "./pages/alarms/alarms-list/AlarmsList";
import { AlarmsForm } from "./pages/alarms/alarms-form/AlarmsForm";
import { ThresholdsList } from "./pages/thresholds/thresholds-list/ThresholdsList";
import { ThresholdsForm } from "./pages/thresholds/thresholds-form/ThresholdsForm";

const UserProfilepage = lazy(() =>
  import("./modules/UserProfile/UserProfilePage")
);

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
        <ContentRoute path="/dashboard" component={DashboardPage} />

        <ContentRoute path="/my-page" component={MyPage} />

        { /* Devices Routes*/ }
        <ContentRoute path="/devices/list" component={DevicesList} />
        <ContentRoute path="/devices/new/:id" component={DevicesForm} />
        <ContentRoute path="/devices/edit" component={DevicesForm} />
        <ContentRoute path="/devices/provision" component={DevicesProvision} />
        <ContentRoute path="/devices/upload" component={DevicesUpload} />

        { /* Groups Routes*/}
        <ContentRoute path="/groups/list" component={GroupsList} />
        <ContentRoute path="/groups/new" component={GroupsForm} />
        <ContentRoute path="/groups/edit" component={GroupsForm} />

        { /* Thresholds Routes*/}
        <ContentRoute path="/thresholds/list" component={ThresholdsList} />
        <ContentRoute path="/thresholds/new" component={ThresholdsForm} />
        <ContentRoute path="/thresholds/edit" component={ThresholdsForm} />

        { /* Alarms Routes*/}
        <ContentRoute path="/alarms/list" component={AlarmsList} />
        <ContentRoute path="/alarms/new" component={AlarmsForm} />
        <ContentRoute path="/alarms/edit" component={AlarmsForm} />

        { /* NotificationTemplates Routes*/}
        <ContentRoute path="/notification-templates/list" component={NotificationTemplatesList} />
        <ContentRoute path="/notification-templates/new" component={NotificationTemplatesForm} />
        <ContentRoute path="/notification-templates/edit" component={NotificationTemplatesForm} />
        
        <Redirect to="error/error-v1" />
      </Switch>
    </Suspense>
  );
}
