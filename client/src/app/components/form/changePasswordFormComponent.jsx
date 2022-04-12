import React from 'react';
import {ErrorMessage, Field, Formik} from 'formik';
import * as Yup from 'yup';
import DoneIcon from '@material-ui/icons/Done';
import {getInputClasses} from '../../utils/formik';
import BlockUi from "react-block-ui";
import toaster from '../../utils/toaster';
import {injectIntl} from 'react-intl';
import passwordChangeService from "../../services/passwordChangeService";

class ChangePasswordFormComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            intl: props.intl,
            blocking: false,
        };
    }

    componentDidMount() {
    }

    initialValues = {
        id: this.props.userId,
        password: '',
        confirmPassword: '',
    };

    validationSchema = Yup.object().shape({
        password: Yup.string().required(this.props.intl.formatMessage({id: 'MODAL.PASSWORD.FIELD.PASSWORD.HINT'})),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], this.props.intl.formatMessage(
                { id : 'MODAL.PASSWORD.FIELD.CONFIRM.MISMATCH' }
            ))
            .required(this.props.intl.formatMessage(
                { id : 'MODAL.PASSWORD.FIELD.CONFIRM.HINT' }
            ))

    });

    save = (fields, {resetForm}) => {
        if (fields.password !== fields.confirmPassword) {
            toaster.notify('error', 'The passwords must match');
            return;
        }

        this.setState({blocking: true});
        let msgSuccess = this.state.intl.formatMessage({id: 'USER.PASSWORD.UPDATED'});
        passwordChangeService.save(fields)
            .then((response) => {
                toaster.notify('success', msgSuccess);
                resetForm(this.initialValues)
                this.setState({blocking: false});
            });
    };

    render() {
        const closeButtonStyle = {
            'float': 'right'
        };
        const saveButtonStyle = {
            'float': 'right'
        };
        return (
            <BlockUi tag='div' blocking={this.state.blocking}>
            <Formik
                enableReinitialize
                initialValues={this.initialValues}
                validationSchema={this.validationSchema}
                onSubmit={(values, { setStatus, setSubmitting, resetForm, setFieldValue }) => {
                    this.save(values, {
                        resetForm
                    });
                }}
                >
                {({
                    isValid,
                    getFieldProps,
                    errors,
                    touched,
                    isSubmitting,
                    handleSubmit
                }) => {
                    return (
                        <form
                            className='card card-custom'
                            onSubmit={handleSubmit}>

                            {/* begin::Form */}
                            <div className='form'>
                                <div className='card-body'>
                                    <div className='form-group row'>
                                        <div className='col-xl-6 col-lg-6'>
                                            <label>
                                                { this.props.intl.formatMessage( { id : 'MODAL.PASSWORD.FIELD.PASSWORD' } ) }
                                            </label>
                                            <div>
                                                <Field
                                                    type="password"
                                                    className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                        {errors, touched},
                                                        'password'
                                                    )}`}
                                                    name='password'
                                                    placeholder='Enter new password'
                                                    {...getFieldProps(
                                                        'password'
                                                    )}
                                                />
                                                <ErrorMessage name="password" component="div" className="invalid-feedback" />
                                            </div>
                                        </div>
                                        <div className='col-xl-6 col-lg-6'>
                                            <label>Confirm Password</label>
                                            <div>
                                                <Field
                                                    type="password"
                                                    className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                        {errors, touched},
                                                        'confirmPassword'
                                                    )}`}
                                                    name='password'
                                                    placeholder='Confirm password'
                                                    {...getFieldProps(
                                                        'confirmPassword'
                                                    )}
                                                />
                                                <ErrorMessage name="confirmPassword" component="div" className="invalid-feedback" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* end::Form */}

                            {/* begin::Footer */}
                            <div
                                className={`card-footer py-3 `}>
                                <div className='card-toolbar'>
                                    <button
                                        onClick = {this.props.handleClose}
                                        className='btn btn-secondary'
                                        style = {closeButtonStyle}
                                        >
                                        {/* <DoneIcon /> */}
                                        {this.props.intl.formatMessage({id: 'MODAL.PASSWORD.BUTTON.CLOSE'})}
                                        {/* {isSubmitting} */}
                                    </button>
                                    <button
                                        type='submit'
                                        className='btn btn-success mr-2'
                                        disabled={
                                            isSubmitting ||
                                            (touched && !isValid)
                                        }
                                        style={saveButtonStyle}>
                                        <DoneIcon />
                                        {this.props.intl.formatMessage({id: 'MODAL.PASSWORD.BUTTON.SAVE'})}
                                        {isSubmitting}
                                    </button>
                                </div>
                            </div>
                            
                            {/* end::Footer */}
                        </form>
                    );
                }}
            </Formik>
            </BlockUi>
        );
    }
}

export default injectIntl(ChangePasswordFormComponent);