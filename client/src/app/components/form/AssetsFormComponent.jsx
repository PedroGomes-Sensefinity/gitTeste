import DoneIcon from '@material-ui/icons/Done';
import { makeStyles } from '@material-ui/styles';
import { ErrorMessage, Field, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import BlockUi from "react-block-ui";
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import apiService from '../../services/apiService';
import assetsService from "../../services/assetsService";
import {AsyncTypeahead, Typeahead} from 'react-bootstrap-typeahead';
import { getInputClasses } from '../../utils/formik';
import toaster from '../../utils/toaster';
import '../../utils/yup-validations';


const useStyles = makeStyles((theme) => ({
    headerMarginTop: {
        marginTop: theme.spacing(5),
    }
}));

function AssetsFormComponentFunctional (props) {

    const [ruleTypeOptions, setRuleTypeOptions]  = useState([
        {id: 1, name: "No Types", type: "NA"},
    ])
    const isAddMode = !props.id
    const [blocking, setBlocking] = useState(false)
    const [loading, setLoading] = useState(false)

    const [thresholds,setThresholds] = useState([])
    const [selectedThresholds,setSelectedThresholds] = useState([])
    const [selectedThresholdsId, setSelectedThresholdsId] = useState([])
    
    const initialValues = props.asset || {id: '',label: '',description: '',asset_type_id: 1,devices: [],weight: 0.0,type: [],}

    

    useEffect(() => {
        apiService.getByEndpoint('asset-types').then((response) => {
            let ruleTypeOptions = []
            if(response.asset_types !== undefined) {
               response.asset_types.forEach(function(assetType) {
                    ruleTypeOptions.push({id: assetType.id, name: assetType.label, type: assetType.type})
                })
            }
            setRuleTypeOptions(ruleTypeOptions)
        });

        if(props.asset !== undefined ){
            const endpoint = "asset/" + props.asset.id  + "/thresholds"
            apiService.getByEndpoint(endpoint).then((response) => {

                setSelectedThresholds(response.thresholds)
                const ids = selectedThresholdsId
                if(response.thresholds !== undefined && response.thresholds !== []){
                    response.thresholds.forEach(function(threshold) {
                        ids.push(threshold.id)
                    })
                    setSelectedThresholdsId(ids)
                }
            });
        }

    }, [])

    const onChangeThreshold = (opt) => {
        let selectedIds = [];

        if (opt.length > 0) {
            selectedIds = opt.map((t) => t.id);
        }
        setSelectedThresholdsId(selectedIds)
        setSelectedThresholds(opt)
    };

    const handleSearchThreshold = (query) => {
        setLoading(true)

        apiService.getByText('threshold', query, 100, 0).then((response) => {
            const thresholds = (typeof response.thresholds !== undefined && Array.isArray(response.thresholds))
                ? filterThresholdSelected(response.thresholds)
                : [];

            setThresholds(thresholds)
            setLoading(false) 
        });
    };

    const filterThresholdSelected = (options) => {
        let data = [];
        options.map((t) => {
            if(!Array.from(selectedThresholdsId).includes(t.id)) {
                data.push({
                    id: t.id,
                    label: t.name
                });
            }
        });
        return data;
    }

    const filterBy = () => true;


    const onlyLetters =  (str) => {
        return /^[a-zA-Z]+$/.test(str);
    }

    const validateLabel = (value) => {
        let error;
        let type;

        ruleTypeOptions.forEach(function(options) {
            if(options["id"] === initialValues.asset_type_id){
                type = options["type"]
            }
        })
        if(type === "Container"){
            if(value.length !== 12){
                error = "Invalid Label - Size Incorrect (e.g: AAAA111111-2)"
                return error
            }
            let string4 = value.substring(0, 4)
            if(!onlyLetters(string4)){
                error = "Invalid Label - Please enter only letters for Owner Code and Product Group Code (e.g: AAAA111111-2)"
                return error
            }
            let string6 = value.substring(5, 10)
            let isnum = /^\d+$/.test(string6);
            if(!isnum){
                error = "Invalid Label - Please enter only numbers on Serial Number (e.g: AAAA111111-2)"
                return error
            }
            let string2 = value.substring(11, 13)
            let isnum2 = /^\d+$/.test(string2);
            if(!isnum2){
                error = "Invalid Label - Please enter only numbers on Check Digits (e.g: AAAA111111-2)"
                return error
            }
            let stringSpecialChar = value.substring(10, 11)
            if(stringSpecialChar !== "-"){
                error = "Invalid Label - Special character must be \"-\" (e.g: AAAA111111-2)"
                return error
            }
        }
        return error
    };

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
        
        fields["threshold_ids"] = selectedThresholdsId
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

                                        <div className='col-xl-6 col-lg-6'>
                                            <label className={`required`}>Label</label>
                                            <Field
                                                validate = {validateLabel}
                                                as="input"
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                        {errors, touched},
                                                        'label'
                                                    )}`}
                                                name='label'
                                                placeholder='Set the asset label'
                                                {...getFieldProps('label')}
                                            />
                                            <ErrorMessage name="label" component="div" className="invalid-feedback" />
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
                                                name='weight'
                                                placeholder='Set the asset Weight'
                                                {...getFieldProps('weight')}
                                            />
                                            <ErrorMessage
                                                name='weight'
                                                component='div'
                                                className='invalid-feedback'
                                            />
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

                                    <div className='col-xl-12 col-lg-12'>
                                    <label>Threshold</label>
                                            <div>
                                            <AsyncTypeahead
                                                id='typeahead-threshold'
                                                labelKey='label'
                                                size="lg"
                                                multiple
                                                onChange={onChangeThreshold}
                                                options={thresholds}
                                                placeholder=''
                                                selected={selectedThresholds}
                                                onSearch={handleSearchThreshold}
                                                isLoading={loading}
                                                filterBy={filterBy}
                                                useCache={false}
                                            />
                                            </div>  
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
