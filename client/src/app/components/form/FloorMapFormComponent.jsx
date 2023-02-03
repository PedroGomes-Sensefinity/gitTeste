import React, { useEffect, useState } from "react";
import { ErrorMessage, Field, Formik, FieldArray } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/styles";
import floorMapService from "../../services/floorMapService";
import DoneIcon from "@material-ui/icons/Done";
import { getInputClasses } from "../../utils/formik";
import "../../utils/yup-validations";
import BlockUi from "react-block-ui";
import toaster from "../../utils/toaster";
import { injectIntl } from "react-intl";
import ImageMarker from "react-image-marker";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import apiServiceV2 from "../../services/v2/apiServiceV2";

const useStyles = makeStyles(theme => ({
    headerMarginTop: {
        marginTop: theme.spacing(5)
    }
}));

// Market to Show Anchors
const CustomMarker = props => {
    return (
        <p style={{ backgroundColor: "green", color: "white", borderRadius: "50%", fontSize: "20px" }}>
            {" "}
            A{props.itemNumber}
        </p>
    );
};

//Upload vars
const FILE_SIZE = 2; // MB
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/svg", "image/png"];

function FloorMapFormComponent(props) {
    const intl = props.intl;
    const floorMapId = props.id;
    const isAddMode = !props.id;
    const [floorMapInfo, setFloorMap] = useState({});
    const [blocking, setBlocking] = useState(false);
    const classes = useStyles();
    const [image, setImage] = useState(undefined);
    const [markers, setMarkers] = useState([]);

    //Devices:
    const [devicesSearch, setDevicesSearch] = useState([]);

    useEffect(() => {}, []);

    const handleSearchDevice = query => {
        apiServiceV2.getByLimitOffsetSearchTenant("v2/devices", 50, 0, query, 1).then(response => {
            const respDevices = response.devices || [];
            console.log(respDevices)
            setDevicesSearch(respDevices);
        });
    };

    const filterBy = () => true;

    const initialValues = {
        id: floorMapId,
        label: floorMapInfo.label || "",
        description: floorMapInfo.description || "",
        length: floorMapInfo.length || 0,
        width: floorMapInfo.width || 0,
        path_loss: floorMapInfo.path_loss || 0,
        environment_constant: floorMapInfo.environment_constant || 0,
        anchors: floorMapInfo.anchors || []
    };

    const validationSchema = Yup.object().shape({
        label: Yup.string()
            .max(50)
            .required("Label is required"),
        length: Yup.number()
            .min(1)
            .required("This field is required"),
        width: Yup.number()
            .min(1)
            .required("This field is required"),
        path_loss: Yup.number()
            .min(0)
            .max(5)
            .required("This field is required"),
        environment_constant: Yup.number()
            .min(1)
            .required("This field is required"),
        description: Yup.string().max(255, "Description is too long. Max 255 characters.")
    });

    const save = (fields, { setSubmitting, resetForm }) => {
        setBlocking(true);
        let method = isAddMode ? "save" : "update";
        if (image === undefined || image === "") {
            toaster.notify("error", "You need to upload a floor map!");
            setBlocking(false);
            return;
        }
        fields["attachment_url"] = image;
        console.log(JSON.stringify(fields));
        setBlocking(false);
    };

    const upload = (file, { setFieldValue }) => {
        if (file.size / 1024 / 1024 > FILE_SIZE) {
            toaster.notify("error", intl.formatMessage({ id: "FLOORMAP.FILE_TOO_LARGE" }));
            return false;
        }

        if (!SUPPORTED_FORMATS.includes(file.type)) {
            toaster.notify("error", intl.formatMessage({ id: "FLOORMAP.FILE_INVALID_FORMAT" }));
            return false;
        }
        setBlocking(true);
        let data = new FormData();
        data.append("file", file);

        floorMapService.upload(data).then(r => {
            console.log(r.detail);
            setImage(r.detail);
            setBlocking(false);
        });
    };

    const addAnchorsToMap = values => {
        if (values.length === 0 || values.width === 0) {
            toaster.notify("error", "You need to set Length and Width first!");
            return;
        }
        const markers = [];
        values.anchors.forEach(element =>
            markers.push({ top: (element.x * 100) / values.length - 1, left: (element.y * 100) / values.width - 1 })
        );
        setMarkers(markers);
        console.log(markers);
    };

    return (
        <BlockUi tag="div" blocking={blocking}>
            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    save(values, { setSubmitting, resetForm });
                }}
            >
                {({
                    isValid,
                    getFieldProps,
                    errors,
                    values,
                    touched,
                    isSubmitting,
                    handleSubmit,
                    setFieldValue,
                    resetForm
                }) => {
                    return (
                        <form className="card card-custom" onSubmit={handleSubmit}>
                            {/* begin::Header */}
                            <div className={`card-header py-3 ` + classes.headerMarginTop}>
                                <div className="card-title align-items-start flex-column">
                                    <h3 className="card-label font-weight-bolder text-dark">Floor map Information</h3>
                                    <span className="text-muted font-weight-bold font-size-sm mt-1">
                                        Create Or Edit Floor Map
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
                                    <Link to="/floor-maps/list" className="btn btn-secondary">
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
                                            <div>
                                                <Field
                                                    as="input"
                                                    className={`form-control form-control-lg form-control-solid required ${getInputClasses(
                                                        { errors, touched },
                                                        "label"
                                                    )}`}
                                                    name="label"
                                                    placeholder="Set the Floor map label"
                                                    {...getFieldProps("label")}
                                                />
                                                <ErrorMessage
                                                    name="label"
                                                    component="div"
                                                    className="invalid-feedback"
                                                />
                                            </div>
                                        </div>

                                        <div className="col-xl-6 col-lg-6">
                                            <label>Description</label>
                                            <Field
                                                as="textarea"
                                                rows="2"
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                    { errors, touched },
                                                    "description"
                                                )}`}
                                                name="description"
                                                placeholder="Set the description"
                                                {...getFieldProps("description")}
                                            />
                                            <ErrorMessage
                                                name="description"
                                                component="div"
                                                className="invalid-feedback"
                                            />
                                        </div>

                                        <div className="col-xl-12 col-lg-12">
                                            <label>Floor map</label>
                                            <input
                                                id="plant"
                                                name="plant"
                                                type="file"
                                                accept={SUPPORTED_FORMATS.join(",")}
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                    { errors, touched },
                                                    "plant"
                                                )}`}
                                                onChange={event =>
                                                    upload(event.currentTarget.files[0], { setFieldValue })
                                                }
                                            />
                                            <span>Max file size: {FILE_SIZE}MB</span>
                                            <ErrorMessage name="plant" component="div" className="invalid-feedback" />
                                        </div>

                                        <div
                                            style={{ padding: "30px" }}
                                            className="card-title align-items-start flex-column col-xl-12 col-lg-12"
                                        >
                                            <h3 className="card-label font-weight-bolder text-dark">
                                                Floor map Characterization
                                            </h3>
                                            <span className="text-muted font-weight-bold font-size-sm mt-1">
                                                This information will be used to increase accuracy!
                                            </span>
                                        </div>
                                        <div className="col-xl-3 col-lg-3">
                                            <label className={`required`}>Length</label>
                                            <div>
                                                <Field
                                                    as="input"
                                                    className={`form-control form-control-lg form-control-solid required ${getInputClasses(
                                                        { errors, touched },
                                                        "length"
                                                    )}`}
                                                    name="length"
                                                    placeholder="Set the Floor map Length"
                                                    {...getFieldProps("length")}
                                                />
                                                <ErrorMessage
                                                    name="length"
                                                    component="div"
                                                    className="invalid-feedback"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-xl-3 col-lg-3">
                                            <label className={`required`}>Width</label>
                                            <div>
                                                <Field
                                                    as="input"
                                                    className={`form-control form-control-lg form-control-solid required ${getInputClasses(
                                                        { errors, touched },
                                                        "width"
                                                    )}`}
                                                    name="label"
                                                    placeholder="Set the Floor map width"
                                                    {...getFieldProps("width")}
                                                />
                                                <ErrorMessage
                                                    name="width"
                                                    component="div"
                                                    className="invalid-feedback"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-xl-3 col-lg-3">
                                            <label className={`required`}>Path Loss (n) (0-5)</label>
                                            <div>
                                                <Field
                                                    as="input"
                                                    className={`form-control form-control-lg form-control-solid required ${getInputClasses(
                                                        { errors, touched },
                                                        "path_loss"
                                                    )}`}
                                                    name="path_loss"
                                                    placeholder="Set the Floor map Path Loss"
                                                    {...getFieldProps("path_loss")}
                                                />
                                                <ErrorMessage
                                                    name="path_loss"
                                                    component="div"
                                                    className="invalid-feedback"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-xl-3 col-lg-3">
                                            <label className={`required`}>Environment Constant (C)</label>
                                            <div>
                                                <Field
                                                    as="input"
                                                    className={`form-control form-control-lg form-control-solid required ${getInputClasses(
                                                        { errors, touched },
                                                        "environment_constant"
                                                    )}`}
                                                    name="environment_constant"
                                                    placeholder="Set the Floor map Environment Constant"
                                                    {...getFieldProps("environment_constant")}
                                                />
                                                <ErrorMessage
                                                    name="environment_constant"
                                                    component="div"
                                                    className="invalid-feedback"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {image != undefined && (
                                <ImageMarker src={image} markers={markers} markerComponent={CustomMarker} />
                            )}
                            {/* end::Form */}
                            {/* begin::Form */}
                            <div className="form">
                                <div className="card-body">
                                    <div className="form-group row">
                                        <div className="col-xl-12 col-lg-12">
                                            <FieldArray name="anchors">
                                                {({ insert, remove, push }) => (
                                                    <div>
                                                        {values.anchors.length > 0 &&
                                                            values.anchors.map((notification, index) => (
                                                                <div className="row" key={index}>
                                                                    <div className="col-xl-2 col-lg-2">
                                                                        <label htmlFor={`anchors.${index}.label`}>
                                                                            Label
                                                                        </label>
                                                                        <Field
                                                                            className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                                                { errors, touched },
                                                                                "anchors.label"
                                                                            )}`}
                                                                            name={`anchors.${index}.label`}
                                                                            placeholder="Label"
                                                                            type="text"
                                                                        />
                                                                        <ErrorMessage
                                                                            name={`anchors.${index}.label`}
                                                                            component="div"
                                                                            className="field-error"
                                                                        />
                                                                    </div>
                                                                    <div className="col-xl-2 col-lg-2">
                                                                        <label htmlFor={`anchors.${index}.description`}>
                                                                            Description
                                                                        </label>
                                                                        <Field
                                                                            className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                                                { errors, touched },
                                                                                "anchors.description"
                                                                            )}`}
                                                                            name={`anchors.${index}.description`}
                                                                            placeholder="Description"
                                                                            type="text"
                                                                        />
                                                                        <ErrorMessage
                                                                            name={`anchors.${index}.description`}
                                                                            component="div"
                                                                            className="field-error"
                                                                        />
                                                                    </div>
                                                                    <div className="col-xl-3 col-lg-3">
                                                                        <label htmlFor={`anchors.${index}.device_id`}>
                                                                            Device
                                                                        </label>
                                                                        <AsyncTypeahead
                                                                                                                                                id={`anchors.${index}.device_id`}
                                                                           
                                                                            labelKey="label"
                                                                            size="lg"
                                                                            onChange={e => {
                                                                                if (e[0] != undefined) {
                                                                                    values.anchors[index].device_id =
                                                                                        e[0].id;
                                                                                }
                                                                            }}
                                                                            options={devicesSearch}
                                                                            placeholder=""
                                                                            onSearch={handleSearchDevice}
                                                                            filterBy={filterBy}
                                                                            useCache={false}
                                                                        />
                                                                    </div>
                                                                    <div className="col-xl-1 col-lg-1">
                                                                        <label htmlFor={`anchors.${index}.x`}>X</label>
                                                                        <Field
                                                                            className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                                                { errors, touched },
                                                                                "anchors.x"
                                                                            )}`}
                                                                            name={`anchors.${index}.x`}
                                                                            type="number"
                                                                        />
                                                                        <ErrorMessage
                                                                            name={`anchors.${index}.x`}
                                                                            component="div"
                                                                            className="field-error"
                                                                        />
                                                                    </div>
                                                                    <div className="col-xl-1 col-lg-1">
                                                                        <label htmlFor={`anchors.${index}.y`}>Y</label>
                                                                        <Field
                                                                            className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                                                { errors, touched },
                                                                                "anchors.y"
                                                                            )}`}
                                                                            name={`anchors.${index}.y`}
                                                                            type="number"
                                                                        />
                                                                        <ErrorMessage
                                                                            name={`anchors.${index}.y`}
                                                                            component="div"
                                                                            className="field-error"
                                                                        />
                                                                    </div>
                                                                    <div className="col-xl-1 col-lg-1">
                                                                        <label htmlFor={`anchors.${index}.z`}>Z</label>
                                                                        <Field
                                                                            className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                                                { errors, touched },
                                                                                "anchors.z"
                                                                            )}`}
                                                                            name={`anchors.${index}.z`}
                                                                            type="number"
                                                                        />
                                                                        <ErrorMessage
                                                                            name={`anchors.${index}.z`}
                                                                            component="div"
                                                                            className="field-error"
                                                                        />
                                                                    </div>
                                                                    <div
                                                                        className="col-xl-1 col-lg-1"
                                                                        style={{ display: "flex", margin: "1px" }}
                                                                    >
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-secondary"
                                                                            onClick={() => remove(index)}
                                                                        >
                                                                            Remove Anchor
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        <button
                                                            type="button"
                                                            style={{ margin: "20px" }}
                                                            className="btn btn-success mr-2"
                                                            onClick={() => push({ label: "", x: 0, y: 0, z: 0 })}
                                                        >
                                                            Add Anchor
                                                        </button>
                                                        <button
                                                            type="button"
                                                            style={{ margin: "20px" }}
                                                            className="btn btn-success mr-2"
                                                            onClick={() => addAnchorsToMap(values)}
                                                        >
                                                            Visualize Anchors On Map
                                                        </button>
                                                    </div>
                                                )}
                                            </FieldArray>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* end::Form */}
                        </form>
                    );
                }}
            </Formik>
        </BlockUi>
    );
}

export default injectIntl(FloorMapFormComponent);
