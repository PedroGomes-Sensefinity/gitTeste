import React from 'react';
import {ErrorMessage, Field, Formik} from 'formik';
import * as Yup from 'yup';
import {makeStyles} from '@material-ui/styles';
import deviceService from '../../services/deviceService';
import DoneIcon from '@material-ui/icons/Done';
import {getInputClasses} from '../../utils/formik';
import BlockUi from "react-block-ui";
import toaster from '../../utils/toaster';
import {injectIntl} from 'react-intl';

class DeviceConfigMessageComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            intl: props.intl,
            id: props.entity,
            blocking: false,
        };
    }

    componentDidMount() {}

    initialValues = {
        message: ''
    };

    validationSchema = Yup.object().shape({
        message: Yup.string().required('Message is required')
    });

    useStyles = makeStyles((theme) => ({
        headerMarginTop: {
            marginTop: theme.spacing(5),
        }
    }));

    sendMessage = (fields, { setFieldValue }) => {
        this.setState({blocking: true});

        const config = {
            device_id: this.state.id,
            message: fields.message
        };

        deviceService.config(JSON.stringify(config))
            .then(() => {
                toaster.notify('success', this.state.intl.formatMessage({id: 'DEVICE.CONFIG_MESSAGE'}));
                this.setState({blocking: false});
                setFieldValue('message', '', false);
            });
    };
    
    render() {
        return (
            <BlockUi tag='div' blocking={this.state.blocking}>
            <Formik
                enableReinitialize
                initialValues={this.initialValues}
                validationSchema={this.validationSchema}
                onSubmit={(values, { setStatus, setSubmitting, resetForm, setFieldValue }) => {
                    this.sendMessage(values, {
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
                                        Device configuration message
                                    </h3>
                                    <span className='text-muted font-weight-bold font-size-sm mt-1'>
                                        Change configuration of your device
                                    </span>
                                </div>
                                <div className='card-toolbar'>
                                    <button
                                        type='submit'
                                        className='btn btn-success mr-2'
                                        disabled={
                                            isSubmitting ||
                                            (touched && !isValid)
                                        }>
                                        <DoneIcon />
                                        Send message
                                        {isSubmitting}
                                    </button>
                                </div>
                            </div>
                            {/* end::Header */}

                            {/* begin::Form */}
                            <div className='form'>
                                <div className='card-body'>
                                    <div className='form-group row'>
                                        <div className='col-xl-6 col-lg-6'>
                                            <label>Message</label>
                                            <div>
                                                <Field
                                                    as="textarea"
                                                    rows='7'
                                                    className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                        {errors, touched},
                                                        'message'
                                                    )}`}
                                                    name='message'
                                                    placeholder=''
                                                    {...getFieldProps(
                                                        'message'
                                                    )}
                                                />
                                                <ErrorMessage name="message" component="div" className="invalid-feedback" />
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

export default injectIntl(DeviceConfigMessageComponent);