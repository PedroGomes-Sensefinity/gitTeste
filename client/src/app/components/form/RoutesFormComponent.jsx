import DoneIcon from '@material-ui/icons/Done';
import { makeStyles } from '@material-ui/styles';
import { ErrorMessage, Field, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import BlockUi from "react-block-ui";
import { injectIntl } from 'react-intl';
import { Link, useOutletContext } from 'react-router-dom';
import * as Yup from 'yup';
import apiService from '../../services/apiService';
import routesService from "../../services/routesService";
import { getInputClasses } from '../../utils/formik';
import toaster from '../../utils/toaster';
import '../../utils/yup-validations';

const useStyles = makeStyles((theme) => ({
    headerMarginTop: {
        marginTop: theme.spacing(5),
    }
}));

function RoutesFormComponent(props) {
    const intl = props.intl
    const { routeId } = useOutletContext() || props
    const isAddMode = !routeId
    const [route, setRoute] = useState({})
    const [blocking, setBlocking] = useState(false)
    const classes = useStyles();

    useEffect(() => {
        if (!isAddMode && routeId !== 'new') {
            apiService
                .getById('route', routeId)
                .then((response) => {
                    const resRoutes = response.routes || []
                    if (resRoutes.length > 0) {
                        setRoute(resRoutes[0])
                    }
                });
        }
    }, []);


    const initialValues = {
        id: routeId || '',
        label: route.label || '',
        description: route.description || '',
        devices: [],
    };

    const validationSchema = Yup.object().shape({
        label: Yup.string().required('Label is required')
    });

    const save = (fields, { setFieldValue, setSubmitting }) => {
        setBlocking(true)
        setSubmitting(true);

        let method = (isAddMode) ? 'save' : 'update';
        let msgSuccess = (isAddMode)
            ? intl.formatMessage({ id: 'ROUTES.CREATED' })
            : intl.formatMessage({ id: 'ROUTES.UPDATED' });

        routesService[method](fields)
            .then((_response) => {
                toaster.notify('success', msgSuccess);
                setSubmitting(false);
                setBlocking(false)
                if (isAddMode) {
                    setFieldValue('label', '', false);
                    setFieldValue('description', '', false);
                    setFieldValue('devices', [], false);
                }
            });
    };

    return (
        <BlockUi tag='div' blocking={blocking}>
            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, { setFieldValue, setSubmitting, resetForm }) => {
                    save(values, {
                        setFieldValue,
                        setSubmitting,
                        resetForm,
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
                }) => {
                    return (
                        <form
                            className='card card-custom'
                            onSubmit={handleSubmit}>
                            {/* begin::Header */}
                            <div
                                className={`card-header py-3 ` + classes.headerMarginTop}>
                                <div className='card-title align-items-start flex-column'>
                                    <h3 className='card-label font-weight-bolder text-dark'>
                                        Route Information
                                    </h3>
                                    <span className='text-muted font-weight-bold font-size-sm mt-1'>
                                        Change general configurations about the route
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
                                        Save Changes
                                        {isSubmitting}
                                    </button>
                                    <Link
                                        to='/routes/list'
                                        className='btn btn-secondary'>
                                        Back to list
                                    </Link>
                                </div>
                            </div>
                            {/* end::Header */}

                            {/* begin::Form */}
                            <div className='form'>
                                <div className='card-body'>
                                    <div className='form-group row'>

                                        <div className='col-xl-6 col-lg-6'>
                                            <label>Label</label>
                                            <Field
                                                as="input"
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                    { errors, touched },
                                                    'label'
                                                )}`}
                                                name='name'
                                                placeholder='Set the route label'
                                                {...getFieldProps('label')}
                                            />
                                            <ErrorMessage name="label" component="div" className="invalid-feedback" />
                                        </div>


                                        <div className='col-xl-6 col-lg-6'>
                                            <label>Description</label>
                                            <Field
                                                as="textarea"
                                                rows='7'
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                    { errors, touched },
                                                    'description'
                                                )}`}
                                                name='description'
                                                placeholder='Set the description'
                                                {...getFieldProps(
                                                    'description'
                                                )}
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
        </BlockUi>
    );

}

export default injectIntl(RoutesFormComponent);