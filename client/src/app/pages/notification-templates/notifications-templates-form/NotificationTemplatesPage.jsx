import React from "react";
import { useParams } from "react-router-dom";
import { Layout } from "../../../../_metronic/layout";
import NotificationsTemplatesFormComponent from "../../../components/form/NotificationTemplatesFormComponent";

export function NotificationTemplatesPage() {
    const { id } = useParams()

    return <Layout>
        <NotificationsTemplatesFormComponent id={id} />
    </Layout>
}  