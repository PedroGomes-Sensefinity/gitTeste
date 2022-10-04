import React, {useEffect,useState} from 'react';
import Form from "@rjsf/core";
import apiService from '../../services/apiService';
import assetsService from '../../services/assetsService';
import toaster from '../../utils/toaster';

export default function AssetFormExtraFields(props) {
  const schemaDefault = {
    title: "You don't have Extra Fields for this Asset Type!",
    type: "object"
  };
    const id = props.id
    const [schema, setSchema] = useState(schemaDefault);
    const [idAsset, setAssetID] = useState(0);

    useEffect(() => {
      let endpoint = "asset/" + id + "/asset-type"
      apiService.getByEndpoint(endpoint).then((response) => {
        if(response.asset_type.metadataschema != undefined && response.asset_type.metadataschema != "{}"){
            let jsonObj = JSON.parse(response.asset_type.metadataschema);
            schemaDefault.title = jsonObj.title
            schemaDefault.properties = jsonObj.properties
            schemaDefault.required = jsonObj.required
            schemaDefault.properties = jsonObj.properties
            let endpointID = "asset/" + id
            apiService.getByEndpoint(endpointID).then((response) => {
              const asset = JSON.parse(response.assets[0].metadata);
              const keys = Object.keys(asset);
              for (const element of keys) {
                schemaDefault.properties[element].default = asset[element]
              }
              setSchema(schemaDefault)
              setAssetID(id)
            });
        }
    });
    }, []); 

    const  onSubmit = (formData) => {
      assetsService.updateAssetMetadata(id, formData.formData)
      toaster.notify('success', "Updated Extra Fields");
    }
    const pStyle = {
      "padding": "120px"
    };



    return (<div className={`card card-custom`} style={pStyle}>
         <Form schema={schema}
         key={idAsset}
        onSubmit={onSubmit} />
    </div>

    );
}