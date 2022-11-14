import DoneIcon from '@material-ui/icons/Done';
import { ErrorMessage, Field, Formik } from 'formik';
import React, { useState } from 'react';
import BlockUi from "react-block-ui";
import { injectIntl } from 'react-intl';
import * as Yup from 'yup';
import passwordChangeService from "../../services/passwordChangeService";
import { getInputClasses } from '../../utils/formik';
import toaster from '../../utils/toaster';

const closeButtonStyle = {
    'float': 'right'
}
const saveButtonStyle = {
    'float': 'right'
}


function ChangePasswordFormComponent(props) {
    const intl = props.intl
    const [blocking, setBlocking] = useState(false)

    const initialValues = {
        id: props.userId,
        password: '',
        confirmPassword: '',
    };

    const validationSchema = Yup.object().shape({
        password: Yup.string().required(props.intl.formatMessage({ id: 'MODAL.PASSWORD.FIELD.PASSWORD.HINT' })),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], props.intl.formatMessage(
                { id: 'MODAL.PASSWORD.FIELD.CONFIRM.MISMATCH' }
            ))
            .required(props.intl.formatMessage(
                { id: 'MODAL.PASSWORD.FIELD.CONFIRM.HINT' }
            ))

    });

    const save = (fields, { resetForm }) => {
        if (fields.password !== fields.confirmPassword) {
            toaster.notify('error', 'The passwords must match');
            return;
        }

        setBlocking(true)
        let msgSuccess = intl.formatMessage({ id: 'USER.PASSWORD.UPDATED' });
        passwordChangeService.save(fields)
            .then((_response) => {
                toaster.notify('success', msgSuccess);
                resetForm(initialValues)
                setBlocking(false)
            });
    };

    return <BlockUi tag='div' blocking={blocking}>
        <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, { resetForm }) => {
                save(values, { resetForm });
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
                                            {props.intl.formatMessage({ id: 'MODAL.PASSWORD.FIELD.PASSWORD' })}
                                        </label>
                                        <div>
                                            <Field
                                                type="password"
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                    { errors, touched },
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
                                                    { errors, touched },
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
                                    onClick={props.handleClose}
                                    className='btn btn-secondary'
                                    style={closeButtonStyle}
                                >
                                    {/* <DoneIcon /> */}
                                    {intl.formatMessage({ id: 'MODAL.PASSWORD.BUTTON.CLOSE' })}
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
                                    {intl.formatMessage({ id: 'MODAL.PASSWORD.BUTTON.SAVE' })}
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
}

export default injectIntl(ChangePasswordFormComponent);