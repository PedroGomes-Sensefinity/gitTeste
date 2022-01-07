import React, {useEffect} from 'react';
import {ErrorMessage, Field, Formik} from 'formik';
import * as Yup from 'yup';
import {Link} from 'react-router-dom';
import {makeStyles} from '@material-ui/styles';
import thresholdService from '../../services/thresholdService';
import apiService from '../../services/apiService';

import DoneIcon from '@material-ui/icons/Done';
import {getInputClasses} from '../../utils/formik';
import '../../utils/yup-validations';
import BlockUi from "react-block-ui";
import RangeSlider from 'react-bootstrap-range-slider';
import toaster from '../../utils/toaster';
import {injectIntl} from 'react-intl';
import history from '../../history';
import Map from "../geo-fencing-map/map";
import TableGrid from '../table-grid/table-grid.component';

class ThresholdFormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            intl: props.intl,
            isAddMode: !props.id,
            id: props.id,
            threshold: {},
            name: "",
            rule: {},
            ruleMeasurementType: '',
            geofences: [],
            ruleSymbol: {
                'temperaturedegree': '°C',
                'humidityrelative': '%',
            },
            limitMinValue: -100,
            limitMaxValue: 100,
            rangeMinValue: 0,
            rangeMaxValue: 0,
            routeOptions: [],
            ruleCurrentSymbol: '',
            ruleTypeOptions: [
                {id: "temperaturedegree", name: "Temperature"},
                {id: "humidityrelative", name: "Humidity"},
                {id: "geofences", name: "Geo-fences"},
            ],
            ruleActionTypesOptions: [
                {id: "alarm", name: "Alarm"},
                {id: "email", name: "Email"},
                {id: "sms", name: "SMS"},
                {id: "webhook", name: "Webhook"},
            ],
            ruleWhenCronsOptions: [
                {id: "* * * * *", name: "Daily"},
                {id: "* * * * 1,2,3,4,5", name: "Weekdays"},
                {id: "* * * * 6,7", name: "Weekend"},
                {id: "custom", name: "Custom"},
            ],
            loading: false,
            blocking: false,
        };
    }

    componentDidMount() {

    }

    initialValues = {
        id: parseInt(this.props.id),
        routeId: 0,
        name: '',
        ruleMeasurementType: '',
        ruleWhenCron: '',
        customCron: '',
        ruleWhenBetweenFrom: '',
        ruleWhenBetweenTo: '',
        ruleWhenSuccessiveTime: 0,
        min: false,
        minValue: 0,
        max: false,
        maxValue: '',
    };

    validationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        ruleMeasurementType: Yup.string().required('Type is required'),
        ruleWhenCron: Yup.string().required('When is required'),
        customCron: Yup.string().when('ruleWhenCron', {
            is: "custom",
            then: Yup.string().required('Custom cron is required')
        }),
        ruleWhenSuccessiveTime: Yup.number().min(0, 'Must be greather or equal than 0').default(0).typeError('Must be a valid number'),
        minValue: Yup.number()
            .min(-100, `Must be greather or equal than -100`)
            .default(0)
            .typeError('Must be a valid number')
            .when('ruleMeasurementType', {
                is: (val) => (val !== 'geofences'),
                then: Yup.number().required('Min value is required')
            })
            .when(['ruleMeasurementType', 'maxValue'], {
                is: (ruleMeasurementType, maxValue) => (ruleMeasurementType !== 'geofences' && maxValue !== ''),
                then: Yup.number().lessThan(Yup.ref('maxValue'), 'Must be less than Max value')
            }),
        maxValue: Yup.number()
            .min(-100, `Must be less or equal than 100`)
            .default(0)
            .typeError('Must be a valid number')
            .when('ruleMeasurementType', {
                is: (val) => (val !== 'geofences'),
                then: Yup.number().required('Max value is required')
            })
            .when('ruleMeasurementType', {
                is: (val) => (val !== 'geofences'),
                then: Yup.number().moreThan(Yup.ref('minValue'), 'Must be greather than Min value')
            })
    });

    useStyles = makeStyles((theme) => ({
        headerMarginTop: {
            marginTop: theme.spacing(5),
        }
    }));

    createThresholdObject = (values) => {
        const ruleValues = {
            min: (values.min) ? values.minValue : 0
        };

        if (values.max) {
            ruleValues['max'] = values.maxValue;
        }

        const rule = {
            type: values.ruleMeasurementType,
            do: {
                value: ruleValues
            },
            when: {
                cron: (values.ruleWhenCron !== 'custom') ? values.ruleWhenCron : values.customCron,
                successive_time: values.ruleWhenSuccessiveTime * 60
            },
            what: (typeof this.state.threshold.rule !== "undefined" && typeof this.state.threshold.rule.what !== "undefined")
                ? this.state.threshold.rule.what
                : [],
        };

        if (this.state.ruleMeasurementType === 'geofences') {
            rule['geofences'] = this.state.geofences;
        }

        const obj = {
            name: values.name,
            route_id: parseInt(values.routeId),
            rule: JSON.stringify(rule)
        };

        if (typeof values.id !== "undefined") {
            obj['id'] = values.id;
        }
        console.log(obj)
        return obj;
    }

    save = (fields, { setSubmitting, resetForm }) => {
        let threshold = this.createThresholdObject(fields);

        this.setState({blocking: true});
        let method = (this.state.isAddMode) ? 'save' : 'update';
        let msgSuccess = (this.state.isAddMode)
            ? this.state.intl.formatMessage({id: 'THRESHOLD.CREATED'})
            : this.state.intl.formatMessage({id: 'THRESHOLD.UPDATED'});

        thresholdService[method](threshold)
            .then((response) => {
                toaster.notify('success', msgSuccess);

                if (this.state.isAddMode) {
                    resetForm(this.initialValues);
                }
            }).catch((err) => {
                toaster.notify('error', err.data.detail);
            })
            .finally(() => {
                this.setState({blocking: false});
                setSubmitting(false);
            });
    };

    handleChange = (event) => {
        const { value, name } = event.target;
        this.setState({ [name]: value });
    };

    onChangeMinValue = (value, setFieldValue) => {
        this.setState({ "rangeMinValue": value });
        setFieldValue('minValue', value, false);
    }

    onChangeMaxValue = (value, setFieldValue) => {
        this.setState({ "rangeMaxValue": value });
        setFieldValue('maxValue', value, false);
    }

    render() {
        return (
            <BlockUi tag='div' blocking={this.state.blocking}>
            <Formik
                enableReinitialize
                initialValues={this.initialValues}
                validationSchema={this.validationSchema}
                onSubmit={(values, { setStatus, setSubmitting, resetForm }) => {
                    this.save(values, {
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
                    setFieldValue,
                    handleSubmit,
                    values
                }) => {
                    const classes = this.useStyles();

                    useEffect(() => {
                        this.setState({rangeMinValue: values.minValue});
                    }, [values.minValue]);

                    useEffect(() => {
                        this.setState({rangeMaxValue: values.maxValue});
                    }, [values.maxValue]);

                    useEffect(() => {
                        apiService.get('route', 100, 0).then((response) => {
                            let routes = [];

                            response.routes.forEach(function (route) {
                                routes.push({
                                    id: route.id,
                                    name: route.label,
                                });
                            });
                            console.log(routes)
                            this.setState({routeOptions: routes});
                        });
                    }, []);

                    useEffect(() => {
                        this.setState({ruleCurrentSymbol: this.state.ruleSymbol[values.ruleMeasurementType]});
                        this.setState({ruleMeasurementType: values.ruleMeasurementType});
                    }, [values.ruleMeasurementType]);

                    useEffect(() => {
                        if (!this.state.isAddMode && this.state.id !== 'new') {
                            apiService
                            .getById('threshold', this.state.id)
                            .then((response) => {
                                const threshold = response.thresholds[0];
                                const rule = JSON.parse(threshold.rule);
                                threshold.rule = rule;
                                this.setState({threshold: threshold});

                                setFieldValue('name', threshold.name, false);
                                setFieldValue('ruleMeasurementType', rule.type, false);

                                if (typeof(rule.do) !== 'undefined') {
                                    if (typeof(rule.do.value) !== 'undefined') {
                                        if (typeof(rule.do.value.min) !== 'undefined') {
                                            setFieldValue('minValue', rule.do.value.min, false);
                                            setFieldValue('min', true, true);
                                            this.setState({rangeMinValue: rule.do.value.min});
                                        }
                                        if (typeof(rule.do.value.max) !== 'undefined') {
                                            setFieldValue('maxValue', rule.do.value.max, false);
                                            setFieldValue('max', true, true);
                                            this.setState({rangeMaxValue: rule.do.value.max});
                                        }
                                    }
                                }
                                if (typeof(rule.when) !== 'undefined') {
                                    if (typeof(rule.when.cron) !== 'undefined') {
                                        setFieldValue('ruleWhenCron', rule.when.cron, false);

                                    }
                                }

                                if (rule.type === 'geofences' && typeof rule.geofences !== 'undefined') {
                                    this.setState({geofences: rule.geofences})
                                }
                            });
                        }
                    }, []);

                    return (
                        <form
                            className='card card-custom'
                            onSubmit={handleSubmit}>
                            {/* begin::Header */}
                            <div
                                className={
                                    `card-header py-3 ` +
                                    classes.headerMarginTop
                                }>
                                <div className='card-title align-items-start flex-column'>
                                    <h3 className='card-label font-weight-bolder text-dark'>
                                        Threshold Information
                                    </h3>
                                    {typeof this.state.id !== "undefined" &&
                                        <span className='text-muted font-weight-bold font-size-sm mt-1'>
                                            Change information about the thresholds
                                        </span>
                                    }
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
                                        to='/thresholds/list'
                                        className='btn btn-secondary'>
                                        Cancel
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
                                            <div>
                                                <Field
                                                    as='input'
                                                    className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                        { errors, touched },
                                                        'name'
                                                    )}`}
                                                    name='name'
                                                    placeholder='Threshold name'
                                                    {...getFieldProps('name')}
                                                />
                                                <ErrorMessage
                                                    name='name'
                                                    component='div'
                                                    className='invalid-feedback'
                                                />
                                            </div>
                                        </div>
                                        <div className='col-xl-3 col-lg-3'>
                                            <label>Type</label>
                                            <Field
                                                as="select"
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                    {errors, touched},
                                                    'ruleMeasurementType'
                                                )}`}
                                                name='ruleMeasurementType'
                                                placeholder=''
                                                {...getFieldProps('ruleMeasurementType')}
                                            >
                                                <option key='' value=''></option>
                                                {this.state.ruleTypeOptions.map((e) => {
                                                    return (<option key={e.id} value={e.id}>{e.name}</option>);
                                                })}
                                            </Field>
                                            <ErrorMessage
                                                name='ruleMeasurementType'
                                                component='div'
                                                className='invalid-feedback'
                                            />
                                        </div>
                                        <div className={`col-xl-3 col-lg-3 ${(values.ruleMeasurementType === 'geofences' ? 'hide' : '')}`}>
                                            <div className={`mt-10 `}>
                                                <div className="form-check form-check-inline">
                                                    <Field
                                                        className='form-check-input'
                                                        name='min'
                                                        type='checkbox'
                                                    />
                                                    <label htmlFor="min" className='form-check-label"' style={{'marginTop':'5px'}}> Min</label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <Field
                                                        className='form-check-input'
                                                        name='max'
                                                        type='checkbox'
                                                    />
                                                    <label htmlFor="max" className='form-check-label"' style={{'marginTop':'5px'}}>Max</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`col-xl-3 col-lg-3 ${(values.ruleMeasurementType === 'geofences' ? '' : 'hide')}`}>
                                            <label>Route</label>
                                            <Field
                                                as="select"
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                    {errors, touched},
                                                    'routeId'
                                                )}`}
                                                name='routeId'
                                                placeholder=''
                                                {...getFieldProps('routeId')}
                                            >
                                                <option key='' value=''></option>
                                                {this.state.routeOptions.map((e) => {
                                                    return (<option key={e.id} value={e.id}>{e.name}</option>);
                                                })}
                                            </Field>
                                            <ErrorMessage
                                                name='route'
                                                component='div'
                                                className='invalid-feedback'
                                            />
                                        </div>
                                    </div>

                                    <div className={'form-group row ' + (((!values.max && !values.min) || values.ruleMeasurementType === 'geofences') ? 'hide' : '')}>
                                        <div className={'row col-xl-6 col-lg-6 ' + (!values.min ? 'hide' : '')}>
                                            <div className='col-xl-3 col-lg-3'>
                                                <label>Min</label>
                                                <Field
                                                    as='input'
                                                    className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                        { errors, touched },
                                                        'minValue'
                                                    )}`}
                                                    name='minValue'
                                                    {...getFieldProps('minValue')}
                                                />
                                                <ErrorMessage
                                                    name='minValue'
                                                    component='div'
                                                    className='invalid-feedback'
                                                />
                                            </div>
                                            <div className='col-xl-9 col-lg-9'>
                                                <RangeSlider
                                                    className='mt-8'
                                                    name='rangeMinValue'
                                                    value={this.state.rangeMinValue}
                                                    onChange={e => this.onChangeMinValue(e.target.value, setFieldValue)}
                                                    min={this.state.limitMinValue}
                                                    max={this.state.limitMaxValue}
                                                    tooltipLabel={currentValue => `${currentValue}${this.state.ruleCurrentSymbol}`}
                                                />
                                            </div>
                                        </div>
                                        <div className={'row col-xl-6 col-lg-6 ' + (!values.max ? 'hide' : '')}>
                                            <div className='col-xl-9 col-lg-9'>
                                                <RangeSlider
                                                    className='mt-8'
                                                    name='rangeMaxValue'
                                                    value={this.state.rangeMaxValue}
                                                    onChange={e => this.onChangeMaxValue(e.target.value, setFieldValue)}
                                                    min={this.state.limitMinValue}
                                                    max={this.state.limitMaxValue}
                                                    tooltipLabel={currentValue => `${currentValue}${this.state.ruleCurrentSymbol}`}
                                                />
                                            </div>
                                            <div className='col-xl-3 col-lg-3'>
                                                <label>Max</label>
                                                <Field
                                                    as='input'
                                                    className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                        { errors, touched },
                                                        'maxValue'
                                                    )}`}
                                                    name='maxValue'
                                                    {...getFieldProps('maxValue')}
                                                />
                                                <ErrorMessage
                                                    name='maxValue'
                                                    component='div'
                                                    className='invalid-feedback'
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className={'form-group row'}>
                                        <div className={`col-xl-3 col-lg-3`}>
                                            <label>When</label>
                                            <Field
                                                as='select'
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                    { errors, touched },
                                                    'ruleWhenCron'
                                                )}`}
                                                name='ruleWhenCron'
                                                {...getFieldProps('ruleWhenCron')}
                                            >
                                                <option key='' value=''/>
                                                {this.state.ruleWhenCronsOptions.map((e) => {
                                                    return (<option key={e.id} value={e.id}>{e.name}</option>);
                                                })}
                                            </Field>
                                            <ErrorMessage
                                                name='ruleWhenCron'
                                                component='div'
                                                className='invalid-feedback'
                                            />
                                        </div>
                                        <div className={`col-xl-3 col-lg-3 ${(values.ruleWhenCron !== 'custom' ? 'hide' : '')}`}>
                                            <label>Custom cron</label>
                                            <Field
                                                as='input'
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                    { errors, touched },
                                                    'customCron'
                                                )}`}
                                                name='customCron'
                                                {...getFieldProps('customCron')}
                                            />
                                            <ErrorMessage
                                                name='customCron'
                                                component='div'
                                                className='invalid-feedback'
                                            />
                                        </div>
                                        <div className={`col-xl-2 col-lg-2`}>
                                            <label>Start time</label>
                                            <input
                                                type='time'
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                    { errors, touched },
                                                    'ruleWhenBetweenFrom'
                                                )}`}
                                                name='ruleWhenBetweenFrom'
                                                {...getFieldProps('ruleWhenBetweenFrom')}
                                            />
                                            <ErrorMessage
                                                name='ruleWhenBetweenFrom'
                                                component='div'
                                                className='invalid-feedback'
                                            />
                                        </div>
                                        <div className={`col-xl-2 col-lg-2`}>
                                            <label>End time</label>
                                            <input
                                                type='time'
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                    { errors, touched },
                                                    'ruleWhenBetweenTo'
                                                )}`}
                                                name='ruleWhenBetweenTo'
                                                {...getFieldProps('ruleWhenBetweenTo')}
                                            />
                                            <ErrorMessage
                                                name='ruleWhenBetweenTo'
                                                component='div'
                                                className='invalid-feedback'
                                            />
                                        </div>
                                    </div>

                                    <div className='form-group row'>
                                        <div className={`col-xl-3 col-lg-3`}>
                                            <label>Persistence (minutes)</label>
                                            <Field
                                                as='input'
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                    { errors, touched },
                                                    'ruleWhenSuccessiveTime'
                                                )}`}
                                                name='ruleWhenSuccessiveTime'
                                                {...getFieldProps('ruleWhenSuccessiveTime')}
                                            />
                                            <ErrorMessage
                                                name='ruleWhenSuccessiveTime'
                                                component='div'
                                                className='invalid-feedback'
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
}

export default injectIntl(ThresholdFormComponent);