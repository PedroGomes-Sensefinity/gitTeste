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
import profilesService from "../../services/profilesService";

class ProfilesFormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            intl: props.intl,
            id: props.id,
            isAddMode: !props.id,
            loading: false,
            blocking: false,
        };
    }

    componentDidMount() {}

    initialValues = {
        id: '',
        name: '',
    };

    validationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
    });

    useStyles = makeStyles((theme) => ({
        headerMarginTop: {
            marginTop: theme.spacing(5),
        }
    }));

    save = (fields, { setFieldValue, setSubmitting, resetForm }) => {
        this.setState({blocking: true});
        setSubmitting(true);

        let method = (this.state.isAddMode) ? 'save' : 'update';
        let msgSuccess = (this.state.isAddMode)
            ? this.state.intl.formatMessage({id: 'PROFILES.CREATED'})
            : this.state.intl.formatMessage({id: 'PROFILES.UPDATED'});

        profilesService[method](fields)
            .then((response) => {
                toaster.notify('success', msgSuccess);
                setSubmitting(false);

                this.setState({blocking: false});

                if (this.state.isAddMode) {
                    setFieldValue('name', '', false);
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
                onSubmit={(values, { setFieldValue, setSubmitting, resetForm }) => {
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
                        console.log(this.state.isAddMode, this.state.id);
                        if (!this.state.isAddMode && this.state.id !== 'new') {
                            apiService
                            .getById('profile', this.state.id)
                            .then((response) => {
                                if ('profiles' in response && response.profiles.length === 1) {
                                    let profile = response.profiles[0];
                                    setFieldValue('id', profile.id, false);
                                    setFieldValue('name', profile.name, false);
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
                                            <label>Name</label>
                                            <Field
                                                as="input"
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                        {errors, touched},
                                                        'name'
                                                    )}`}
                                                name='name'
                                                placeholder='Set the profile name'
                                                {...getFieldProps('name')}
                                            />
                                            <ErrorMessage name="name" component="div" className="invalid-feedback" />
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

export default injectIntl(ProfilesFormComponent);