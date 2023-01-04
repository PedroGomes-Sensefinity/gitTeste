import React from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '../../../../_metronic/layout';
import GeofencingComponent from '../../../components/form/GeofencingComponent';


export function GeofencesDetailPage() {
    const { id } = useParams()

    return (
        <Layout>
            {<GeofencingComponent id={id} />}
        </Layout>
    );
}