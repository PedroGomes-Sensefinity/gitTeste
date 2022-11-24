import DoneIcon from "@material-ui/icons/Done";
import { makeStyles } from "@material-ui/styles";
import { ErrorMessage, Field, Formik } from "formik";
import { flatMap } from "lodash";
import React, { useEffect, useState } from "react";
import BlockUi from "react-block-ui";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import { injectIntl } from "react-intl";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import apiService from "../../services/apiService";
import apiServiceV2 from "../../services/v2/apiServiceV2";
import assetsServiceV2 from "../../services/v2/assetsServiceV2";
import { getInputClasses } from "../../utils/formik";
import toaster from "../../utils/toaster";
import "../../utils/yup-validations";

const useStyles = makeStyles(theme => ({
    headerMarginTop: {
        marginTop: theme.spacing(5)
    }
}));

function AssetsFormComponent(props) {
    const [ruleTypeOptions, setRuleTypeOptions] = useState([{ id: 1, name: "No Types", type: "NA" }]);
    const isAddMode = !props.id;
    const [blocking, setBlocking] = useState(false);
    const [loading, setLoading] = useState(false);

    const [thresholds, setThresholds] = useState([]);
    const [selectedThresholds, setSelectedThresholds] = useState([]);

    const initialValues = props.asset || {
        id: 0,
        label: "",
        description: "",
        asset_type: { id: 1 },
        devices: [],
        weight: 0.0,
        type: []
    };

    useEffect(() => {
        apiServiceV2.get("v2/assets/types").then(response => {
            const respAssetTypes = response.asset_types || [];

            const ruleTypeOptions = respAssetTypes.map(assetType => {
                return { id: assetType.id, name: assetType.label, type: assetType.type };
            });
            setRuleTypeOptions(ruleTypeOptions);
        });

        if (props.asset !== undefined) {
            props.asset.threshold_ids.forEach(id => {
                apiService.getById("threshold", id).then(response => {
                    const thresholdsSelected = selectedThresholds;
                    thresholdsSelected.push(response.thresholds[0]);
                    setSelectedThresholds([...thresholdsSelected]);
                });
            });
        }
    }, []);

    const onChangeThreshold = opt => {
        setSelectedThresholds(opt);
    };

    const handleSearchThreshold = query => {
        setLoading(true);

        apiService.getByText("threshold", query, 100, 0).then(response => {
            const thresholds =
                typeof response.thresholds !== undefined && Array.isArray(response.thresholds)
                    ? filterThresholdSelected(response.thresholds)
                    : [];

            setThresholds(thresholds);
            setLoading(false);
        });
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

    const filterBy = () => true;

    const onlyLetters = str => {
        return /^[a-zA-Z]+$/.test(str);
    };

    const validateLabel = value => {
        let error;
        let type;

        ruleTypeOptions.forEach(function(options) {
            if (options["id"] === initialValues.asset_type.id) {
                type = options["type"];
            }
        });
        if (type === "Container") {
            if (value.length !== 13) {
                error = "Invalid Label - Size Incorrect (e.g: AAAA 111111-2)";
                return error;
            }
            let string4 = value.substring(0, 4);
            if (!onlyLetters(string4)) {
                error =
                    "Invalid Label - Please enter only letters for Owner Code and Product Group Code (e.g: AAAA 111111-2)";
                return error;
            }
            let string6 = value.substring(5, 11);
            let isnum = /^\d+$/.test(string6);
            if (!isnum) {
                error = "Invalid Label - Please enter only numbers on Serial Number (e.g: AAAA 111111-2)";
                return error;
            }
            let string2 = value.substring(12, 14);
            let isnum2 = /^\d+$/.test(string2);
            if (!isnum2) {
                error = "Invalid Label - Please enter only numbers on Check Digits (e.g: AAAA 111111-2)";
                return error;
            }
            let stringSpecialChar = value.substring(11, 12);
            if (stringSpecialChar !== "-") {
                error = 'Invalid Label - Special character must be "-" (e.g: AAAA 111111-2)';
                return error;
            }
            let stringSpace = value.substring(4, 5);
            if (stringSpace !== " ") {
                error =
                    "Invalid Label - You need to add a Space between Owner Code and Serial Number (e.g: AAAA 111111-2)";
                return error;
            }
        }
        return error;
    };

    const validateAssetType = value => {
        let error;
        if (value === undefined || value === "" || value === 0 || isNaN(value)) {
            error = "Select Asset Type";
            return error;
        }
        return error;
    };

    const validationSchema = Yup.object().shape({
        label: Yup.string().required("Label is required")
    });

    const classes = useStyles();

    const save = (fields, { setFieldValue, setSubmitting, _ }) => {
        setBlocking(true);
        setSubmitting(true);

        let method = isAddMode ? "save" : "update";
        let msgSuccess = isAddMode
            ? props.intl.formatMessage({ id: "ASSETS.CREATED" })
            : props.intl.formatMessage({ id: "ASSETS.UPDATED" });

        fields["threshold_ids"] = selectedThresholds.map(t => t.id);
        fields["asset_type_id"] = fields.asset_type.id;
        assetsServiceV2[method](fields)
            .then(response => {
                toaster.notify("success", msgSuccess);

                setSubmitting(false);
                setBlocking(false);

                if (isAddMode) {
                    setFieldValue("label", "", false);
                    setFieldValue("description", "", false);
                    setFieldValue("devices", [], false);
                    setSelectedThresholds([])
                }
            })
            .catch(err => {
                console.log(err)
                toaster.notify("error", err.status);
                setSubmitting(false);
                setBlocking(false);
            });
    };

    return (
        <BlockUi tag="div" blocking={blocking}>
            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, { setFieldValue, setSubmitting, resetForm }) => {
                    values.asset_type.id = Number(values.asset_type.id);
                    if (values.asset_type.id === 0) {
                        values.asset_type.id = 1;
                    }
                    save(values, {
                        setFieldValue,
                        setSubmitting,
                        resetForm
                    });
                }}
            >
                {({ isValid, getFieldProps, errors, touched, isSubmitting, handleSubmit }) => (
                    <form className="card card-custom" onSubmit={handleSubmit}>
                        {/* begin::Header */}
                        <div className={`card-header py-3 ` + classes.headerMarginTop}>
                            <div className="card-title align-items-start flex-column">
                                <h3 className="card-label font-weight-bolder text-dark">Asset Information</h3>
                                <span className="text-muted font-weight-bold font-size-sm mt-1">
                                    Change general configurations about board family
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
                                <Link to="/assets/list" className="btn btn-secondary">
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
                                        <label className={`required`}>Type</label>
                                        <Field
                                            validate={validateAssetType}
                                            type={"number"}
                                            as="select"
                                            className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                { errors, touched },
                                                "asset_type_id"
                                            )}`}
                                            name="asset_type_id"
                                            placeholder=""
                                            {...getFieldProps("asset_type.id")}
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
                                            name="asset_type_id"
                                            component="div"
                                            className="invalid-feedback"
                                        />
                                    </div>

                                    <div className="col-xl-6 col-lg-6">
                                        <label className={`required`}>Label</label>
                                        <Field
                                            validate={validateLabel}
                                            as="input"
                                            className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                { errors, touched },
                                                "label"
                                            )}`}
                                            name="label"
                                            placeholder="Set the asset label"
                                            {...getFieldProps("label")}
                                        />
                                        <ErrorMessage name="label" component="div" className="invalid-feedback" />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <div className="col-xl-6 col-lg-6">
                                        <label>Weight</label>
                                        <Field
                                            type={"number"}
                                            as="input"
                                            className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                { errors, touched },
                                                "label"
                                            )}`}
                                            name="weight"
                                            placeholder="Set the asset Weight"
                                            {...getFieldProps("weight")}
                                        />
                                        <ErrorMessage name="weight" component="div" className="invalid-feedback" />
                                    </div>

                                    <div className="col-xl-6 col-lg-6">
                                        <label>Description</label>
                                        <Field
                                            as="textarea"
                                            rows="3"
                                            className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                { errors, touched },
                                                "description"
                                            )}`}
                                            name="description"
                                            placeholder="Set the description"
                                            {...getFieldProps("description")}
                                        />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <div className="col-xl-12 col-lg-12">
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
                                                onSearch={handleSearchThreshold}
                                                selected={selectedThresholds}
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
                    </form>
                )}
            </Formik>
        </BlockUi>
    );
}

export default injectIntl(AssetsFormComponent);
