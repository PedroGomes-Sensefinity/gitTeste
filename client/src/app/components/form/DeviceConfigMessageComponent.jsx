import BuildIcon from "@material-ui/icons/Build";
import DoneIcon from "@material-ui/icons/Done";
import { makeStyles } from "@material-ui/styles";
import { ErrorMessage, Field, Formik } from "formik";
import React, { useEffect, useState } from "react";
import BlockUi from "react-block-ui";
import { Button, Container, Modal } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import { MdContentCopy } from "react-icons/all";
import { injectIntl } from "react-intl";
import * as Yup from "yup";
import apiService from "../../services/apiService";
import boardFamilyTemplatesService from "../../services/boardFamilyTemplatesService";
import deviceService from "../../services/deviceService";
import { getInputClasses } from "../../utils/formik";
import toaster from "../../utils/toaster";
import { useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";

const useStyles = makeStyles(theme => ({
    headerMarginTop: {
        marginTop: theme.spacing(5)
    }
}));

function DeviceConfigMessageComponent(props) {
    const intl = props.intl;
    const { deviceId: deviceId } = useOutletContext()
    const [templates, setTemplates] = useState([]);
    const [pendingConfigMessages, setPendingConfigMessages] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [blocking, setBlocking] = useState(false);
    const { permissions } = useSelector(({ auth }) => ({ permissions: auth.permissions }));

    const initialValues = {
        message: ""
    };

    const validationSchema = Yup.object().shape({
        message: Yup.string().required("Message is required")
    });

    useEffect(() => {
        apiService.getById("device", deviceId).then(response => {
            const device = response.devices[0];
            boardFamilyTemplatesService.byBoardFamily(device.board_family_id, 100, 0).then(response => {
                let templates = (response.board_family_templates || []).map(t => {
                    t.version = String(t.version);
                    return t;
                });
                setTemplates(templates);
            });

            loadPendingConfigMessages();
        });
    }, []);

    const sendMessage = (fields, { setFieldValue, setSubmitting }) => {
        setBlocking(true);
        const config = {
            device_id: deviceId,
            message: fields.message
        };

        deviceService.config(JSON.stringify(config)).then(() => {
            toaster.notify("success", intl.formatMessage({ id: "DEVICE.CONFIG_MESSAGE" }));
            setBlocking(false);
            setFieldValue("message", "", false);
            setSubmitting(false);

            loadPendingConfigMessages();
        });
    };

    const onHideModal = () => {
        setModalVisible(false);
    };

    const onChangeTemplate = (data, setFieldValue) => {
        setModalVisible(false);
        setFieldValue("message", data[0].template, false);
    };

    const loadPendingConfigMessages = () => {
        deviceService.getPendingConfig(deviceId).then(data => {
            setPendingConfigMessages(data);
        });
    };

    const copyToClipboard = value => {
        navigator.clipboard.writeText(value);
        toaster.notify("info", intl.formatMessage({ id: "GENERAL.COPY_CLIPBOARD" }));
    };
    const classes = useStyles();

    return (
        <BlockUi tag="div" blocking={blocking}>
            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting, setFieldValue }) => {
                    sendMessage(values, {
                        setFieldValue,
                        setSubmitting
                    });
                }}
            >
                {({ isValid, getFieldProps, errors, touched, isSubmitting, handleSubmit, setFieldValue }) => {
                    return (
                        <form className="card card-custom" onSubmit={handleSubmit}>
                            {/* begin::Header */}
                            <div className={`card-header py-3 ` + classes.headerMarginTop}>
                                <div className="card-title align-items-start flex-column">
                                    <h3 className="card-label font-weight-bolder text-dark">
                                        Device configuration message
                                    </h3>
                                    <span className="text-muted font-weight-bold font-size-sm mt-1">
                                        Change configuration of your device
                                    </span>
                                </div>
                                <div className="card-toolbar">
                                    {permissions.canEditDevices && (
                                        <button
                                            type="submit"
                                            className="btn btn-success mr-2"
                                            disabled={isSubmitting || (touched && !isValid)}
                                        >
                                            <DoneIcon />
                                            Send message
                                            {isSubmitting}
                                        </button>
                                    )}
                                </div>
                            </div>
                            {/* end::Header */}

                            {/* begin::Form */}
                            <div className="form">
                                <div className="card-body">
                                    <div className="form-group row">
                                        <div className="col-xl-6 col-lg-6">
                                            <label>Message</label>
                                            <div>
                                                <Field
                                                    disabled={!permissions.canEditDevices}
                                                    as="textarea"
                                                    rows="7"
                                                    className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                        { errors, touched },
                                                        "message"
                                                    )}`}
                                                    name="message"
                                                    placeholder=""
                                                    {...getFieldProps("message")}
                                                />
                                                <ErrorMessage
                                                    name="message"
                                                    component="div"
                                                    className="invalid-feedback"
                                                />

                                                <div className={"row"}>
                                                    <div className="col-xl-12 col-lg-12 mt-2">
                                                        <Button
                                                            className="btn btn-success"
                                                            onClick={() => setModalVisible(true)}
                                                        >
                                                            <BuildIcon /> Load template
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-4 col-lg-4">
                                            <div className="card card-custom">
                                                <div className="card-header">
                                                    <div className="card-title">
                                                        <h3 className="card-label">Pending config messages</h3>
                                                    </div>
                                                </div>
                                                <div className="card-body">
                                                    {pendingConfigMessages.length > 0 && (
                                                        <table className="table table-bordered table-responsive-sm">
                                                            <thead>
                                                                <tr>
                                                                    <th />
                                                                    <th>Message</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {pendingConfigMessages.map((value, i) => {
                                                                    return (
                                                                        <tr key={i}>
                                                                            <td>
                                                                                <Button
                                                                                    className="btn btn-sm btn-success"
                                                                                    onClick={() =>
                                                                                        copyToClipboard(value.message)
                                                                                    }
                                                                                >
                                                                                    <MdContentCopy />
                                                                                </Button>
                                                                            </td>
                                                                            <td>
                                                                                <span className={"ml-2"}>
                                                                                    {value.message}
                                                                                </span>
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                })}
                                                            </tbody>
                                                        </table>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <FormModalTemplate
                                show={isModalVisible}
                                onHide={onHideModal}
                                onChangeTemplate={data => onChangeTemplate(data, setFieldValue)}
                                options={templates}
                                backdrop="static"
                                keyboard={false}
                            />
                            {/* end::Form */}
                        </form>
                    );
                }}
            </Formik>
        </BlockUi>
    );
}

export default injectIntl(DeviceConfigMessageComponent);

function FormModalTemplate(props) {
    return (
        <Modal {...props} aria-labelledby="contained-modal-title-vcenter">
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">Template</Modal.Title>
            </Modal.Header>
            <Modal.Body className="show-grid">
                <Container>
                    {/* begin::Form */}
                    <div className="form">
                        <div className="form-group row">
                            <div className="col-xl-12 col-lg-12">
                                <label>Template</label>
                                <div>
                                    <Typeahead
                                        id="typeahead-board-family"
                                        labelKey="version"
                                        size="lg"
                                        options={props.options}
                                        clearButton={true}
                                        placeholder=""
                                        filterBy={() => true}
                                        onChange={props.onChangeTemplate}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* end::Form */}
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}
