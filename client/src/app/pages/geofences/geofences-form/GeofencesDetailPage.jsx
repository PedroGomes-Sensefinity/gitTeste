import React from 'react';
import { TabContainer } from 'react-bootstrap';
import { Outlet, useParams } from 'react-router-dom';
import { Layout } from '../../../../_metronic/layout';
import GeofencingComponent from '../../../components/form/GeofencingComponent';
import { GeofencesPageHeader } from './GeofencesPageHeader';


export function GeofencesDetailPage() {
    const { id } = useParams()

    const context = { id: id }
    return (
        <Layout>
            <GeofencesPageHeader id={id} />
            <TabContainer>
                <Outlet context={context} />
            </TabContainer>
        </Layout>
    );
}