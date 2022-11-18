import DoneIcon from '@material-ui/icons/Done';
import { makeStyles } from '@material-ui/styles';
import { ErrorMessage, Field, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import BlockUi from "react-block-ui";
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import apiService from '../../services/apiService';
import tenantsService from "../../services/tenantsService";
import { getInputClasses } from '../../utils/formik';
import toaster from '../../utils/toaster';

const useStyles = makeStyles((theme) => ({
    headerMarginTop: {
        marginTop: theme.spacing(5),
    }
}));

function TenantsFormComponent(props) {
    const intl = props.intl
    const tenantId = props.id
    const isAddMode = !props.id
    const [blocking, setBlocking] = useState(false)
    const [groups, setGroups] = useState([])
    const [tenant, setTenant] = useState({})
    const metadata = JSON.parse(tenant.metadata || '{}')

    const classes = useStyles();

    useEffect(() => {
        apiService.get('permission', 100, 0).then((response) => {
            setGroups(response.containers || []);
        });
        if (!isAddMode && tenantId !== 'new') {
            apiService
                .getById('tenant_new', tenantId)
                .then((response) => {
                    const respTenants = response.tenants_new || []
                    if (respTenants.length === 1) {
                        let tenant = response.tenants_new[0];
                        setTenant(tenant)
                    }
                });
        }
    }, []);

    const initialValues = {
        id: parseInt(tenantId),
        name: tenant.name || '',
        metadata: tenant.metadata || '',
        containers: { id: 0 },
        contact_name: metadata.contact_name || '',
        email: metadata.email || '',
        phone: metadata.phone || '',
        zip: metadata.zip || '',
        country: metadata.country || '',
        state: metadata.state || '',
        city: metadata.city || '',
        address: metadata.address || '',
        comments: metadata.comments || '',
        color: '',
        files: [],
        attachment: File,
        check_location_sublocation: tenant.check_location_sublocation || false,
        check_longstanding: tenant.check_longstanding || false,
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Tenant name is required'),
        address: Yup.string().required('Address is required'),
        email: Yup.string().email('Must be a valid email'),
        phone: Yup.number().typeError('Must be only numbers'),
        zip: Yup.number().typeError('Must be only numbers'),
    });



    const save = (fields, { setSubmitting, resetForm }) => {
        setBlocking(true)
        setSubmitting(true);

        fields.metadata = JSON.stringify({
            contact_name: fields.contact_name,
            email: fields.email,
            phone: fields.phone,
            zip: fields.zip,
            country: fields.country,
            state: fields.state,
            city: fields.city,
            address: fields.address,
            comments: fields.comments,
        });

        let method = (isAddMode) ? 'save' : 'update';
        let msgSuccess = (isAddMode)
            ? intl.formatMessage({ id: 'TENANT.CREATED' })
            : intl.formatMessage({ id: 'TENANT.UPDATED' });

        tenantsService[method](fields, fields.id)
            .then((_response) => {
                toaster.notify('success', msgSuccess);
                setSubmitting(false);

                setBlocking(false);

                if (isAddMode) {
                    resetForm(initialValues);
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
                    handleSubmit
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
                                        Tenant Information
                                    </h3>
                                    <span className='text-muted font-weight-bold font-size-sm mt-1'>
                                        Change general configurations about tenant
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
                                        to='/tenants/list'
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
                                            <label className="required">Tenant name</label>
                                            <Field
                                                as="input"
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                    { errors, touched },
                                                    'name'
                                                )}`}
                                                name='name'
                                                placeholder='Set the tenant name'
                                                {...getFieldProps('name')}
                                            />
                                            <ErrorMessage name="name" component="div"
                                                className="invalid-feedback" />
                                        </div>

                                        <div className='col-xl-3 col-lg-3'>
                                            <div>
                                                <label>Extra Features</label>
                                            </div>
                                            <div>
                                                <Field
                                                    className="mr-2 leading-tight"
                                                    type="checkbox"
                                                    name="check_location_sublocation"
                                                />
                                                <label>Location/Sublocation</label>
                                            </div>
                                            <div>
                                                <Field
                                                    className="mr-2 leading-tight"
                                                    type="checkbox"
                                                    name="check_longstanding"
                                                />
                                                <label>Long Standing</label>
                                            </div>
                                        </div>

                                    </div>



                                    <div className='form-group row'>
                                        <div className='col-xl-4 col-lg-4'>
                                            <label>Contact Name</label>
                                            <Field
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                    { errors, touched },
                                                    'contact_name'
                                                )}`}
                                                name='contact_name'
                                                placeholder='Set the contact name'
                                                {...getFieldProps('contact_name')}
                                            />
                                            <ErrorMessage name="contact_name" component="div"
                                                className="invalid-feedback" />
                                        </div>

                                        <div className='col-xl-4 col-lg-4'>
                                            <label>Email</label>
                                            <Field
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                    { errors, touched },
                                                    'email'
                                                )}`}
                                                name='email'
                                                placeholder='Set the email'
                                                {...getFieldProps('email')}
                                            />
                                            <ErrorMessage name="email" component="div"
                                                className="invalid-feedback" />
                                        </div>

                                        <div className='col-xl-4 col-lg-4'>
                                            <label>Phone number</label>
                                            <Field
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                    { errors, touched },
                                                    'phone'
                                                )}`}
                                                name='phone'
                                                placeholder='Set the phone number'
                                                {...getFieldProps('phone')}
                                            />
                                            <ErrorMessage name="phone" component="div"
                                                className="invalid-feedback" />
                                        </div>
                                    </div>

                                    <div className='form-group row'>
                                        <div className='col-xl-3 col-lg-3'>
                                            <label>Zip Code</label>
                                            <Field
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                    { errors, touched },
                                                    'zip'
                                                )}`}
                                                name='zip'
                                                placeholder='Set the zipcode'
                                                {...getFieldProps('zip')}
                                            />
                                            <ErrorMessage name="zip" component="div"
                                                className="invalid-feedback" />
                                        </div>
                                        <div className='col-xl-3 col-lg-3'>
                                            <label>Country</label>
                                            <Field
                                                name='country'
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                    { errors, touched },
                                                    'country'
                                                )}`}
                                                placeholder='Set the country'
                                                {...getFieldProps('country')}
                                            />
                                            <ErrorMessage name="country" component="div"
                                                className="invalid-feedback" />
                                        </div>
                                        <div className='col-xl-3 col-lg-3'>
                                            <label>Province/State</label>
                                            <Field
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                    { errors, touched },
                                                    'state'
                                                )}`}
                                                name='state'
                                                placeholder='Set the province/state'
                                                {...getFieldProps('state')}
                                            />
                                            <ErrorMessage name="state" component="div"
                                                className="invalid-feedback" />
                                        </div>
                                        <div className='col-xl-3 col-lg-3'>
                                            <label>City</label>
                                            <Field
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                    { errors, touched },
                                                    'city'
                                                )}`}
                                                name='city'
                                                placeholder='Set the city'
                                                {...getFieldProps('city')}
                                            />
                                            <ErrorMessage name="city" component="div"
                                                className="invalid-feedback" />
                                        </div>
                                    </div>

                                    <div className='form-group row'>
                                        <div className='col-xl-12 col-lg-12'>
                                            <label className="required">Address</label>
                                            <Field
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                    { errors, touched },
                                                    'address'
                                                )}`}
                                                name='address'
                                                placeholder='Set the address'
                                                {...getFieldProps('address')}
                                            />
                                            <ErrorMessage name="address" component="div"
                                                className="invalid-feedback" />
                                        </div>
                                    </div>

                                    <div className='form-group row'>

                                        <div className='col-xl-12 col-lg-12'>
                                            <label>Comments</label>
                                            <div>
                                                <Field
                                                    as="textarea"
                                                    rows='3'
                                                    className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                        { errors, touched },
                                                        'comments'
                                                    )}`}
                                                    name='comments'
                                                    placeholder=''
                                                    {...getFieldProps(
                                                        'comments'
                                                    )}
                                                />
                                                <ErrorMessage name="comments" component="div"
                                                    className="invalid-feedback" />
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

export default injectIntl(TenantsFormComponent);