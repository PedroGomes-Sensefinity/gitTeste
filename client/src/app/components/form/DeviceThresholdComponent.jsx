import DoneIcon from "@material-ui/icons/Done";
import { makeStyles } from "@material-ui/styles";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import BlockUi from "react-block-ui";
import { AsyncTypeahead, Typeahead } from "react-bootstrap-typeahead";
import { injectIntl } from "react-intl";
import * as Yup from "yup";
import apiService from "../../services/apiService";
import deviceThresholdService from "../../services/deviceThresholdService";
import toaster from "../../utils/toaster";
import { useSelector } from "react-redux";

const useStyles = makeStyles(theme => ({
    headerMarginTop: {
        marginTop: theme.spacing(5)
    }
}));

function DeviceThresholdComponent(props) {
    const intl = props.intl;
    const deviceId = props.entity;
    const [selectedThresholds, setSelectedThresholds] = useState([]);
    const selectedThresholdIds = selectedThresholds.map(t => t.id);
    const [thresholdOptions, setThresholdOptions] = useState([]);
    const [selectedGroupThresholds, setSelectedGroupThresholds] = useState([]);
    const [groupThresholdOptions, setGroupThresholdsOptions] = useState([]);
    const [blocking, setBlocking] = useState(false);
    const [loading, setLoading] = useState(false);
    const classes = useStyles();
    const initialValues = {};
    const { permissions } = useSelector(({ auth }) => ({ permissions: auth.permissions }));

    useEffect(() => {
        setBlocking(true);
        deviceThresholdService.getByDevice(deviceId).then(response => {
            if ("group" in response) {
                setSelectedGroupThresholds(response.group);
                setGroupThresholdsOptions(response.group);
            }

            if ("device" in response) {
                const selectedIds = response.device.map(t => t.id);
                setSelectedThresholds(response.device);
                setThresholdOptions(response.device);
            }
            setBlocking(false);
        });
    }, []);

    const validationSchema = Yup.object().shape({});

    const save = setSubmitting => {
        setBlocking(true);

        const config = {
            device_id: deviceId,
            thresholds_id: selectedThresholdIds
        };

        deviceThresholdService.save(JSON.stringify(config)).then(() => {
            toaster.notify("success", intl.formatMessage({ id: "DEVICE.THRESHOLD.SUCCESS" }));
            setBlocking(false);
            setSubmitting(false);
        });
    };

    const onChangeThreshold = opt => {
        setSelectedThresholds(opt);
    };

    const handleSearchThreshold = query => {
        setLoading(true);

        apiService.getByText("threshold", query, 100, 0).then(response => {
            const respThresholds = response.thresholds || [];
            const thresholds = filterThresholdSelected(respThresholds);

            setThresholdOptions(thresholds);
            setLoading(false);
        });
    };

    const filterThresholdSelected = options =>
        options
            .filter(t => !selectedThresholdIds.includes(t.id))
            .map(t => {
                return { id: t.id, label: t.name };
            });

    const filterBy = () => true;

    return (
        <BlockUi tag="div" blocking={blocking}>
            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(_values, { setSubmitting }) => {
                    save(setSubmitting);
                }}
            >
                {({ isSubmitting, handleSubmit }) => (
                    <form className="card card-custom" onSubmit={handleSubmit}>
                        {/* begin::Header */}
                        <div className={`card-header py-3 ` + classes.headerMarginTop}>
                            <div className="card-title align-items-start flex-column">
                                <h3 className="card-label font-weight-bolder text-dark">Device thresholds</h3>
                                <span className="text-muted font-weight-bold font-size-sm mt-1">
                                    Change thresholds of your device
                                </span>
                            </div>
                            <div className="card-toolbar">
                                {permissions.canEditDevices && (
                                    <button type="submit" className="btn btn-success mr-2" disabled={isSubmitting}>
                                        <DoneIcon />
                                        Save
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
                                        <label>Threshold</label>
                                        <div>
                                            <AsyncTypeahead
                                                disabled={!permissions.canEditDevices }
                                                id="typeahead-threshold"
                                                labelKey="label"
                                                size="lg"
                                                multiple
                                                onChange={onChangeThreshold}
                                                options={thresholdOptions}
                                                placeholder=""
                                                selected={selectedThresholds}
                                                onSearch={handleSearchThreshold}
                                                isLoading={loading}
                                                filterBy={filterBy}
                                                useCache={false}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-xl-6 col-lg-6">
                                        <label>Group Thresholds</label>
                                        <div>
                                            <Typeahead
                                                disabled={!permissions.canEditDevices }
                                                id="typeahead-threshold-group"
                                                labelKey="label"
                                                size="lg"
                                                multiple
                                                options={groupThresholdOptions}
                                                selected={selectedGroupThresholds}
                                                placeholder=""
                                                isLoading={loading}
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

export default injectIntl(DeviceThresholdComponent);
