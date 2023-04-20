import DoneIcon from "@material-ui/icons/Done";
import { makeStyles } from "@material-ui/styles";
import { ErrorMessage, Field, Formik } from "formik";
import React, { useCallback, useEffect, useState } from "react";
import BlockUi from "react-block-ui";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import { injectIntl } from "react-intl";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { getInputClasses } from "../../utils/formik";
import toaster from "../../utils/toaster";
import "../../utils/yup-validations";
import Map from "../geo-fencing-map/map";
import TableGrid from "../table-grid/TableGrid";
import apiServiceV2 from "../../services/v2/apiServiceV2";
import geofenceServiceV2 from "../../services/v2/geofenceServiceV2";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles(theme => ({
    headerMarginTop: {
        marginTop: theme.spacing(5)
    }
}));

function GeofencingComponent(props) {
    const id = props.id;
    const isAddMode = !id;
    const classes = useStyles();
    const history = useHistory();
    const [blocking, setBlocking] = useState(false);
    const [loading, setLoading] = useState(false);

    const [geofences, setGeofences] = useState([]);
    const [thresholdIdQuery, setThresholdIdQuery] = useState(0);

    const [thresholds, setThresholds] = useState([]);
    const [selectedThresholds, setSelectedThresholds] = useState([]);

    const [tenantsOptions, setTenantsOptions] = useState([{ id: 0, name: "Tenants Not Found" }]);
    const [tenantId, setTenantId] = useState(0);

    const [initialValues, setInitialValues] = useState({ id: "", label: "", description: "", alert_mode: "1" });

    useEffect(() => {
        const url = window.location.href;
        let decodedUrl = unescape(url);
        const myArray = decodedUrl.split("?");
        if (myArray.length === 2) {
            const params = new URLSearchParams(myArray[1]);
            let thresholdID = params.get("threshold_id");
            if (thresholdID !== null) {
                apiServiceV2.get("v2/thresholds/" + thresholdID).then(response => {
                    const thresholdsSelected = selectedThresholds;
                    thresholdsSelected.push({ id: response.threshold.id, label: response.threshold.label });
                    setSelectedThresholds([...thresholdsSelected]);
                    setInitialValues({ id: "", label: "", description: "", alert_mode: "1" , tenant:{id: response.threshold.tenant.id}})
                    setTenantId(response.threshold.tenant.id)
                    setThresholdIdQuery(response.threshold.id)
                });
            }
        }
        // Get tenant options
        if (isAddMode) {
            apiServiceV2.get("v2/tenants/children").then(response => {
                const respTenants = response.tenants_new || [];

                const tenantsOptionsR = respTenants.map(tenant => {
                    return { id: tenant.id, name: tenant.name };
                });
                setTenantsOptions(tenantsOptionsR);
            });
        }
        //Edit Case
        if (typeof id !== "undefined" && id !== 0) {
            //Get Geofence Data
            apiServiceV2.get("v2/geofences/" + id).then(response => {
                const geofence = response.geofence;
                switch (geofence.alert_mode) {
                    case "None":
                        geofence.alert_mode = "1";
                        break;
                    case "In":
                        geofence.alert_mode = "2";
                        break;
                    case "Out":
                        geofence.alert_mode = "3";
                        break;
                    case "In/Out":
                        geofence.alert_mode = "4";
                        break;
                }
                setInitialValues({
                    id: geofence.id,
                    label: geofence.label,
                    description: geofence.description,
                    alert_mode: geofence.alert_mode
                });
                const shapes = geofence.shapes;
                const geofencesArr = [];
                // Shapes Data
                shapes.forEach(shape => {
                    const shapeJson = JSON.parse(shape);
                    shapeJson["geoJSON"] = JSON.parse(shapeJson["geoJSON"]);
                    geofencesArr.push(shapeJson);
                });
                setGeofences(geofencesArr);
                // Add threshold to Geofence Data
                geofence.thresholdsIds.forEach(id => {
                    apiServiceV2.get("v2/thresholds/" + id).then(response => {
                        const thresholdsSelected = selectedThresholds;
                        thresholdsSelected.push({ id: response.threshold.id, label: response.threshold.label });
                        setSelectedThresholds([...thresholdsSelected]);
                    });
                });
                setTenantsOptions([{ id: geofence.tenant.id, name: geofence.tenant.name }]);
            });
        }
    }, []);

    const options = [
        { id: 1, name: "None" },
        { id: 2, name: "In" },
        { id: 3, name: "Out" },
        { id: 4, name: "In/Out" }
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

    const filterBy = () => true;

    const onChangeThreshold = opt => {
        setSelectedThresholds(opt);
    };

    const handleSearchThreshold = query => {
        setLoading(true);
        if (isAddMode) {
            apiServiceV2.getByLimitOffsetSearchTenant("v2/thresholds", 50, 0, query, tenantId).then(response => {
                const thresholds =
                    typeof response.thresholds !== undefined && Array.isArray(response.thresholds)
                        ? filterThresholdSelected(response.thresholds)
                        : [];

                setThresholds(thresholds);
                setLoading(false);
            });
        } else {
            apiServiceV2
                .getByLimitOffsetSearchTenant("v2/thresholds", 50, 0, query, tenantsOptions[0].id)
                .then(response => {
                    const thresholds =
                        typeof response.thresholds !== undefined && Array.isArray(response.thresholds)
                            ? filterThresholdSelected(response.thresholds)
                            : [];

                    setThresholds(thresholds);
                    setLoading(false);
                });
        }
    };

    const filterThresholdSelected = options => {
        let data = [];
        options.forEach(o => {
            if (!selectedThresholds.some(e => e.id === o.id)) {
                data.push(o);
            }
        });
        return data;
    };

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
        if (!isAddMode) {
            return error;
        }
        if (value === undefined || value === "" || value === 0 || isNaN(value)) {
            error = "Select Asset Type";
            return error;
        }
        return error;
    };

    const handleChangeTenant = event => {
        setTenantId(event.target.value);
        setThresholds([]);
        setSelectedThresholds([]);
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
        const data = {};
        for (let i = 0; i < geofences.length; i++) {
            data[i] = JSON.stringify(geofences[i]);
        }
        fields["metadata"] = JSON.stringify(data);
        fields["thresholdsIds"] = selectedThresholds.map(t => t.id);
        if (isAddMode) {
            fields["id"] = 0;
            fields["tenant_id"] = parseInt(fields.tenant.id);
        }
        fields["tenant"] = {};
        const endpoint = isAddMode ? "save" : "update";
        geofenceServiceV2[endpoint](fields).then(_response => {
            toaster.notify("success", "Success Geofences!");
            setSubmitting(false);
            setBlocking(false);

            switch (fields["alert_mode"]) {
                case "None":
                    fields["alert_mode"] = "1";
                    break;
                case "In":
                    fields["alert_mode"] = "2";
                    break;
                case "Out":
                    fields["alert_mode"] = "3";
                    break;
                case "In/Out":
                    fields["alert_mode"] = "4";
                    break;
            }
            setFieldValue("alert_mode", fields["alert_mode"], false);

            if (isAddMode) {
                setFieldValue("label", "", false);
                setFieldValue("description", "", false);
                setFieldValue("alert_mode", "1", false);
                setGeofences([]);
                setThresholds([]);
                setSelectedThresholds([]);
                if(thresholdIdQuery !== 0){
                    history.push(`/thresholds/${thresholdIdQuery}/edit`);
                }
            }
            setBlocking(false);
            setSubmitting(false);
        });
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
                {({ isValid, getFieldProps, errors, touched, isSubmitting, handleSubmit, setFieldValue }) => (
                    <form className="card card-custom" onSubmit={handleSubmit}>
                        {/* begin::Header */}
                        <div className={`card-header py-3 ` + classes.headerMarginTop}>
                            <div className="card-title align-items-start flex-column">
                                <h3 className="card-label font-weight-bolder text-dark">Geofences</h3>
                                <span className="text-muted font-weight-bold font-size-sm mt-1">
                                    Create or Edit Geofences
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
                                    <div className="col-xl-12 col-lg-12">
                                        <label className={`required`}>Tenant</label>
                                        <Field
                                            disabled={!isAddMode}
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
                                            {isAddMode && <option key="" value=""></option>}
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
                                            placeholder="Set the Geofence label"
                                            {...getFieldProps("label")}
                                        />
                                        <ErrorMessage name="label" component="div" className="invalid-feedback" />
                                    </div>

                                    <div className="col-xl-6 col-lg-6">
                                        <label>Threshold</label>
                                        <div>
                                            <AsyncTypeahead
                                                id="typeahead-threshold"
                                                labelKey="label"
                                                size="lg"
                                                multiple
                                                onChange={onChangeThreshold}
                                                options={thresholds}
                                                placeholder=""
                                                selected={selectedThresholds}
                                                onSearch={handleSearchThreshold}
                                                isLoading={loading}
                                                filterBy={filterBy}
                                                useCache={false}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <div className="col-xl-6 col-lg-6">
                                        <label>Description</label>
                                        <Field
                                            as="textarea"
                                            rows="1"
                                            className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                { errors, touched },
                                                "description"
                                            )}`}
                                            name="description"
                                            placeholder="Set the description"
                                            {...getFieldProps("description")}
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
                                            {options.map(e => {
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
                        </div>
                        {/* end::Form */}
                    </form>
                )}
            </Formik>
        </BlockUi>
    );
}

export default injectIntl(GeofencingComponent);
