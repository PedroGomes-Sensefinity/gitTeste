import DoneIcon from '@material-ui/icons/Done';
import { makeStyles } from '@material-ui/styles';
import { ErrorMessage, Field, Formik } from 'formik';
import React, { useEffect, useMemo, useState } from 'react';
import BlockUi from "react-block-ui";
import { Typeahead } from 'react-bootstrap-typeahead';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import apiService from '../../services/apiService';
import profilesService from "../../services/profilesService";
import { getInputClasses } from '../../utils/formik';
import toaster from '../../utils/toaster';

const useStyles = makeStyles((theme) => ({
    headerMarginTop: {
        marginTop: theme.spacing(5),
    }
}));

function ProfilesFormComponent(props) {
    const intl = props.intl
    const profileId = props.id
    const isAddMode = !props.id
    const [profile, setProfile] = useState({
        permissions: []
    })

    //each permission should have id and slug properties
    {/*
        {
            "id":0
            "slug": "some_permission"
        }
    */ }
    const permissions = useMemo(() => profile.permissions || [], [profile])
    const [optionsPermissions, setPermissionOptions] = useState([])
    const [blocking, setBlocking] = useState(false)
    const classes = useStyles();


    useEffect(() => {
        apiService.get('permission', 100, 0).then((response) => {
            setPermissionOptions(response.permissions || [])
        });
        if (!isAddMode && profileId !== 'new') {
            setBlocking(true)
            apiService
                .getById('profile', profileId)
                .then((response) => {
                    const respProf = response.profiles || []
                    if (respProf.length > 0) {
                        setProfile((prev) => ({ ...prev, ...respProf[0] }))
                    }
                    setBlocking(false)
                });
        }
    }, [])

    const initialValues = {
        id: parseInt(props.id),
        name: profile.name || '',
        permissions: permissions || [],
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
    });

    const save = (fields, { setSubmitting, resetForm }) => {
        setBlocking(true)
        setSubmitting(true);

        let method = (isAddMode) ? 'save' : 'update';
        let msgSuccess = (isAddMode)
            ? intl.formatMessage({ id: 'PROFILES.CREATED' })
            : intl.formatMessage({ id: 'PROFILES.UPDATED' });

        profilesService[method](fields)
            .then((_response) => {
                toaster.notify('success', msgSuccess);
                setSubmitting(false);

                setBlocking(false)

                if (isAddMode) {
                    resetForm(initialValues);
                }
            });
    };

    const onChangePermissions = (opt) => {
        setProfile(prev => {
            return ({ ...prev, permissions: opt })
        })
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
                                        Profile Information
                                    </h3>
                                    <span className='text-muted font-weight-bold font-size-sm mt-1'>
                                        Change general configurations about profile
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
                                        to='/profiles/list'
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
                                            <label>Name</label>
                                            <Field
                                                as="input"
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                    { errors, touched },
                                                    'name'
                                                )}`}
                                                name='name'
                                                placeholder='Set the profile name'
                                                {...getFieldProps('name')}
                                            />
                                            <ErrorMessage name="name" component="div" className="invalid-feedback" />
                                        </div>
                                        <div className='col-lg-6 col-xl-6'>
                                            <label>Permissions</label>
                                            <Typeahead
                                                multiple
                                                id='typeahead-permissions'
                                                //name of the prop from the type of object stored in "permissions" object
                                                labelKey="slug"
                                                size="lg"
                                                onChange={data => onChangePermissions(data)}
                                                options={optionsPermissions}
                                                placeholder=''
                                                selected={permissions}
                                                class={getInputClasses({ errors, touched }, 'permissions')}
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

export default injectIntl(ProfilesFormComponent);