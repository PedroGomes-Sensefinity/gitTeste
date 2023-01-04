import React from "react";
import { useParams } from "react-router-dom";
import { Layout } from "../../../../_metronic/layout";
import UserFormComponent from "../../../components/form/UserFormComponent";

export function UsersPage() {
    const { id } = useParams()

    return (
        <Layout>
            <UserFormComponent id={id} />
        </Layout>
    );
}