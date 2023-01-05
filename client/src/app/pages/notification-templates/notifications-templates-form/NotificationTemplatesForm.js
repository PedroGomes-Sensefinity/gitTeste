import React from "react";
import NotificationsTemplatesFormComponent from "../../../components/form/NotificationTemplatesFormComponent";
                  
export function NotificationTemplatesForm({match}) {
    const {id} = match.params;

    return <NotificationsTemplatesFormComponent id={id}  />
}  