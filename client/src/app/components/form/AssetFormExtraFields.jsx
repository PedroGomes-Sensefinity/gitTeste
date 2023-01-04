import React, { useEffect, useState } from "react";
import Form from "@rjsf/core";
import apiService from "../../services/apiService";
import apiServiceV2 from "../../services/v2/apiServiceV2";
import assetsServiceV2 from "../../services/v2/assetsServiceV2";
import toaster from "../../utils/toaster";
import { useOutletContext } from "react-router-dom";

export default function AssetFormExtraFields(props) {

    const { id: assetId, isLoading } = useOutletContext()

    const schemaDefault = {
        title: "You don't have Extra Fields for this Asset Type!",
        type: "object"
    };
    const [schema, setSchema] = useState(schemaDefault);
    const [asset, setAsset] = useState({});

    useEffect(() => {
        let endpoint = "v2/assets/" + assetId;
        apiServiceV2.get(endpoint).then(response => {
            setAsset(response.asset);
            if (
                response.asset.asset_type.metadataschema !== undefined &&
                response.asset.asset_type.metadataschema !== "{}"
            ) {
                let jsonObj = JSON.parse(response.asset.asset_type.metadataschema);
                const newSchema = {};
                newSchema.title = jsonObj.title;
                newSchema.properties = jsonObj.properties;
                newSchema.required = jsonObj.required;
                newSchema.properties = jsonObj.properties;

                const asset = JSON.parse(response.asset.metadata);
                const keys = Object.keys(asset);
                for (const element of keys) {
                    newSchema.properties[element].default = asset[element];
                }
                setSchema(newSchema);
            }
        });
    }, []);

    const onSubmit = formData => {
        console.log(formData.formData);
        const assetSave = asset;
        assetSave["asset_type_id"] = assetSave.asset_type.id
        assetSave["metadata"] = JSON.stringify(formData.formData);
        assetsServiceV2
            .update(assetSave)
            .then(response => {
                toaster.notify("success", "Updated Extra Fields");
            })
            .catch(err => {
                toaster.notify("error", err.status);
            });

    };
    const pStyle = {
        padding: "120px"
    };

    return (
        <div className={`card card-custom`} style={pStyle}>
            <Form schema={schema} onSubmit={onSubmit} />
        </div>
    );
}
