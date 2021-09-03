import React from "react";
import NotificationsTemplatesFormComponent from "../../../components/form/notificationTemplatesFormComponent";
                  
export function NotificationTemplatesForm({match}) {
    const {id} = match.params;

    return <NotificationsTemplatesFormComponent id={id}  />
}  