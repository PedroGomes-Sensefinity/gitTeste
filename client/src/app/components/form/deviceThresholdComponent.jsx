import React from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {makeStyles} from '@material-ui/styles';
import apiService from '../../services/apiService';
import deviceThresholdService from '../../services/deviceThresholdService';
import {AsyncTypeahead, Typeahead} from 'react-bootstrap-typeahead';
import DoneIcon from '@material-ui/icons/Done';
import BlockUi from "react-block-ui";
import toaster from '../../utils/toaster';
import {injectIntl} from 'react-intl';

class DeviceThresholdComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            intl: props.intl,
            id: props.entity,
            thresholds: [],
            selectedThresholdsId: [],
            selectedThresholds: [],
            groupThresholds: [],
            selectedGroupThresholds: [],
            blocking: false,
            loading: false,
        };
    }

    componentDidMount() {
        this.setState({blocking: true});

        deviceThresholdService.getByDevice(this.state.id).then((response) => {
            if ('group' in response) {
                this.setState({selectedGroupThresholds: response.group});
                this.setState({groupThresholds: response.group});
            }

            if ('device' in response) {
                const selectedIds = response.device.map((t) => t.id);
                this.setState({thresholds: response.device});
                this.setState({selectedThresholds: response.device});
                this.setState({selectedThresholdsId: selectedIds});
            }

            this.setState({blocking: false});
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
    }

    initialValues = {};

    validationSchema = Yup.object().shape({});

    useStyles = makeStyles((theme) => ({
        headerMarginTop: {
            marginTop: theme.spacing(5),
        }
    }));

    save = (fields, { setFieldValue, setSubmitting }) => {
        this.setState({blocking: true});

        const config = {
            device_id: this.state.id,
            thresholds_id: this.state.selectedThresholdsId
        };

        deviceThresholdService.save(JSON.stringify(config))
            .then(() => {
                toaster.notify('success', this.state.intl.formatMessage({id: 'DEVICE.THRESHOLD.SUCCESS'}));
                this.setState({blocking: false});
                setSubmitting(false);
            });
    };

    onChangeThreshold = (opt) => {
        let selectedIds = [];

        if (opt.length > 0) {
            selectedIds = opt.map((t) => t.id);
        }

        this.setState({ selectedThresholdsId: selectedIds});
        this.setState({ selectedThresholds: opt});
    };

    handleSearchThreshold = (query) => {
        this.setState({loading: true});

        apiService.getByText('threshold', query, 100, 0).then((response) => {
            const thresholds = (typeof response.thresholds !== undefined && Array.isArray(response.thresholds))
                ? this.filterThresholdSelected(response.thresholds)
                : [];

            this.setState({ thresholds: thresholds });
            this.setState({ loading: false });
        });
    };

    filterThresholdSelected = (options) => {
        let data = [];
        options.map((t) => {
            if(!this.state.selectedThresholdsId.includes(t.id)) {
                data.push({
                    id: t.id,
                    label: t.name
                });
            }
        });
        return data;
    }

    filterBy = () => true;

    render() {
        return (
            <BlockUi tag='div' blocking={this.state.blocking}>
            <Formik
                enableReinitialize
                initialValues={this.initialValues}
                validationSchema={this.validationSchema}
                onSubmit={(values, { setStatus, setSubmitting, resetForm, setFieldValue }) => {
                    this.save(values, {
                        setFieldValue,
                        setSubmitting
                    });
                }}
                >
                {({
                    isValid,
                    getFieldProps,
                    errors,
                    touched,
                    isSubmitting,
                    handleSubmit,
                    setFieldValue
                }) => {
                    const classes = this.useStyles();

                    return (
                        <form
                            className='card card-custom'
                            onSubmit={handleSubmit}>
                            {/* begin::Header */}
                            <div
                                className={`card-header py-3 `+ classes.headerMarginTop}>
                                <div className='card-title align-items-start flex-column'>
                                    <h3 className='card-label font-weight-bolder text-dark'>
                                        Device thresholds
                                    </h3>
                                    <span className='text-muted font-weight-bold font-size-sm mt-1'>
                                        Change thresholds of your device
                                    </span>
                                </div>
                                <div className='card-toolbar'>
                                    <button
                                        type='submit'
                                        className='btn btn-success mr-2'
                                        disabled={isSubmitting}>
                                        <DoneIcon />
                                        Save
                                    </button>
                                </div>
                            </div>
                            {/* end::Header */}

                            {/* begin::Form */}
                            <div className='form'>
                                <div className='card-body'>
                                    <div className='form-group row'>
                                        <div className='col-xl-6 col-lg-6'>
                                            <label>Threshold</label>
                                            <div>
                                            <AsyncTypeahead
                                                id='typeahead-threshold'
                                                labelKey='label'
                                                size="lg"
                                                multiple
                                                onChange={this.onChangeThreshold}
                                                options={this.state.thresholds}
                                                placeholder=''
                                                selected={this.state.selectedThresholds}
                                                onSearch={this.handleSearchThreshold}
                                                isLoading={this.state.loading}
                                                filterBy={this.filterBy}
                                                useCache={false}
                                            />
                                            </div>
                                        </div>
                                        <div className='col-xl-6 col-lg-6'>
                                            <label>Group Thresholds</label>
                                            <div>
                                            <Typeahead
                                                id='typeahead-threshold-group'
                                                labelKey='label'
                                                size="lg"
                                                multiple
                                                disabled={true}
                                                options={this.state.groupThresholds}
                                                selected={this.state.selectedGroupThresholds}
                                                placeholder=''
                                                isLoading={this.state.loading}
                                            />
                                            </div>
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
}

export default injectIntl(DeviceThresholdComponent);