import React, {useEffect} from 'react';
import {ErrorMessage, Field, Formik} from 'formik';
import * as Yup from 'yup';
import {Link} from 'react-router-dom';
import {makeStyles} from '@material-ui/styles';
import userService from '../../services/userService';
import apiService from '../../services/apiService';
import {AsyncTypeahead} from 'react-bootstrap-typeahead';
import DoneIcon from '@material-ui/icons/Done';
import {getInputClasses} from '../../utils/formik';
import '../../utils/yup-validations';
import BlockUi from "react-block-ui";
import toaster from '../../utils/toaster';
import { injectIntl } from 'react-intl';

class UserFormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            intl: props.intl,
            id: props.id,
            isAddMode: !props.id,
            profiles: [],
            username: "",
            password: "",
            metadata: "",
            profile_id: 0,
            loading: false,
            blocking: false,
        };

    }

    componentDidMount() {
        apiService
            .get('profile',100, 0)
            .then((response) => {
                this.setState({profiles: response.profiles})
            });
    }

    initialValues = {
        id: this.props.id,
        profileId: 0,
        name: '',
        username: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        comments: '',
        metadata: {},
        profile: {},
    };

    validationSchema = Yup.object().shape({
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
        email: Yup.string().email(),
        phone: Yup.number(),
    });

    useStyles = makeStyles((theme) => ({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
            maxWidth: 300,
        },
        chips: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        chip: {
            margin: 2,
            height: 50,
        },
        headerMarginTop: {
            marginTop: theme.spacing(5),
        },
        noLabel: {
            marginTop: theme.spacing(3),
        },
    }));

    saveUser = (fields, { setStatus, setSubmitting, resetForm }) => {
        fields.metadata = JSON.stringify({
            address : fields.address,
            phone   : fields.phone,
            comments: fields.comments,
        });
        const profileArr = this.state.profiles.filter((e) => {
            return e.id === parseInt(fields.profileId);
        });
        fields.profile = profileArr[0];

        this.setState({blocking: true});
        let method = (this.state.isAddMode) ? 'save' : 'update';
        let msgSuccess = (this.state.isAddMode)
            ? this.state.intl.formatMessage({id: 'USER.CREATED'})
            : this.state.intl.formatMessage({id: 'USER.UPDATED'});

        userService[method](fields)
            .then((response) => {
                toaster.notify('success', msgSuccess);
                this.setState({blocking: false});
                setSubmitting(false);
            });
    };

    render() {
        return (
            <BlockUi tag='div' blocking={this.state.blocking}>
            <Formik
                enableReinitialize
                initialValues={this.initialValues}
                validationSchema={this.validationSchema}
                onSubmit={(values, { setStatus, setSubmitting, resetForm }) => {
                    this.saveUser(values, {
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
                    setFieldValue,
                    handleSubmit,
                    handleChange
                }) => {
                    const classes = this.useStyles();

                    useEffect(() => {
                        if (!this.state.isAddMode && this.state.id !== 'new') {
                            apiService
                            .getById('user', this.state.id)
                            .then((response) => {
                                const res       = response.users[0];
                                setFieldValue('name', res.name, false);
                                setFieldValue('username', res.username, false);
                                setFieldValue('profileId', res.profile.id, false);
                                setFieldValue('email', res.email, false);

                                if (res.metadata !== '') {
                                    const metadata  = JSON.parse(res.metadata);
                                    setFieldValue('phone', metadata.phone, false);
                                    setFieldValue('comments', metadata.comments, false);
                                    setFieldValue('address', metadata.address, false);
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
                                className={`card-header py-3 `+ classes.headerMarginTop}>
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
                                        to='/devices/list'
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
                                                    as="input"
                                                    className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                        {errors, touched},
                                                        'name'
                                                    )}`}
                                                    name='name'
                                                    placeholder='Set the name of the user'
                                                    {...getFieldProps('name')}
                                                />
                                                <ErrorMessage name="name" component="div" className="invalid-feedback" />
                                            </div>
                                        </div>
                                        <div className='col-xl-6 col-lg-6'>
                                            <label>Profile</label>
                                            <Field
                                                component="select"
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                    { errors, touched },
                                                    'type'
                                                )}`}
                                                name='profileId'
                                                placeholder='Select the user profile'
                                            >
                                                <option key='0' value=''>&nbsp;</option>
                                                {this.state.profiles.map((e) =>
                                                    <option value={e.id} key={e.id}>{e.name}</option>
                                                )}
                                            </Field>
                                        </div>
                                    </div>

                                    { this.state.isAddMode &&
                                    <div className='form-group row'>
                                        <div className='col-xl-4 col-lg-4'>
                                            <label>Username</label>
                                            <Field
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                    {errors, touched},
                                                    'username'
                                                )}`}
                                                placeholder='Set the username'
                                                {...getFieldProps('username')}
                                            />
                                            <ErrorMessage name="username" component="div" className="invalid-feedback" />
                                        </div>

                                        <div className='col-xl-4 col-lg-4'>
                                            <label>Password</label>
                                            <Field
                                                as="input"
                                                type="password"
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                    {errors, touched},
                                                    'password'
                                                )}`}
                                                name='password'
                                                placeholder='Set the password'
                                                {...getFieldProps('password')}
                                            />
                                            <ErrorMessage name="password" component="div" className="invalid-feedback"/>
                                        </div>
                                        <div className='col-xl-4 col-lg-4'>
                                            <label>Repeat Password</label>
                                            <Field
                                                as="input"
                                                type="password"
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                {errors, touched},
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

                                    {!this.state.isAddMode &&
                                    <div className='form-group row'>
                                        <div className='col-xl-12 col-lg-12'>
                                            <label>Username</label>
                                            <Field
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                    {errors, touched},
                                                    'username'
                                                )}`}
                                                placeholder='Set the username'
                                                {...getFieldProps('username')}
                                            />
                                            <ErrorMessage name="username" component="div" className="invalid-feedback"/>
                                        </div>
                                    </div>
                                    }

                                    <div className='form-group row'>
                                        <div className='col-xl-6 col-lg-6'>
                                            <label>Email</label>
                                            <Field
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                    {errors, touched},
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
                                                    {errors, touched},
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
                                                    {errors, touched},
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
                                                        {errors, touched},
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
}

export default injectIntl(UserFormComponent);