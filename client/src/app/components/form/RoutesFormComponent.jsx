import React, {useEffect} from 'react';
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
import {Form, ListGroup} from 'react-bootstrap';
import routesService from "../../services/routesService";
import {AsyncTypeahead} from "react-bootstrap-typeahead";

class RoutesFormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            intl: props.intl,
            id: props.id,
            isAddMode: !props.id,
            selectedDevice: 0,
            devices: [],
            loading: false,
            blocking: false,
        };
    }

    componentDidMount() {}

    initialValues = {
        id: '',
        label: '',
        description: '',
        devices: [],
    };

    validationSchema = Yup.object().shape({
        label: Yup.string().required('Label is required')
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
            ? this.state.intl.formatMessage({id: 'ROUTES.CREATED'})
            : this.state.intl.formatMessage({id: 'ROUTES.UPDATED'});

        routesService[method](fields)
            .then((response) => {
                toaster.notify('success', msgSuccess);
                setSubmitting(false);

                this.setState({blocking: false});

                if (this.state.isAddMode) {
                    setFieldValue('label', '', false);
                    setFieldValue('description', '', false);
                    setFieldValue('devices', [], false);
                }
            });
    };

    onChangeDevice = (opt, setFieldValue) => {

        if (opt.length > 0) {
            this.setState({ devices: this.state.devices.append(opt[0].id)});
            setFieldValue('devices', this.state.devices.append(opt[0].id));
        }
    };
    handleSearchDevice = (query) => {
        this.setState({loading: true});

        apiService.getByText('device', query, 100, 0).then((response) => {
            this.setState({ devices: response.devices });
            this.setState({ loading: false });
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
                    handleSubmit,
                    values
                }) => {
                    const classes = this.useStyles();

                    useEffect(() => {
                        console.log(this.state.isAddMode, this.state.id);
                        if (!this.state.isAddMode && this.state.id !== 'new') {
                            apiService
                            .getById('route', this.state.id)
                            .then((response) => {
                                let item = [];
                                if(response.routes !== undefined && response.routes.length > 0) {
                                    item = response.routes[0];
                                }

                                setFieldValue('id', item.id);
                                setFieldValue('label', item.label);
                                setFieldValue('description', item.description);
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
                                        Route Information
                                    </h3>
                                    <span className='text-muted font-weight-bold font-size-sm mt-1'>
                                        Change general configurations about the route
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
                                        to='/routes/list'
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
                                            <label>Label</label>
                                            <Field
                                                as="input"
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                        {errors, touched},
                                                        'label'
                                                    )}`}
                                                name='name'
                                                placeholder='Set the route label'
                                                {...getFieldProps('label')}
                                            />
                                            <ErrorMessage name="label" component="div" className="invalid-feedback" />
                                        </div>


                                        <div className='col-xl-6 col-lg-6'>
                                            <label>Description</label>
                                            <Field
                                                as="textarea"
                                                rows='7'
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

export default injectIntl(RoutesFormComponent);