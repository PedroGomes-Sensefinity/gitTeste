import DoneIcon from '@material-ui/icons/Done';
import { makeStyles } from '@material-ui/styles';
import { ErrorMessage, Field, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import BlockUi from "react-block-ui";
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import apiService from '../../services/apiService';
import userService from '../../services/userService';
import { getInputClasses } from '../../utils/formik';
import toaster from '../../utils/toaster';
import '../../utils/yup-validations';

const useStyles = makeStyles((theme) => ({
    headerMarginTop: {
        marginTop: theme.spacing(5),
    }
}));


function UserFormComponent(props) {
    const intl = props.intl
    const userId = props.id
    const isAddMode = !props.id
    const [userInfo, setUserInfo] = useState({ metadata: {}, profile: {} })
    const [tenants, setTenants] = useState([])
    const [profiles, setProfiles] = useState([])
    const [blocking, setBlocking] = useState(false)

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        username: Yup.string().required('Username is required'),
        password: Yup.string().when('id', {
            is: (id) => {
                return typeof id === 'undefined'
            },
            then: Yup.string().required('Password is required').min(6)
        }),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match'),
        email: Yup.string().required('Email is required').email(),
        tenantId: Yup.string().required('Tenant is required'),
        profileId: Yup.string().required('Profile is required'),
        phone: Yup.number(),
    });

    const saveUser = (fields, { setSubmitting, resetForm }) => {
        setBlocking(true)
        let method = (isAddMode) ? 'save' : 'update';
        let msgSuccess = (isAddMode)
            ? intl.formatMessage({ id: 'USER.CREATED' })
            : intl.formatMessage({ id: 'USER.UPDATED' });

        fields.metadata = JSON.stringify({
            address: fields.address,
            phone: fields.phone,
            comments: fields.comments,
        });

        // Profile Selection
        const profileArr = profiles.filter((e) => {
            return e.id === parseInt(fields.profileId);
        });
        fields.profile = profileArr[0];

        // Tenant Selection
        const tenantArr = tenants.filter((e) => {
            return e.id === parseInt(fields.tenantId);
        });
        fields.tenant = tenantArr[0];

        userService[method](fields)
            .then((_response) => {
                setSubmitting(false);
                setBlocking(false)
                toaster.notify('success', msgSuccess);
                if (isAddMode) {
                    resetForm(initialValues);
                }
            });
    };
    useEffect(() => {
        apiService
            .get('profile', 100, 0)
            .then((response) => {
                const respProfiles = response.profiles || []
                setProfiles(respProfiles)
            });
        apiService
            .get('tenant_new', 100, 0)
            .then((response) => {
                const respTenants = response.tenants_new || []
                setTenants(respTenants)
            });
        if (!isAddMode && userId !== 'new') {
            apiService
                .getById('user', userId)
                .then((response) => {
                    const res = response.users[0] || {};
                    const userInfo = {
                        name: res.name,
                        username: res.username,
                        profileId: res.profile.id,
                        profile: res.profile,
                        tenantId: res.tenant.id,
                        email: res.email,
                        metadata: res.metadata !== '' ? JSON.parse(res.metadata) : {}
                    }
                    setUserInfo(userInfo)
                });
        }

    }, [])


    const classes = useStyles();

    const initialValues = {
        id: userId,
        profileId: userInfo.profileId || '',
        tenantId: userInfo.tenantId || '',
        name: userInfo.name || '',
        username: userInfo.username || '',
        email: userInfo.email || '',
        password: '',
        confirmPassword: '',
        phone: userInfo.metadata.phone || '',
        address: userInfo.metadata.address || '',
        comments: userInfo.metadata.comments || '',
        metadata: userInfo.metadata || {},
        profile: userInfo.profile || {},
    };

    return (
        <BlockUi tag='div' blocking={blocking}>
            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, { setStatus, setSubmitting, resetForm }) => {
                    saveUser(values, {
                        setStatus,
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
                                        User Information
                                    </h3>
                                    <span className='text-muted font-weight-bold font-size-sm mt-1'>
                                        Change information about the users
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
                                        to='/users/list'
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
                                        <div className='col-xl-4 col-lg-4'>
                                            <label className={`required`}>Name</label>
                                            <div>
                                                <Field
                                                    as="input"
                                                    className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                        { errors, touched },
                                                        'name'
                                                    )}`}
                                                    name='name'
                                                    placeholder='Set the name of the user'
                                                    {...getFieldProps('name')}
                                                />
                                                <ErrorMessage name="name" component="div" className="invalid-feedback" />
                                            </div>
                                        </div>
                                        <div className='col-xl-4 col-lg-4'>
                                            <label className={`required`}>Tenant</label>
                                            <Field
                                                component="select"
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                    { errors, touched },
                                                    'tenantId'
                                                )}`}
                                                name='tenantId'
                                                placeholder='Select tenant for this user'
                                                {...getFieldProps('tenantId')}
                                            >
                                                <option key='' value=''>&nbsp;</option>
                                                {tenants.map((e) =>
                                                    <option value={e.id} key={e.id}>{e.name}</option>
                                                )}
                                            </Field>
                                            <ErrorMessage name="tenantId" component="div" className="invalid-feedback" />
                                        </div>
                                        <div className='col-xl-4 col-lg-4'>
                                            <label className={`required`}>Profile</label>
                                            <Field
                                                component="select"
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                    { errors, touched },
                                                    'profileId'
                                                )}`}
                                                name='profileId'
                                                placeholder='Select the user profile'
                                                {...getFieldProps('profileId')}
                                            >
                                                <option key='' value=''>&nbsp;</option>
                                                {profiles.map((e) =>
                                                    <option value={e.id} key={e.id}>{e.name}</option>
                                                )}
                                            </Field>
                                            <ErrorMessage name="profileId" component="div" className="invalid-feedback" />
                                        </div>
                                    </div>

                                    {isAddMode &&
                                        <div className='form-group row'>
                                            <div className='col-xl-4 col-lg-4'>
                                                <label className={`required`}>Username</label>
                                                <Field
                                                    className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                        { errors, touched },
                                                        'username'
                                                    )}`}
                                                    placeholder='Set the username'
                                                    {...getFieldProps('username')}
                                                />
                                                <ErrorMessage name="username" component="div" className="invalid-feedback" />
                                            </div>

                                            <div className='col-xl-4 col-lg-4'>
                                                <label className={`required`}>Password</label>
                                                <Field
                                                    as="input"
                                                    type="password"
                                                    className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                        { errors, touched },
                                                        'password'
                                                    )}`}
                                                    name='password'
                                                    placeholder='Set the password'
                                                    {...getFieldProps('password')}
                                                />
                                                <ErrorMessage name="password" component="div" className="invalid-feedback" />
                                            </div>
                                            <div className='col-xl-4 col-lg-4'>
                                                <label className={`required`}>Repeat Password</label>
                                                <Field
                                                    as="input"
                                                    type="password"
                                                    className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                        { errors, touched },
                                                        'confirmPassword'
                                                    )}`}
                                                    name='confirmPassword'
                                                    placeholder='confirm your password'
                                                    {...getFieldProps('confirmPassword')}
                                                />
                                                <ErrorMessage name="confirmPassword" component="div" className="invalid-feedback" />
                                            </div>
                                        </div>
                                    }

                                    {!isAddMode &&
                                        <div className='form-group row'>
                                            <div className='col-xl-12 col-lg-12'>
                                                <label className={`required`}>Username</label>
                                                <Field
                                                    className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                        { errors, touched },
                                                        'username'
                                                    )}`}
                                                    placeholder='Set the username'
                                                    {...getFieldProps('username')}
                                                />
                                                <ErrorMessage name="username" component="div" className="invalid-feedback" />
                                            </div>
                                        </div>
                                    }

                                    <div className='form-group row'>
                                        <div className='col-xl-6 col-lg-6'>
                                            <label className={`required`}>Email</label>
                                            <Field
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                    { errors, touched },
                                                    'email'
                                                )}`}
                                                placeholder='Set the email'
                                                {...getFieldProps('email')}
                                            />
                                            <ErrorMessage name="email" component="div" className="invalid-feedback" />
                                        </div>

                                        <div className='col-xl-6 col-lg-6'>
                                            <label>Phone number</label>
                                            <Field
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                    { errors, touched },
                                                    'phone'
                                                )}`}
                                                placeholder='Set the phone number'
                                                {...getFieldProps('phone')}
                                            />
                                            <ErrorMessage name="phone" component="div" className="invalid-feedback" />
                                        </div>
                                    </div>

                                    <div className='form-group row'>
                                        <div className='col-xl-12 col-lg-12'>
                                            <label>Address</label>
                                            <Field
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                    { errors, touched },
                                                    'address'
                                                )}`}
                                                placeholder='Set the address'
                                                {...getFieldProps('address')}
                                            />
                                            <ErrorMessage name="address" component="div" className="invalid-feedback" />
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
                                                <ErrorMessage name="comments" component="div" className="invalid-feedback" />
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

export default injectIntl(UserFormComponent);