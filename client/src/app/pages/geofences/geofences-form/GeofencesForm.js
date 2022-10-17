import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Paper, Tab, Tabs } from "@material-ui/core";
import { TabContainer } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import AssetDevicesComponent from "../../../components/form/AssetDevicesComponent";
import AssetsFormComponent from "../../../components/form/AssetsFormComponent";
import AssetFormExtraFields from "../../../components/form/AssetFormExtraFields";
import apiService from '../../../services/apiService';
import BlockUi from "react-block-ui";
import GeofencingComponent from '../../../components/form/GeofencingComponent';


export function GeofencesForm({history, match}) {
    const {id} = match.params;

    return (
        <div>
            {<GeofencingComponent id={id} />}
        </div>
    );
}