import DoneIcon from "@material-ui/icons/Done";
import { makeStyles } from "@material-ui/styles";
import { ErrorMessage, Field, Formik, FieldArray } from "formik";
import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import BlockUi from "react-block-ui";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import { injectIntl } from "react-intl";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import apiService from "../../services/apiService";
import geofenceService from "../../services/geofenceservice";
import apiServiceV2 from "../../services/v2/apiServiceV2";
import operationsServiceV2 from "../../services/v2/operationsServiceV2";
import { getInputClasses } from "../../utils/formik";
import toaster from "../../utils/toaster";
import "../../utils/yup-validations";
import Map from "../geo-fencing-map/map";
import TableGrid from "../table-grid/TableGrid";

const useStyles = makeStyles(theme => ({
    headerMarginTop: {
        marginTop: theme.spacing(5)
    }
}));

function TrackingOperation() {
    const classes = useStyles();
    const [blocking, setBlocking] = useState(false);
    const [loading, setLoading] = useState(false);

    const [geofences, setGeofences] = useState([]);

    const [assets, setAssets] = useState([]);
    const [selectedAssets, setSelectedAssets] = useState([]);
    const selectedAssetsId = selectedAssets.map(t => t.id);

    const [info, setInfo] = useState([]);

    const history = useHistory()

    const [tenantId, setTenantId] = useState(0);
    const [tenantsOptions, setTenantsOptions] = useState([{ id: 0, name: "Tenants Not Found" }]);

    useEffect(() => {
        apiServiceV2.get("v2/tenants/children").then(response => {
            const respTenants = response.tenants_new || [];

            const tenantsOptionsR = respTenants.map(tenant => {
                return { id: tenant.id, name: tenant.name };
            });
            tenantsOptionsR.push({ id: 0, name: "ALL" })
            setTenantsOptions(tenantsOptionsR);
        });
    }, []);

    const [initialValues, setInitialValues] = useState({
        id: "",
        label: "",
        description_geofence: "",
        alert_mode: "1",
        notifications_templates: [
            {
                name: "",
                contact: ""
            }
        ],
        type: "1",
    });

    const optionsGeofences = [
        { id: 1, name: "None" },
        { id: 2, name: "In" },
        { id: 3, name: "Out" },
        { id: 4, name: "In/Out" }
    ];

    const optionsNotification = [
        { id: 1, name: "Email" },
        { id: 2, name: "Sms" }
    ];

    const getGeofenceIndexById = useCallback(
        id => {
            for (let i = 0; i < geofences.length; i++) {
                if (geofences[i].id === id) {
                    return i;
                }
            }
            return -1;
        },
        [geofences]
    );

    const onChangeShape = shapes => {
        setGeofences(shapes);
    };

    const handleChangeTenant = event => {
        setTenantId(event.target.value);
        setAssets([]);
        setSelectedAssets([]);
    };

    const filterBy = () => true;

    const onChangeAsset = opt => {
        setSelectedAssets(opt);
    };

    const handleSearchAsset = query => {
        setLoading(true);
        if (tenantId !== undefined || tenantId === 0) {
            apiServiceV2.getByLimitOffsetSearchTenant("v2/assets", 50, 0, query, tenantId).then(response => {
                const respAsset = response.assets || [];
                setAssets(filterAssetSelected(respAsset));
                setLoading(false);
            });
        } else {
            apiServiceV2.getByLimitOffsetSearch("v2/assets", 50, 0, query).then(response => {
                const respAsset = response.assets || [];
                setAssets(filterAssetSelected(respAsset));
                setLoading(false);
            });
        }
    };

    const filterAssetSelected = options =>
        options
            .filter(t => !selectedAssetsId.includes(t.id))
            .map(t => {
                return {
                    id: t.id,
                    label: t.label
                };
            });

    const columnsGeofences = [
        {
            field: "name",
            title: "Shape"
        }
    ];

    const validationSchema = Yup.object().shape({
        label: Yup.string().required("Label is required"),
        alert_mode: Yup.string().required("AlertMode is required")
    });

    const validateTenant = value => {
        let error;
        if (value === undefined || value === "" || value === 0 || isNaN(value)) {
            error = "Select Asset Type";
            return error;
        }
        return error;
    };

    const save = (fields, { setFieldValue, setSubmitting }) => {
        if (geofences.length === 0) {
            toaster.notify("error", "Geofence needs at least 1 Shape!");
            setBlocking(false);
            setSubmitting(false);
            return;
        }
        setBlocking(true);
        setSubmitting(true);
        console.log(fields["tenant"].id)
        if (parseInt(fields["tenant"].id) === 0){
            console.log(tenantsOptions)
            const label = fields["label"]
            tenantsOptions.forEach(tenantOption =>{
                const fieldsCopy = fields
                console.log(tenantOption)
                if(parseInt(tenantOption.id) !== 0){
                    fieldsCopy["label"] = label + "-" + tenantOption.name
                    switch (fieldsCopy["alert_mode"]) {
                        case "1":
                            fieldsCopy["alert_mode"] = "None";
                            break;
                        case "2":
                            fieldsCopy["alert_mode"] = "In";
                            break;
                        case "3":
                            fieldsCopy["alert_mode"] = "Out";
                            break;
                        case "4":
                            fieldsCopy["alert_mode"] = "In/Out";
                            break;
                    }
                    switch (fieldsCopy["type"]) {
                        case "1":
                            fieldsCopy["type"] = "email";
                            break;
                        case "2":
                            fieldsCopy["type"] = "sms";
                            break;
                    }
                    const data = {};
                    for (let i = 0; i < geofences.length; i++) {
                        data[i] = JSON.stringify(geofences[i]);
                    }
                    fieldsCopy["geofence"] = JSON.stringify(data);
                    fieldsCopy["asset_ids"] = selectedAssetsId;
                    fieldsCopy["tenant"].id = tenantOption.id
                    fieldsCopy["tenant_id"] = parseInt(tenantOption.id);
                    console.log(fieldsCopy)
                    console.log(JSON.stringify(fieldsCopy))
                    operationsServiceV2.save("tracking", fieldsCopy).then(r => {
                        const thresholdId = r.id
                        setBlocking(false);
                        setSubmitting(false);
                        history.push(`/thresholds/list`)
                    }).catch(r => {
                        toaster.notify('error', "Error on Creating Operation");
                        setBlocking(false);
                        setSubmitting(false);
                    })
                }
            })
        }else{
            switch (fields["alert_mode"]) {
                case "1":
                    fields["alert_mode"] = "None";
                    break;
                case "2":
                    fields["alert_mode"] = "In";
                    break;
                case "3":
                    fields["alert_mode"] = "Out";
                    break;
                case "4":
                    fields["alert_mode"] = "In/Out";
                    break;
            }
            switch (fields["type"]) {
                case "1":
                    fields["type"] = "email";
                    break;
                case "2":
                    fields["type"] = "sms";
                    break;
            }
            const data = {};
            for (let i = 0; i < geofences.length; i++) {
                data[i] = JSON.stringify(geofences[i]);
            }
            fields["geofence"] = JSON.stringify(data);
            fields["asset_ids"] = selectedAssetsId;
            fields["tenant_id"] = parseInt(fields["tenant"].id);
            console.log(fields)
            operationsServiceV2.save("tracking", fields).then(r => {
                const thresholdId = r.id
                setBlocking(false);
                setSubmitting(false);
                history.push(`/thresholds/${thresholdId}/edit`)
            }).catch(r => {
                toaster.notify('error', "Error on Creating Operation");
                setBlocking(false);
                setSubmitting(false);
            })
        }
        
    };

    return (
        <BlockUi tag="div" blocking={blocking}>
            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, { setFieldValue, setSubmitting, resetForm }) => {
                    save(values, {
                        setFieldValue,
                        setSubmitting,
                        resetForm
                    });
                }}
            >
                {({ isValid, getFieldProps, errors, touched, isSubmitting, handleSubmit, setFieldValue, values }) => (
                    <form className="card card-custom" onSubmit={handleSubmit}>
                        {/* begin::Header */}
                        <div className={`card-header py-3 ` + classes.headerMarginTop}>
                            <div className="card-title align-items-start flex-column">
                                <h3 className="card-label font-weight-bolder text-dark">Setup Tracking</h3>
                                <span className="text-muted font-weight-bold font-size-sm mt-1">
                                    Operation to create Geofence, Threshold, Notification Template and associate with multiple Assets.
                                </span>
                                <span className="text-muted font-weight-bold font-size-sm mt-1">
                                    <label className="required">&nbsp;</label> All fields marked with asterisks are
                                    required
                                </span>
                            </div>
                            <div className="card-toolbar">
                                <button
                                    type="submit"
                                    className="btn btn-success mr-2"
                                    disabled={isSubmitting || (touched && !isValid)}
                                >
                                    <DoneIcon />
                                    Save Changes
                                    {isSubmitting}
                                </button>
                                <Link to="/geofences/list" className="btn btn-secondary">
                                    Back to list
                                </Link>
                            </div>
                        </div>
                        {/* end::Header */}
                        {/* begin::Form */}
                        <div className="form">
                            <div className="card-body">
                                <div className="form-group row">
                                    <div className="col-xl-6 col-lg-6">
                                        <label className={`required`}>Label</label>
                                        <Field
                                            as="input"
                                            className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                { errors, touched },
                                                "label"
                                            )}`}
                                            name="name"
                                            placeholder="Set the label"
                                            {...getFieldProps("label")}
                                        />
                                        <ErrorMessage name="label" component="div" className="invalid-feedback" />
                                    </div>
                                    <div className="col-xl-6 col-lg-6">
                                        <label className={`required`}>Tenant</label>
                                        <Field
                                            validate={validateTenant}
                                            type={"number"}
                                            as="select"
                                            className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                { errors, touched },
                                                "tenant.id"
                                            )}`}
                                            name="tenant.id"
                                            placeholder=""
                                            {...getFieldProps("tenant.id")}
                                            onChange={e => {
                                                setFieldValue("tenant.id", e.target.value);
                                                handleChangeTenant(e);
                                            }}
                                        >
                                            <option key="" value=""></option>
                                            {tenantsOptions.map(e => {
                                                return (
                                                    <option key={e.id} value={e.id}>
                                                        {e.name}
                                                    </option>
                                                );
                                            })}
                                        </Field>
                                        <ErrorMessage name="tenant_id" component="div" className="invalid-feedback" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* end::Form */}
                        {/* begin::Header */}
                        <div className={`card-header py-3 ` + classes.headerMarginTop}>
                            <div className="card-title align-items-start flex-column">
                                <h3 className="card-label font-weight-bolder text-dark">Assets</h3>
                                <span className="text-muted font-weight-bold font-size-sm mt-1">Add Assets</span>
                            </div>
                        </div>
                        {/* end::Header */}
                        {/* begin::Form */}
                        <div className="form">
                            <div className="card-body">
                                <div className="form-group row">
                                    <div className="col-xl-12 col-lg-12">
                                        <label>Assets</label>
                                        <div>
                                            <AsyncTypeahead
                                                id="typeahead-asset"
                                                labelKey="label"
                                                size="lg"
                                                multiple
                                                onChange={onChangeAsset}
                                                options={assets}
                                                placeholder=""
                                                selected={selectedAssets}
                                                onSearch={handleSearchAsset}
                                                isLoading={loading}
                                                filterBy={filterBy}
                                                useCache={false}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* end::Form */}
                        {/* begin::Header */}
                        <div className={`card-header py-3 ` + classes.headerMarginTop}>
                            <div className="card-title align-items-start flex-column">
                                <h3 className="card-label font-weight-bolder text-dark">Geofences</h3>
                                <span className="text-muted font-weight-bold font-size-sm mt-1">
                                    Create Geofence
                                </span>
                            </div>
                        </div>
                        {/* end::Header */}

                        {/* begin::Form */}
                        <div className="form">
                            <div className="card-body">
                                <div className="form-group row">
                                    <div className="col-xl-6 col-lg-6">
                                        <label>Description</label>
                                        <Field
                                            as="textarea"
                                            rows="1"
                                            className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                { errors, touched },
                                                "description_geofence"
                                            )}`}
                                            name="description_geofence"
                                            placeholder="Set the description"
                                            {...getFieldProps("description_geofence")}
                                        />
                                    </div>

                                    <div className="col-xl-6 col-lg-6">
                                        <label className={`required`}>Alert Mode</label>
                                        <Field
                                            type={"number"}
                                            as="select"
                                            default="1"
                                            className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                { errors, touched },
                                                "alert_mode"
                                            )}`}
                                            name="alert_mode"
                                            placeholder=""
                                            {...getFieldProps("alert_mode")}
                                        >
                                            {optionsGeofences.map(e => {
                                                return (
                                                    <option key={e.id} value={e.id}>
                                                        {e.name}
                                                    </option>
                                                );
                                            })}
                                        </Field>
                                        <ErrorMessage name="alert_mode" component="div" className="invalid-feedback" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* end::Form */}
                        {/* begin::Form */}
                        <div className="form">
                            <div className="card-body">
                                <div className="form-group row">
                                    {/*begin:: Map */}
                                    <div className={`col-xl-6 col-lg-6`}>
                                        <Map shapes={geofences} onChangeShape={onChangeShape} />
                                    </div>
                                    <div className={`col-xl-6 col-lg-6  `}>
                                        <TableGrid
                                            title=""
                                            columns={columnsGeofences}
                                            data={geofences}
                                            style={{ height: 500 }}
                                            editable={{
                                                onRowUpdate: (newData, oldData) =>
                                                    new Promise((resolve, _reject) => {
                                                        setTimeout(() => {
                                                            const dataUpdate = [...geofences];
                                                            const index = getGeofenceIndexById(oldData.tableData.id);
                                                            dataUpdate[index] = newData;
                                                            onChangeShape(dataUpdate);
                                                            resolve();
                                                        }, 1000);
                                                    })
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* begin::Header */}
                            <div className={`card-header py-3 ` + classes.headerMarginTop}>
                                <div className="card-title align-items-start flex-column">
                                    <h3 className="card-label font-weight-bolder text-dark">Notification</h3>
                                    <span className="text-muted font-weight-bold font-size-sm mt-1">
                                        Create Notification Template
                                    </span>
                                </div>
                            </div>
                            {/* end::Header */}

                            {/* begin::Form */}
                            <div className="form">
                                <div className="card-body">
                                    <div className="form-group row">
                                        <div className="col-xl-12 col-lg-12">
                                            <label className={`required`}>Type</label>
                                            <Field
                                                type={"number"}
                                                as="select"
                                                default="1"
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                    { errors, touched },
                                                    "type"
                                                )}`}
                                                name="type"
                                                placeholder=""
                                                {...getFieldProps("type")}
                                            >
                                                {optionsNotification.map(e => {
                                                    return (
                                                        <option key={e.id} value={e.id}>
                                                            {e.name}
                                                        </option>
                                                    );
                                                })}
                                            </Field>
                                            <FieldArray name="notifications_templates">
                                                {({ insert, remove, push }) => (
                                                    <div>
                                                        {values.notifications_templates.length > 0 &&
                                                            values.notifications_templates.map((notification, index) => (
                                                                <div className="row" key={index}>
                                                                    <div className="col-xl-1 col-lg-1" style={{ display: "flex", margin: "5px" }}>
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-secondary"
                                                                            onClick={() => remove(index)}
                                                                        >
                                                                            Remove Contact
                                                                        </button>
                                                                    </div>
                                                                    <div className="col-xl-3 col-lg-3">
                                                                        <label
                                                                            htmlFor={`notifications_templates.${index}.name`}
                                                                        >
                                                                            Name
                                                                        </label>
                                                                        <Field
                                                                            className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                                                { errors, touched },
                                                                                "notifications_templates.name"
                                                                            )}`}
                                                                            name={`notifications_templates.${index}.name`}
                                                                            placeholder="User Sensefinity"
                                                                            type="text"
                                                                        />
                                                                        <ErrorMessage
                                                                            name={`notifications_templates.${index}.name`}
                                                                            component="div"
                                                                            className="field-error"
                                                                        />
                                                                    </div>
                                                                    <div className="col-xl-4 col-lg-4">
                                                                        <label
                                                                            htmlFor={`notifications_templates.${index}.contact`}
                                                                        >
                                                                            Contact
                                                                        </label>
                                                                        <Field
                                                                            className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                                                { errors, touched },
                                                                                "notifications_templates.contact"
                                                                            )}`}
                                                                            name={`notifications_templates.${index}.contact`}
                                                                        />
                                                                        <ErrorMessage
                                                                            name={`notifications_templates.${index}.name`}
                                                                            component="div"
                                                                            className="field-error"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        <button
                                                            type="button"
                                                            className="btn btn-success mr-2"
                                                            onClick={() => push({ name: "", contact: "" })}
                                                        >
                                                            Add Contact
                                                        </button>
                                                    </div>
                                                )}
                                            </FieldArray>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* end::Form */}
                        </div>
                        {/* end::Form */}
                    </form>
                )}
            </Formik>
        </BlockUi>
    );
}

export default injectIntl(TrackingOperation);
