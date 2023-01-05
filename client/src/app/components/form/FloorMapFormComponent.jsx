import React, { useEffect, useState } from 'react';
import { ErrorMessage, Field, Formik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import floorMapService from '../../services/floorMapService';
import apiService from '../../services/apiService';
import DoneIcon from '@material-ui/icons/Done';
import { getInputClasses } from '../../utils/formik';
import '../../utils/yup-validations';
import BlockUi from "react-block-ui";
import toaster from '../../utils/toaster';
import { injectIntl } from 'react-intl';

const useStyles = makeStyles((theme) => ({
    headerMarginTop: {
        marginTop: theme.spacing(5),
    },
}));

function FloorMapFormComponent(props) {
    const intl = props.intl
    const floorMapId = props.id
    const isAddMode = !props.id
    const [floorMapInfo, setFloorMap] = useState({})
    const [blocking, setBlocking] = useState(false)
    const classes = useStyles()

    useEffect(() => {
        if (!isAddMode && floorMapId !== 'new') {
            apiService
                .getById('floormaps', floorMapId)
                .then((response) => {
                    const respFloorMap = response.floormaps || []
                    if (respFloorMap.length > 0)
                        setFloorMap(respFloorMap[0])
                });
        }
    }, []);


    const initialValues = {
        id: floorMapId,
        label: floorMapInfo.label || "",
        description: floorMapInfo.description || "",
        metadata: floorMapInfo.metadata || "{}"
    };

    const validationSchema = Yup.object().shape({
        label: Yup.string().max(50).required('Label is required'),
        description: Yup.string().max(255, 'Description is too long. Max 255 characters.'),
    });

    const save = (fields, { setSubmitting, resetForm }) => {
        setBlocking(true)
        let method = (isAddMode) ? 'save' : 'update';
        let msgSuccess = (isAddMode)
            ? intl.formatMessage({ id: 'FLOORMAP.CREATED' })
            : intl.formatMessage({ id: 'FLOORMAP.UPDATED' });

        floorMapService[method](fields)
            .then((_response) => {
                toaster.notify('success', msgSuccess);
                setBlocking(false)
            });
    };

    return (
        <BlockUi tag='div' blocking={blocking}>
            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    save(values, { setSubmitting, resetForm });
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
                                        Floor map Information
                                    </h3>
                                    <span className='text-muted font-weight-bold font-size-sm mt-1'>
                                        Change information about the floor map
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
                                        to='/floor-maps/list'
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
                                            <label className={`required`}>Label</label>
                                            <div>
                                                <Field
                                                    as="input"
                                                    className={`form-control form-control-lg form-control-solid required ${getInputClasses(
                                                        { errors, touched },
                                                        'label'
                                                    )}`}
                                                    name='label'
                                                    placeholder='Set the Floor map label'
                                                    {...getFieldProps('label')}
                                                />
                                                <ErrorMessage name="label" component="div" className="invalid-feedback" />
                                            </div>
                                        </div>

                                        <div className='col-xl-6 col-lg-6'>
                                            <label>Description</label>
                                            <Field
                                                as="textarea"
                                                rows='5'
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
                                            <ErrorMessage name="description" component="div" className="invalid-feedback" />
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

export default injectIntl(FloorMapFormComponent);