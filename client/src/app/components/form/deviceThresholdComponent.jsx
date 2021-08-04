import React from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {makeStyles} from '@material-ui/styles';
import apiService from '../../services/apiService';
import deviceService from '../../services/deviceService';
import thresholdService from '../../services/thresholdService';
import deviceThresholdService from '../../services/deviceThresholdService';
import {AsyncTypeahead} from 'react-bootstrap-typeahead';
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
            blocking: false,
            loading: false,
        };
    }

    componentDidMount() {
        this.setState({blocking: true});

        thresholdService.getBySpec('bydevice', this.state.id).then((r) => {
            if(typeof r.thresholds !== "undefined") {
                const selectedIds = r.thresholds.map((t) => t.id);
                this.setState({thresholds: r.thresholds});
                this.setState({selectedThresholds: r.thresholds});
                this.setState({selectedThresholdsId: selectedIds});
            }
        
            this.setState({blocking: false});
        });
    }

    initialValues = {
        threshold: ''
    };

    validationSchema = Yup.object().shape({});

    useStyles = makeStyles((theme) => ({
        headerMarginTop: {
            marginTop: theme.spacing(5),
        }
    }));

    save = (fields, { setFieldValue }) => {
        this.setState({blocking: true});

        const config = {
            device_id: this.state.id,
            thresholds_id: this.state.selectedThresholdsId
        };

        deviceThresholdService.save(JSON.stringify(config))
            .then(() => {
                toaster.notify('success', this.state.intl.formatMessage({id: 'DEVICE.THRESHOLD.SUCCESS'}));
                this.setState({blocking: false});
            });
    };

    onChangeThreshold = (opt) => {
        const selectedIds = opt.map((t) => t.id);
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
        console.log(options, this.state.selectedThresholdsId);
        return options.filter((t) => {
            return !this.state.selectedThresholdsId.includes(t.id)
        });
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
                                                labelKey='name'
                                                size="lg"
                                                multiple
                                                onChange={this.onChangeThreshold}
                                                options={this.state.thresholds}
                                                clearButton={true}
                                                placeholder=''
                                                selected={this.state.selectedThresholds}
                                                onSearch={this.handleSearchThreshold}
                                                isLoading={this.state.loading}
                                                filterBy={this.filterBy}
                                                useCache={false}
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