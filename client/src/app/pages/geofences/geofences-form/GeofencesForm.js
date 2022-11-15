import React from 'react';
import GeofencingComponent from '../../../components/form/GeofencingComponent';


export function GeofencesForm({ match }) {
    const { id } = match.params;

    return (
        <div>
            {<GeofencingComponent id={id} />}
        </div>
    );
}