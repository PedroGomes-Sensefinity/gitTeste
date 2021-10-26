import React, {useEffect} from 'react';
import {ErrorMessage, Field, Formik} from 'formik';
import * as Yup from 'yup';
import {Link} from 'react-router-dom';
import {makeStyles} from '@material-ui/styles';
import DoneIcon from '@material-ui/icons/Done';
import {getInputClasses} from '../../utils/formik';
import BlockUi from "react-block-ui";
import toaster from '../../utils/toaster';
import { injectIntl } from 'react-intl';
import apiService from '../../services/apiService';
import tenantsService from "../../services/tenantsService";

class TenantsFormComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            intl: props.intl,
            id: props.id,
            isAddMode: !props.id,
            loading: false,
            blocking: false,
            tabValue: 0
        };
    }

    componentDidMount() {
        apiService.get('permission', 100, 0).then((response) => {
            this.setState({groups: response.containers});
        });
    }

    initialValues = {
        id:         parseInt(this.props.id),
        name:       '',
        metadata:   '',
        containers: {id: 0},
        contact_name: '',
        email:      '',
        phone:      '',
        zip:        '',
        country:    '',
        state:      '',
        city:       '',
        address:    '',
        comments:   '',
        color:      '',
        files:      [],
        attachment: File
    };

    validationSchema = Yup.object().shape({
        name:    Yup.string().required('Tenant name is required'),
        address: Yup.string().required('Address is required'),
        email:   Yup.string().email('Must be a valid email'),
        phone:   Yup.number().typeError('Must be only numbers'),
        zip:     Yup.number().typeError('Must be only numbers'),
    });

    useStyles = makeStyles((theme) => ({
        headerMarginTop: {
            marginTop: theme.spacing(5),
        }
    }));

    save = (fields, { setFieldValue, setSubmitting, resetForm }) => {
        this.setState({blocking: true});
        setSubmitting(true);

        fields.metadata =  JSON.stringify({
            contact_name : fields.contact_name,
            email        : fields.email,
            phone        : fields.phone,
            zip          : fields.zip,
            country      : fields.country,
            state        : fields.state,
            city         : fields.city,
            address      : fields.address,
            comments     : fields.comments,
        });

        let method = (this.state.isAddMode) ? 'save' : 'update';
        let msgSuccess = (this.state.isAddMode)
            ? this.state.intl.formatMessage({id: 'TENANT.CREATED'})
            : this.state.intl.formatMessage({id: 'TENANT.UPDATED'});

        tenantsService[method](fields, fields.id)
            .then((response) => {
                toaster.notify('success', msgSuccess);
                setSubmitting(false);

                this.setState({blocking: false});

                if (this.state.isAddMode) {
                    resetForm(this.initialValues);
                }
            });
    };


    render() {
        return (
            <BlockUi tag='div' blocking={this.state.blocking}>
                <Formik
                    enableReinitialize
                    initialValues={this.initialValues}
                    validationSchema={this.validationSchema}
                    onSubmit={(values, {setFieldValue, setSubmitting, resetForm}) => {
                        this.save(values, {
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
                          setFieldValue,
                          handleSubmit
                      }) => {
                        const classes = this.useStyles();

                        useEffect(() => {
                            if (!this.state.isAddMode && this.state.id !== 'new') {
                                apiService
                                    .getById('tenant_new', this.state.id)
                                    .then((response) => {
                                        if ('tenants_new' in response && response.tenants_new.length === 1) {
                                            let tenant = response.tenants_new[0];
                                            setFieldValue('id', tenant.id, false);
                                            setFieldValue('name', tenant.name, false);

                                            if (tenant.metadata !== '') {
                                                const metadata = JSON.parse(tenant.metadata);
                                                setFieldValue('metadata', metadata, false);

                                                setFieldValue('contact_name', metadata.contact_name, false);
                                                setFieldValue('email', metadata.email, false);
                                                setFieldValue('phone', metadata.phone, false);
                                                setFieldValue('zip', metadata.zip, false);
                                                setFieldValue('country', metadata.country, false);
                                                setFieldValue('state', metadata.state, false);
                                                setFieldValue('city', metadata.city, false);
                                                setFieldValue('address', metadata.address, false);
                                                setFieldValue('comments', metadata.comments, false);
                                            }
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
                                            <DoneIcon/>
                                            Save Changes
                                            {isSubmitting}
                                        </button>
                                        <Link
                                            to='/tenants-new/list'
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
                                            <div className='col-xl-12 col-lg-12'>
                                                <label>Tenant name</label>
                                                <Field
                                                    as="input"
                                                    className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                        {errors, touched},
                                                        'name'
                                                    )}`}
                                                    name='name'
                                                    placeholder='Set the tenant name'
                                                    {...getFieldProps('name')}
                                                />
                                                <ErrorMessage name="name" component="div"
                                                              className="invalid-feedback"/>
                                            </div>

                                        </div>

                                        <div className='form-group row'>
                                            <div className='col-xl-4 col-lg-4'>
                                                <label>Contact Name</label>
                                                <Field
                                                    className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                        {errors, touched},
                                                        'contact_name'
                                                    )}`}
                                                    placeholder='Set the contact name'
                                                    {...getFieldProps('contact_name')}
                                                />
                                                <ErrorMessage name="contact_name" component="div"
                                                              className="invalid-feedback"/>
                                            </div>

                                            <div className='col-xl-4 col-lg-4'>
                                                <label>Email</label>
                                                <Field
                                                    className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                        {errors, touched},
                                                        'email'
                                                    )}`}
                                                    placeholder='Set the email'
                                                    {...getFieldProps('email')}
                                                />
                                                <ErrorMessage name="email" component="div"
                                                              className="invalid-feedback"/>
                                            </div>

                                            <div className='col-xl-4 col-lg-4'>
                                                <label>Phone number</label>
                                                <Field
                                                    className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                        {errors, touched},
                                                        'phone'
                                                    )}`}
                                                    placeholder='Set the phone number'
                                                    {...getFieldProps('phone')}
                                                />
                                                <ErrorMessage name="phone" component="div"
                                                              className="invalid-feedback"/>
                                            </div>
                                        </div>

                                        <div className='form-group row'>
                                            <div className='col-xl-3 col-lg-3'>
                                                <label>Zip Code</label>
                                                <Field
                                                    className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                        {errors, touched},
                                                        'zip'
                                                    )}`}
                                                    placeholder='Set the zipcode'
                                                    {...getFieldProps('zip')}
                                                />
                                                <ErrorMessage name="zip" component="div"
                                                              className="invalid-feedback"/>
                                            </div>
                                            <div className='col-xl-3 col-lg-3'>
                                                <label>Country</label>
                                                <Field
                                                    className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                        {errors, touched},
                                                        'country'
                                                    )}`}
                                                    placeholder='Set the country'
                                                    {...getFieldProps('country')}
                                                />
                                                <ErrorMessage name="country" component="div"
                                                              className="invalid-feedback"/>
                                            </div>
                                            <div className='col-xl-3 col-lg-3'>
                                                <label>Province/State</label>
                                                <Field
                                                    className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                        {errors, touched},
                                                        'state'
                                                    )}`}
                                                    placeholder='Set the province/state'
                                                    {...getFieldProps('state')}
                                                />
                                                <ErrorMessage name="state" component="div"
                                                              className="invalid-feedback"/>
                                            </div>
                                            <div className='col-xl-3 col-lg-3'>
                                                <label>City</label>
                                                <Field
                                                    className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                        {errors, touched},
                                                        'city'
                                                    )}`}
                                                    placeholder='Set the city'
                                                    {...getFieldProps('city')}
                                                />
                                                <ErrorMessage name="city" component="div"
                                                              className="invalid-feedback"/>
                                            </div>
                                        </div>

                                        <div className='form-group row'>
                                            <div className='col-xl-12 col-lg-12'>
                                                <label>Address</label>
                                                <Field
                                                    className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                        {errors, touched},
                                                        'address'
                                                    )}`}
                                                    placeholder='Set the address'
                                                    {...getFieldProps('address')}
                                                />
                                                <ErrorMessage name="address" component="div"
                                                              className="invalid-feedback"/>
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
                                                            {errors, touched},
                                                            'comments'
                                                        )}`}
                                                        name='comments'
                                                        placeholder=''
                                                        {...getFieldProps(
                                                            'comments'
                                                        )}
                                                    />
                                                    <ErrorMessage name="comments" component="div"
                                                                  className="invalid-feedback"/>
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
}

export default injectIntl(TenantsFormComponent);