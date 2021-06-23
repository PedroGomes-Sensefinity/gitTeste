import React, {useEffect, useState} from "react";
import * as Yup from 'yup';

import apiService from "../../../services/apiService";
import DeviceFormComponent from "../../../components/form/deviceFormComponent";

function Teste({ history, match }) {
    const { id } = match.params;

    return (
       <DeviceFormComponent
           id={id}
           groups={apiService.get('group', 100, 0 )}
           parents={apiService.get('device', 100, 0 )}
       />
    )
}

export { Teste };