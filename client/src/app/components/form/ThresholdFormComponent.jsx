import DoneIcon from "@material-ui/icons/Done";
import { makeStyles } from "@material-ui/styles";
import { ErrorMessage, Field, Formik } from "formik";
import React, { useEffect, useState } from "react";
import BlockUi from "react-block-ui";
import RangeSlider from "react-bootstrap-range-slider";
import { injectIntl } from "react-intl";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import apiService from "../../services/apiService";
import thresholdServiceV2 from "../../services/v2/thresholdServiceV2";
import { getInputClasses } from "../../utils/formik";
import toaster from "../../utils/toaster";
import "../../utils/yup-validations";
import apiServiceV2 from "../../services/v2/apiServiceV2";

const useStyles = makeStyles(theme => ({
    headerMarginTop: {
        marginTop: theme.spacing(5)
    }
}));

const ruleTypeOptions = [
    { id: "temperaturedegree", name: "Temperature" },
    { id: "humidityrelative", name: "Humidity" },
    { id: "geofences", name: "Geo-fences" },
    { id: "buttonpressed", name: "Button pressed" },
    { id: "movementstatus", name: "Movement status" },
    { id: "acceleration", name: "Acceleration" }
];

function ThresholdFormComponent(props) {
    const intl = props.intl;
    const onThresholdChange = props.onChange;
    const isAddMode = props.id === undefined;
    const threshold = props.threshold || {};
    const thresholdId = props.id;
    const geofences = isAddMode ? [] : threshold.rule.geofences;
    const [blocking, setBlocking] = useState(false);
    const minLimit = 0;
    const maxLimit = 100;

    const [tenantsOptions, setTenantsOptions] = useState([{ id: 0, name: "Tenants Not Found" }]);
    const [tenantId, setTenantId] = useState(0);

    const ruleCurrentSymbol = "";
    const ruleWhenCronsOptions = [
        { id: "* * * * *", name: "Daily" },
        { id: "* * * * 1,2,3,4,5", name: "Weekdays" },
        { id: "* * * * 6,7", name: "Weekend" },
        { id: "custom", name: "Custom" }
    ];

    const initialValues = {
        id: props.id || "",
        routeId: isAddMode ? "" : threshold.route_id,
        label: isAddMode ? "" : threshold.label,
        ruleMeasurementType: isAddMode ? "" : threshold.rule.type,
        ruleWhenCron: isAddMode ? "" : threshold.rule.when.cron,
        customCron: "",
        ruleWhenBetweenFrom: "",
        ruleWhenBetweenTo: "",
        ruleWhenSuccessiveTime: 0,
        min: !isAddMode && threshold.rule.do.value.min !== undefined,
        minValue: isAddMode ? 0 : threshold.rule.do.value.min || minLimit,
        max: !isAddMode && threshold.rule.do.value.max !== undefined,
        maxValue: isAddMode ? 0 : threshold.rule.do.value.max || maxLimit
    };

    const [routeOptions, setRouteOptions] = useState([]);
    useEffect(() => {
        // Get tenant options
        if (isAddMode) {
            apiServiceV2.get("v2/tenants/children").then(response => {
                const respTenants = response.tenants_new || [];

                const tenantsOptionsR = respTenants.map(tenant => {
                    return { id: tenant.id, name: tenant.name };
                });
                setTenantsOptions(tenantsOptionsR);
            });
        } else {
            setTenantsOptions([{ id: threshold.tenant.id, name: threshold.tenant.name }]);
        }
        apiService.get("route", 100, 0).then(response => {
            let routes = [];
            if (response.routes != undefined) {
                response.routes.forEach(function(route) {
                    routes.push({
                        id: route.id,
                        name: route.label
                    });
                });
            }
            setRouteOptions(routes);
        });
    }, []);

    const classes = useStyles();

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
    };

    const validationSchema = Yup.object().shape({
        label: Yup.string().required("Label is required"),
        ruleMeasurementType: Yup.string().required("Type is required"),
        ruleWhenCron: Yup.string().required("When is required"),
        customCron: Yup.string().when("ruleWhenCron", {
            is: "custom",
            then: Yup.string().required("Custom cron is required")
        }),
        ruleWhenSuccessiveTime: Yup.number()
            .min(0, "Must be greather or equal than 0")
            .default(0)
            .typeError("Must be a valid number"),
        minValue: Yup.number()
            .min(-100, `Must be greather or equal than -100`)
            .default(0)
            .typeError("Must be a valid number")
            .when("ruleMeasurementType", {
                is: val => val !== "geofences",
                then: Yup.number().required("Min value is required")
            })
            .when(["ruleMeasurementType", "max"], {
                is: (ruleMeasurementType, max) => ruleMeasurementType !== "geofences" && max,
                then: Yup.number().lessThan(Yup.ref("maxValue"), "Must be less than Max value")
            }),
        maxValue: Yup.number()
            .min(-100, `Must be less or equal than 100`)
            .default(0)
            .typeError("Must be a valid number")
            .when("ruleMeasurementType", {
                is: val => val !== "geofences",
                then: Yup.number().required("Max value is required")
            })
            .when(["ruleMeasurementType", "min"], {
                is: (ruleMeasurementType, min) => ruleMeasurementType !== "geofences" && min,
                then: Yup.number().moreThan(Yup.ref("minValue"), "Must be greater than Min value")
            })
    });

    const createThresholdObject = values => {
        const ruleValues = {};

        if (values.min) ruleValues["min"] = parseFloat(values.minValue);

        if (values.max) {
            ruleValues["max"] = parseFloat(values.maxValue);
        }

        const rule = {
            type: values.ruleMeasurementType,
            do: {
                value: ruleValues
            },
            when: {
                cron: values.ruleWhenCron !== "custom" ? values.ruleWhenCron : values.customCron,
                successive_time: values.ruleWhenSuccessiveTime * 60
            },
            what:
                typeof threshold.rule !== "undefined" && typeof threshold.rule.what !== "undefined"
                    ? threshold.rule.what
                    : []
        };

        let obj = {
            label: values.label
        };

        if (values.ruleMeasurementType === "geofences") {
            obj["route_id"] = parseInt(values.routeId);
            rule["geofences"] = geofences;
        }

        obj["rule"] = JSON.stringify(rule);

        if (typeof values.id !== "undefined") {
            obj["id"] = values.id;
        }
        return obj;
    };

    const save = (fields, { setSubmitting, resetForm }) => {
        let threshold = createThresholdObject(fields);
        setBlocking(true);
        let method = isAddMode ? "save" : "update";
        let msgSuccess = isAddMode
            ? intl.formatMessage({ id: "THRESHOLD.CREATED" })
            : intl.formatMessage({ id: "THRESHOLD.UPDATED" });

        if (isAddMode) {
            threshold["id"] = 0;
            threshold["tenant_id"] = parseInt(fields.tenant.id);
        } else {
            threshold["id"] = parseInt(threshold["id"]);
        }

        console.log(threshold);

        thresholdServiceV2[method](threshold)
            .then(response => {
                toaster.notify("success", msgSuccess);
                threshold.rule = JSON.parse(threshold.rule);
                onThresholdChange(threshold);
                if (isAddMode) {
                    resetForm(initialValues);
                }
            })
            .catch(err => {
                toaster.notify("error", err.data.detail);
            })
            .finally(() => {
                setBlocking(false);
                setSubmitting(false);
            });
    };

    const addThresholdToAllAssets = () => {
        apiServiceV2
            .post("v2/operations/thresholds/" + thresholdId + "/assets", undefined)
            .then(response => {
                toaster.notify("success", "Success");
            })
            .catch(err => {
                toaster.notify("error", err.data.detail);
            });
    };

    const removeThresholdToAllAssets = () => {
        apiServiceV2
            .post("v2/operations/thresholds/" + thresholdId + "/assets", undefined)
            .then(response => {
                toaster.notify("success", "Success");
            })
            .catch(err => {
                toaster.notify("error", err.data.detail);
            });
    };

    return (
        <BlockUi tag="div" blocking={blocking}>
            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, { setStatus, setSubmitting, resetForm }) => {
                    save(values, {
                        setSubmitting,
                        resetForm
                    });
                }}
            >
                {({ isValid, getFieldProps, errors, touched, isSubmitting, setFieldValue, handleSubmit, values }) => {
                    return (
                        <form className="card card-custom" onSubmit={handleSubmit}>
                            {/* begin::Header */}
                            <div className={`card-header py-3 ` + classes.headerMarginTop}>
                                <div className="card-title align-items-start flex-column">
                                    <h3 className="card-label font-weight-bolder text-dark">Threshold Information</h3>
                                    {typeof thresholdId !== "undefined" && (
                                        <span className="text-muted font-weight-bold font-size-sm mt-1">
                                            Change information about the thresholds
                                        </span>
                                    )}
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
                                    <Link to="/thresholds/list" className="btn btn-secondary">
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
                                            <ErrorMessage
                                                name="tenant_id"
                                                component="div"
                                                className="invalid-feedback"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-xl-6 col-lg-6">
                                            <label>Label</label>
                                            <div>
                                                <Field
                                                    as="input"
                                                    className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                        { errors, touched },
                                                        "label"
                                                    )}`}
                                                    name="label"
                                                    placeholder="Threshold Label"
                                                    {...getFieldProps("label")}
                                                />
                                                <ErrorMessage
                                                    name="name"
                                                    component="div"
                                                    className="invalid-feedback"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-xl-3 col-lg-3">
                                            <label>Type</label>
                                            <Field
                                                as="select"
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                    { errors, touched },
                                                    "ruleMeasurementType"
                                                )}`}
                                                name="ruleMeasurementType"
                                                placeholder=""
                                                {...getFieldProps("ruleMeasurementType")}
                                            >
                                                <option key="" value=""></option>
                                                {ruleTypeOptions.map(e => {
                                                    return (
                                                        <option key={e.id} value={e.id}>
                                                            {e.name}
                                                        </option>
                                                    );
                                                })}
                                            </Field>
                                            <ErrorMessage
                                                name="ruleMeasurementType"
                                                component="div"
                                                className="invalid-feedback"
                                            />
                                        </div>
                                        <div
                                            className={`col-xl-3 col-lg-3 ${
                                                values.ruleMeasurementType === "geofences" ? "hide" : ""
                                            }`}
                                        >
                                            <div className={`mt-10 `}>
                                                <div className="form-check form-check-inline">
                                                    <Field className="form-check-input" name="min" type="checkbox" />
                                                    <label
                                                        htmlFor="min"
                                                        className='form-check-label"'
                                                        style={{ marginTop: "5px" }}
                                                    >
                                                        {" "}
                                                        Min
                                                    </label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <Field className="form-check-input" name="max" type="checkbox" />
                                                    <label
                                                        htmlFor="max"
                                                        className='form-check-label"'
                                                        style={{ marginTop: "5px" }}
                                                    >
                                                        Max
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className={`col-xl-3 col-lg-3 ${
                                                values.ruleMeasurementType === "geofences" ? "" : "hide"
                                            }`}
                                        >
                                            <label>Route</label>
                                            <Field
                                                as="select"
                                                value={values["routeId"] || 0}
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                    { errors, touched },
                                                    "routeId"
                                                )}`}
                                                name="routeId"
                                                placeholder=""
                                                {...getFieldProps("routeId")}
                                            >
                                                <option key="" value=""></option>
                                                {routeOptions.map(e => {
                                                    return (
                                                        <option key={e.id} value={e.id}>
                                                            {e.name}
                                                        </option>
                                                    );
                                                })}
                                            </Field>
                                            <ErrorMessage name="route" component="div" className="invalid-feedback" />
                                        </div>
                                    </div>

                                    <div
                                        className={
                                            "form-group row " +
                                            ((!values.max && !values.min) || values.ruleMeasurementType === "geofences"
                                                ? "hide"
                                                : "")
                                        }
                                    >
                                        <div className={"row col-xl-6 col-lg-6 " + (!values.min ? "hide" : "")}>
                                            <div className="col-xl-3 col-lg-3">
                                                <label>Min</label>
                                                <Field
                                                    as="input"
                                                    className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                        { errors, touched },
                                                        "minValue"
                                                    )}`}
                                                    name="minValue"
                                                    {...getFieldProps("minValue")}
                                                />
                                                <ErrorMessage
                                                    name="minValue"
                                                    component="div"
                                                    className="invalid-feedback"
                                                />
                                            </div>
                                            <div className="col-xl-9 col-lg-9">
                                                <RangeSlider
                                                    className="mt-8"
                                                    name="rangeMinValue"
                                                    value={values["minValue"]}
                                                    onChange={e => setFieldValue("minValue", e.target.value)}
                                                    min={minLimit}
                                                    max={maxLimit}
                                                    tooltipLabel={currentValue => `${currentValue}${ruleCurrentSymbol}`}
                                                />
                                            </div>
                                        </div>
                                        <div className={"row col-xl-6 col-lg-6 " + (!values.max ? "hide" : "")}>
                                            <div className="col-xl-3 col-lg-3">
                                                <label>Max</label>
                                                <Field
                                                    as="input"
                                                    className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                        { errors, touched },
                                                        "maxValue"
                                                    )}`}
                                                    name="maxValue"
                                                    {...getFieldProps("maxValue")}
                                                />
                                                <ErrorMessage
                                                    name="maxValue"
                                                    component="div"
                                                    className="invalid-feedback"
                                                />
                                            </div>
                                            <div className="col-xl-9 col-lg-9">
                                                <RangeSlider
                                                    className="mt-8"
                                                    name="rangeMaxValue"
                                                    value={values["maxValue"]}
                                                    onChange={e => setFieldValue("maxValue", e.target.value)}
                                                    min={minLimit}
                                                    max={maxLimit}
                                                    tooltipLabel={currentValue => `${currentValue}${ruleCurrentSymbol}`}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className={"form-group row"}>
                                        <div className={`col-xl-3 col-lg-3`}>
                                            <label>When</label>
                                            <Field
                                                as="select"
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                    { errors, touched },
                                                    "ruleWhenCron"
                                                )}`}
                                                name="ruleWhenCron"
                                                {...getFieldProps("ruleWhenCron")}
                                            >
                                                <option key="" value="" />
                                                {ruleWhenCronsOptions.map(e => {
                                                    return (
                                                        <option key={e.id} value={e.id}>
                                                            {e.name}
                                                        </option>
                                                    );
                                                })}
                                            </Field>
                                            <ErrorMessage
                                                name="ruleWhenCron"
                                                component="div"
                                                className="invalid-feedback"
                                            />
                                        </div>
                                        <div
                                            className={`col-xl-3 col-lg-3 ${
                                                values.ruleWhenCron !== "custom" ? "hide" : ""
                                            }`}
                                        >
                                            <label>Custom cron</label>
                                            <Field
                                                as="input"
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                    { errors, touched },
                                                    "customCron"
                                                )}`}
                                                name="customCron"
                                                {...getFieldProps("customCron")}
                                            />
                                            <ErrorMessage
                                                name="customCron"
                                                component="div"
                                                className="invalid-feedback"
                                            />
                                        </div>
                                        <div className={`col-xl-2 col-lg-2`}>
                                            <label>Start time</label>
                                            <input
                                                type="time"
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                    { errors, touched },
                                                    "ruleWhenBetweenFrom"
                                                )}`}
                                                name="ruleWhenBetweenFrom"
                                                {...getFieldProps("ruleWhenBetweenFrom")}
                                            />
                                            <ErrorMessage
                                                name="ruleWhenBetweenFrom"
                                                component="div"
                                                className="invalid-feedback"
                                            />
                                        </div>
                                        <div className={`col-xl-2 col-lg-2`}>
                                            <label>End time</label>
                                            <input
                                                type="time"
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                    { errors, touched },
                                                    "ruleWhenBetweenTo"
                                                )}`}
                                                name="ruleWhenBetweenTo"
                                                {...getFieldProps("ruleWhenBetweenTo")}
                                            />
                                            <ErrorMessage
                                                name="ruleWhenBetweenTo"
                                                component="div"
                                                className="invalid-feedback"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <div className={`col-xl-3 col-lg-3`}>
                                            <label>Persistence (minutes)</label>
                                            <Field
                                                as="input"
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                    { errors, touched },
                                                    "ruleWhenSuccessiveTime"
                                                )}`}
                                                name="ruleWhenSuccessiveTime"
                                                {...getFieldProps("ruleWhenSuccessiveTime")}
                                            />
                                            <ErrorMessage
                                                name="ruleWhenSuccessiveTime"
                                                component="div"
                                                className="invalid-feedback"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* end::Form */}
                        </form>
                    );
                }}
            </Formik>

            {typeof thresholdId !== "undefined" && (
                <div className={`card-header py-3 ` + classes.headerMarginTop}>
                    <div className="card-title align-items-start flex-column">
                        <h3 className="card-label font-weight-bolder text-dark">Threshold Operations</h3>
                    </div>
                    <div className="card-toolbar">
                        <div>
                            <button onClick={addThresholdToAllAssets} className="btn btn-warning mr-2">
                                Add Threshold To All My Assets
                            </button>
                            <button onClick={removeThresholdToAllAssets} className="btn btn-danger mr-2">
                                Remove Threshold From All My Assets
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </BlockUi>
    );
}

export default injectIntl(ThresholdFormComponent);
