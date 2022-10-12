import React, {useEffect, useState} from 'react';
import {ErrorMessage, Field, Formik} from 'formik';
import * as Yup from 'yup';
import {Link} from 'react-router-dom';
import {makeStyles} from '@material-ui/styles';
import DoneIcon from '@material-ui/icons/Done';
import {getInputClasses} from '../../utils/formik';
import '../../utils/yup-validations';
import BlockUi from "react-block-ui";
import toaster from '../../utils/toaster';
import { injectIntl } from 'react-intl';
import apiService from '../../services/apiService';
import assetsService from "../../services/assetsService";

const useStyles = makeStyles((theme) => ({
    headerMarginTop: {
        marginTop: theme.spacing(5),
    }
}));

function AssetsFormComponentFunctional (props) {

    const [ruleTypeOptions, setRuleTypeOptions]  = useState([
        {id: 1, name: "No Types"},
    ])
    const isAddMode = !props.id
    const [blocking, setBlocking] = useState(false)
    
    const initialValues = props.asset

    useEffect(() => {
        apiService.getByEndpoint('asset-types').then((response) => {
            let ruleTypeOptions = []
            if(response.asset_types !== undefined) {
               response.asset_types.forEach(function(assetType) {
                    ruleTypeOptions.push({id: assetType.id, name: assetType.label})
                })
            }
            setRuleTypeOptions(ruleTypeOptions)
        });

    }, [])

    const validationSchema = Yup.object().shape({
        label: Yup.string().required('Label is required'),
        asset_type_id: Yup.string().required('Type is required'),
    });

    const classes = useStyles();

    const save = (fields, { setFieldValue, setSubmitting, _ }) => {
        setBlocking(true);
        setSubmitting(true);

        let method = (isAddMode) ? 'save' : 'update';
        let msgSuccess = (isAddMode)
            ? props.intl.formatMessage({id: 'ASSETS.CREATED'})
            : props.intl.formatMessage({id: 'ASSETS.UPDATED'});

        assetsService[method](fields)
            .then((response) => {
                toaster.notify('success', msgSuccess);
                setSubmitting(false);

                setBlocking(false);

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
                    values.asset_type_id = Number(values.asset_type_id)
                    if(values.asset_type_id === 0){
                        values.asset_type_id = 1
                    }
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
                    _,
                    handleSubmit,
                    __
                }) => <form
                            className='card card-custom'
                            onSubmit={handleSubmit}>
                            {/* begin::Header */}
                            <div
                                className={`card-header py-3 `+ classes.headerMarginTop}>
                                <div className='card-title align-items-start flex-column'>
                                    <h3 className='card-label font-weight-bolder text-dark'>
                                        Asset Information
                                    </h3>
                                    <span className='text-muted font-weight-bold font-size-sm mt-1'>
                                        Change general configurations about board family
                                    </span>
                                    <span className='text-muted font-weight-bold font-size-sm mt-1'>
                                        <label className="required">&nbsp;</label> All fields marked with asterisks are required
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
                                        to='/assets/list'
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
                                            <Field
                                                as="input"
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                        {errors, touched},
                                                        'label'
                                                    )}`}
                                                name='name'
                                                placeholder='Set the asset label'
                                                {...getFieldProps('label')}
                                            />
                                            <ErrorMessage name="label" component="div" className="invalid-feedback" />
                                        </div>


                                        <div className='col-xl-6 col-lg-6'>
                                            <label>Description</label>
                                            <Field
                                                as="textarea"
                                                rows='3'
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                    {errors, touched},
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
                                    <div className='form-group row'>

                                        <div className='col-xl-6 col-lg-6'>
                                            <label>Weight</label>
                                            <Field
                                                type={"number"} 
                                                as="input"
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                        {errors, touched},
                                                        'label'
                                                    )}`}
                                                name='name'
                                                placeholder='Set the asset Weight'
                                                {...getFieldProps('weight')}
                                            />
                                        </div>


                                        <div className='col-xl-3 col-lg-3'>
                                            <label className={`required`}>Type</label>
                                            <Field
                                                type={"number"} 
                                                as="select"
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                    {errors, touched},
                                                    'asset_type_id'
                                                )}`}
                                                name='asset_type_id'
                                                placeholder=''
                                                {...getFieldProps('asset_type_id')}
                                            >
                                                <option key='' value=''></option>
                                                {ruleTypeOptions.map((e) => {
                                                    return (<option key={e.id} value={e.id}>{e.name}</option>);
                                                })}
                                            </Field>
                                            <ErrorMessage
                                                name='asset_type_id'
                                                component='div'
                                                className='invalid-feedback'
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* end::Form */}
                        </form>
                }
            </Formik>
            </BlockUi>
        );
}

export default injectIntl(AssetsFormComponentFunctional);
