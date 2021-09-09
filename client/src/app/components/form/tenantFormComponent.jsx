import React, {useEffect} from 'react';
import {ErrorMessage, Field, Formik} from 'formik';
import * as Yup from 'yup';
import {Link} from 'react-router-dom';
import {makeStyles} from '@material-ui/styles';
import tenantService from '../../services/tenantService';
import apiService from '../../services/apiService';
import {AsyncTypeahead} from 'react-bootstrap-typeahead';
import DoneIcon from '@material-ui/icons/Done';
import {getInputClasses} from '../../utils/formik';
import '../../utils/yup-validations';
import BlockUi from "react-block-ui";
import toaster from '../../utils/toaster';
import { injectIntl } from 'react-intl';

class TenantFormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            intl: props.intl,
            id: props.id,
            isAddMode: !props.id,
            groups: [],
            selectedGroup: [],
            username: "",
            password: "",
            meta_data: "",
            loading: false,
            blocking: false,
        };
    }

    componentDidMount() {

    }

    initialValues = {
        id: this.props.id,
        name: '',
        username: '',
        password: '',
        containers: {id: 0},
        meta_data: '{}',
    };

    validationSchema = Yup.object().shape({
        name: Yup.string().required('Device ID is required'),
        username: Yup.string().required('Label is required'),
        password: Yup.string().required('Group is required')
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

    getGroups = (records) => {
        let groups = [];
        records.map((group) => {
            const label = this.makeGroupLabel(group);
            groups.push({ id: group.id, label: label });
            return null;
        });
        return groups;
    };

    makeGroupLabel = (group) => {
        const parentParent = (group.parent_parent_id !== 0) ? "../" : "";
        const parent = (group.parent_label !== "") ? `${group.parent_label}/` : "";
        const label = `${parentParent}${parent}${group.label}`;

        return label;
    }

    saveTenant = (fields, { setStatus, setSubmitting, resetForm }) => {
        fields.containers = [{ id : fields.group_id }]
        console.log(fields)
        this.setState({blocking: true});
        let method = (this.state.isAddMode) ? 'save' : 'update';
        let msgSuccess = (this.state.isAddMode)
            ? this.state.intl.formatMessage({id: 'DEVICE.CREATED'})
            : this.state.intl.formatMessage({id: 'DEVICE.UPDATED'});

        tenantService[method](fields)
            .then((response) => {
                toaster.notify('success', msgSuccess);
                this.setState({blocking: false});
            });
    };

    onChangeGroup = (opt, setFieldValue) => {
        this.setState({ selectedGroup: opt});
        setFieldValue('group_id', '');

        if (opt.length > 0) {
            setFieldValue('group_id', opt[0].id);
        }
    };

    handleSearchGroup = (query) => {
        this.setState({loading: true});
        apiService.getByText('group', query, 100, 0).then((response) => {
            console.log(response)
            this.setState({ groups: this.getGroups(response.groups) });
            this.setState({loading: false});
        });
    };

    filterBy = () => true;

    render() {
        return (
            <BlockUi tag='div' blocking={this.state.blocking}>
            <Formik
                enableReinitialize
                initialValues={this.initialValues}
                validationSchema={this.validationSchema}
                onSubmit={(values, { setStatus, setSubmitting, resetForm }) => {
                    this.saveTenant(values, {
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
                            .getById('tenant', this.state.id)
                            .then((response) => {
                                const res = response.tenants[0];
                                setFieldValue('name', res.name, false);
                                setFieldValue('username', res.username, false);

                                if (res.containers !== undefined && Array.isArray(res.containers) && res.containers.length > 0) {
                                    let selectedGroup = [{id: res.containers[0].id, label: this.makeGroupLabel(res.containers[0])}];
                                    this.setState({ selectedGroup: selectedGroup});
                                    setFieldValue('group_id', res.containers[0].id, false);
                                }

                                setFieldValue('meta_data', res.meta_data, false);
                                if (res.meta_data === '') {
                                    setFieldValue('meta_data', '{}', false);
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
                                        Tenant Information
                                    </h3>
                                    <span className='text-muted font-weight-bold font-size-sm mt-1'>
                                        Change information about the tenants
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
                                            <label>Tenant Name</label>
                                            <div>
                                                <Field
                                                    as="input"
                                                    className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                        {errors, touched},
                                                        'name'
                                                    )}`}
                                                    name='name'
                                                    placeholder='Set the Tenant name'
                                                    {...getFieldProps('name')}
                                                />
                                                <ErrorMessage name="name" component="div" className="invalid-feedback" />
                                            </div>
                                        </div>

                                        <div className='col-xl-6 col-lg-6'>
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
                                    </div>

                                    <div className='form-group row'>
                                        <div className='col-xl-6 col-lg-6'>
                                            <label>
                                                Groups
                                            </label>
                                            <AsyncTypeahead
                                                id='typeahead-groups'
                                                labelKey='label'
                                                size="lg"
                                                onChange={(data) => this.onChangeGroup(data, setFieldValue)}
                                                options={this.state.groups}
                                                clearButton={true}
                                                placeholder='Start typing see the groups'
                                                selected={this.state.selectedGroup}
                                                onSearch={this.handleSearchGroup}
                                                isLoading={this.state.loading}
                                                filterBy={this.filterBy}
                                                className={getInputClasses({errors, touched}, 'group_id')}
                                            />
                                            <ErrorMessage name="group_id" component="div" className="invalid-feedback" />
                                        </div>

                                        <div className='col-xl-6 col-lg-6'>
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
                                            <ErrorMessage name="password" component="div" className="invalid-feedback" />
                                        </div>
                                    </div>

                                    <div className='form-group row'>
                                        <div className='col-xl-12 col-lg-12'>
                                            <label>Metadata</label>
                                            <div>
                                                <Field
                                                    as="textarea"
                                                    rows='7'
                                                    className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                        {errors, touched},
                                                        'meta_data'
                                                    )}`}
                                                    name='meta_data'
                                                    placeholder='Set the meta_data'
                                                    {...getFieldProps(
                                                        'meta_data'
                                                    )}
                                                />
                                                <ErrorMessage name="meta_data" component="div"
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

export default injectIntl(TenantFormComponent);