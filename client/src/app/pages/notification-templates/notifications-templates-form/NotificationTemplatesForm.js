import React from "react";
import NotificationsTemplatesFormComponent from "../../../components/form/NotificationTemplatesFormComponent";
import { injectIntl } from "react-intl";
                  
export function NotificationTemplatesForm({match}) {
    const {id} = match.params;

    return <NotificationsTemplatesFormComponent id={id}  />
}  

export default injectIntl(NotificationTemplatesForm);