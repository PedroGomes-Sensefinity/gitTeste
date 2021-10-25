import React, {useEffect} from 'react';
import {ErrorMessage, Field, Formik} from 'formik';
import * as Yup from 'yup';
import {Link} from 'react-router-dom';
import {makeStyles} from '@material-ui/styles';
import deviceService from '../../services/deviceService';
import tenantService from '../../services/tenantService';
import apiService from '../../services/apiService';
import {AsyncTypeahead, Typeahead} from 'react-bootstrap-typeahead';
import DoneIcon from '@material-ui/icons/Done';
import {getInputClasses} from '../../utils/formik';
import '../../utils/yup-validations';
import BlockUi from "react-block-ui";
import toaster from '../../utils/toaster';
import {injectIntl} from 'react-intl';

class DeviceFormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            intl: props.intl,
            id: props.entity,
            data: props.data,
            isAddMode: !props.entity,
            groups: [],
            selectedGroup: [],
            parents: [],
            selectedParent: [],
            boardFamilies: [],
            selectedBoardFamily: [],
            tenant: {},
            loading: false,
            blocking: false,
        };
    }

    componentDidMount() {
        apiService.get('board_families', 100, 0).then((response) => {
            this.setState({boardFamilies: response.board_families});
        });
        tenantService.getInfo().then((response) => {
            this.setState({tenant: response});
        });
    }

    initialValues = {
        id: '',
        group_id: '',
        parent_id: '',
        board_family_id: '',
        board: '',
        imei: '',
        label: '',
        meta_data: '{}',
        comments: '',
        force_board_id: false
    };

    validationSchema = Yup.object().shape({
        id: Yup.string().required('Device ID is required'),
        label: Yup.string().required('Label is required'),
        group_id: Yup.string().required('Group is required'),
        board_family_id: Yup.number().required('Board family is required'),
        meta_data: Yup.string()
                    .required('Metadata is required')
                    .isJson("Metadata needs to be a valid JSON"),
        force_board_id: Yup.boolean(),
        board: Yup.string().when('force_board_id', {
            is: true,
            then: Yup.string().required('Board is required')
        }),
        comments: Yup.string().max(256, 'Comments must be at most 256 characters'),
    });

    useStyles = makeStyles((theme) => ({
        headerMarginTop: {
            marginTop: theme.spacing(5),
        },
    }));

    getParents = (records) => {
        let devices = [];
        records.map((device) => {
            devices.push({ id: device.id, label: device.id });
            return null;
        });
        return devices;
    };

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

    saveDevice = (fields, { setFieldValue, setSubmitting, resetForm }) => {
        this.setState({blocking: true});
        let method = (this.state.isAddMode) ? 'save' : 'update';
        let msgSuccess = (this.state.isAddMode)
            ? this.state.intl.formatMessage({id: 'DEVICE.CREATED'})
            : this.state.intl.formatMessage({id: 'DEVICE.UPDATED'});

        deviceService[method](fields)
            .then((response) => {
                toaster.notify('success', msgSuccess);

                if (this.state.isAddMode) {
                    resetForm(this.initialValues);
                    this.setState({selectedGroup: []});
                    this.setState({selectedBoardFamily: []});
                }
            })
            .catch((err) => {
                toaster.notify('error', err.data.detail);
            })
            .finally(() => {
                this.setState({blocking: false});
                setSubmitting(false);
            });
    };

    onChangeGroup = (opt, setFieldValue) => {
        this.setState({ selectedGroup: opt});
        setFieldValue('group_id', '');

        if (opt.length > 0) {
            setFieldValue('group_id', opt[0].id);
        }
    };

    onChangeParent = (opt, setFieldValue) => {
        this.setState({ selectedParent: opt});
        setFieldValue('parent_id', '');

        if (opt.length > 0) {
            setFieldValue('parent_id', opt[0].id);
        }
    };

    onChangeBoardFamily = (opt, setFieldValue) => {
        setFieldValue('board_family_id', '');
        setFieldValue('force_board_id', false);

        if (opt.length > 0) {
            setFieldValue('board_family_id', opt[0].id);
            setFieldValue('force_board_id', opt[0].force_board_id);
        }
        this.setState({ selectedBoardFamily: opt});
    };

    getSelectedBoardFamily = (boardFamilyId) => {
        return this.state.boardFamilies.filter(b => b.id == boardFamilyId);
    };

    handleSearchGroup = (query) => {
        this.setState({loading: true});

        apiService.getByText('group', query, 100, 0).then((response) => {
            this.setState({ groups: this.getGroups(response.groups) });
            this.setState({loading: false});
        });
    };
    handleSearchParent = (query) => {
        this.setState({loading: true});

        apiService.getByText('device', query, 100, 0).then((response) => {
            this.setState({ parents: this.getParents(response.devices) });
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
                onSubmit={(values, { setFieldValue, setSubmitting, resetForm }) => {
                    this.saveDevice(values, {
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
                        if (!this.state.isAddMode && this.state.id !== 'new') {
                            apiService
                            .getById('device', this.state.id)
                            .then((response) => {
                                const device = response.devices[0];

                                setFieldValue('id', device.id, false);
                                setFieldValue('label', device.label, false);
                                setFieldValue('board_family_id', device.board_family_id, false);
                                setFieldValue('board', device.board, false);
                                setFieldValue('parent_id', device.parent_id, false);
                                setFieldValue('imei', device.imei, false);
                                setFieldValue('meta_data', device.meta_data, false);
                                setFieldValue('comments', device.comments, false);

                                if (device.board_family_id !== '') {
                                    let selectedBoardFamily = this.getSelectedBoardFamily(device.board_family_id);
                                    let forceBoardId = false;
                                    this.setState({ selectedBoardFamily: selectedBoardFamily});

                                    if(selectedBoardFamily[0]) {
                                        forceBoardId = (typeof selectedBoardFamily[0].force_board_id !== 'undefined')
                                        ? selectedBoardFamily[0].force_board_id
                                        : false;
                                    }

                                    setFieldValue('force_board_id', forceBoardId, false);
                                }

                                if (device.parent_id !== '') {
                                    let selectedParent = [{id: device.parent_id, label: device.parent_id}];
                                    this.setState({ selectedParent: selectedParent});
                                }

                                if (device.containers !== undefined && Array.isArray(device.containers) && device.containers.length > 0) {
                                    let selectedGroup = [{id: device.containers[0].id, label: this.makeGroupLabel(device.containers[0])}];
                                    this.setState({ selectedGroup: selectedGroup});
                                    setFieldValue('group_id', device.containers[0].id, false);
                                }

                                if (device.meta_data === '') {
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
                                        Device Information
                                    </h3>
                                    <span className='text-muted font-weight-bold font-size-sm mt-1'>
                                        Change general settings of your device
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
                                            <label className={`required`}>Device ID</label>
                                            <div>
                                                <Field
                                                    as="input"
                                                    className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                        {errors, touched},
                                                        'id'
                                                    )}`}
                                                    name='id'
                                                    placeholder='Set the Device ID'
                                                    {...getFieldProps('id')}
                                                    disabled={!this.state.isAddMode}
                                                />
                                                <ErrorMessage name="id" component="div" className="invalid-feedback" />
                                            </div>
                                        </div>

                                        <div className='col-xl-6 col-lg-6'>
                                            <label className={`required`}>Label</label>
                                            <Field
                                                as="input"
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                        {errors, touched},
                                                        'label'
                                                    )}`}
                                                name='label'
                                                placeholder='Set the Device Label'
                                                {...getFieldProps('label')}
                                            />
                                            <ErrorMessage name="label" component="div" className="invalid-feedback" />
                                        </div>
                                    </div>

                                    <div className='form-group row'>
                                        <div className='col-xl-6 col-lg-6'>
                                            <label className={`required`}>Groups</label>
                                            <AsyncTypeahead
                                                id='typeahead-groups'
                                                labelKey='label'
                                                size="lg"
                                                onChange={(data) => this.onChangeGroup(data, setFieldValue)}
                                                options={this.state.groups}
                                                clearButton={true}
                                                placeholder=''
                                                selected={this.state.selectedGroup}
                                                onSearch={this.handleSearchGroup}
                                                isLoading={this.state.loading}
                                                filterBy={this.filterBy}
                                                className={getInputClasses({errors, touched}, 'group_id')}
                                            />
                                            <ErrorMessage name="group_id" component="div" className="invalid-feedback" />
                                        </div>
                                        <div className='col-xl-6 col-lg-6'>
                                        <label>Device parent</label>
                                            <AsyncTypeahead
                                                id='typeahead-parent'
                                                labelKey='label'
                                                size="lg"
                                                onChange={(data) => this.onChangeParent(data, setFieldValue)}
                                                options={this.state.parents}
                                                clearButton={true}
                                                placeholder=''
                                                selected={this.state.selectedParent}
                                                onSearch={this.handleSearchParent}
                                                isLoading={this.state.loading}
                                                filterBy={this.filterBy}
                                                className={getInputClasses({errors, touched},'parent_id')}
                                            />
                                            <ErrorMessage name="parentId" component="div" className="invalid-feedback" />
                                        </div>
                                    </div>

                                    <div className='form-group row'>
                                        <div className='col-lg-3 col-xl-3'>
                                            <label className={`required`}>Board Family</label>
                                            <Typeahead
                                                id='typeahead-board-family'
                                                labelKey="name"
                                                size="lg"
                                                onChange={data => this.onChangeBoardFamily(data, setFieldValue)}
                                                options={this.state.boardFamilies}
                                                placeholder=''
                                                selected={this.state.selectedBoardFamily}
                                                className={getInputClasses({errors, touched},'board_family_id')}
                                            />
                                            <ErrorMessage name="board_family_id" component="div" className="invalid-feedback" />
                                        </div>
                                        <div className='col-lg-3 col-xl-3'>
                                            <label className={`${values.force_board_id ? 'required' : ''}`}>Board ID</label>
                                            <div>
                                                <Field
                                                    as="input"
                                                    className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                        {errors, touched},
                                                        'board'
                                                    )}`}
                                                    name='board'
                                                    placeholder='Set the Board ID'
                                                    {...getFieldProps('board')}
                                                />
                                                <ErrorMessage name="board" component="div" className="invalid-feedback" />
                                            </div>
                                        </div>
                                        <div className='col-xl-6 col-lg-6'>
                                            <label>IMEI</label>
                                            <div>
                                                <Field
                                                    as="input"
                                                    className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                        {errors, touched},
                                                        'imei'
                                                    )}`}
                                                    name='imei'
                                                    placeholder='Set the Device IMEI'
                                                    {...getFieldProps('imei')}
                                                />
                                                <ErrorMessage name="imei" component="div" className="invalid-feedback" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className='form-group row'>
                                        {this.state.tenant.type === 'master' &&
                                        <div className='col-xl-6 col-lg-6'>
                                            <label className={`required`}>Metadata</label>
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
                                        }

                                        <div className='col-xl-6 col-lg-6'>
                                            <label>Comments</label>
                                            <div>
                                                <Field
                                                    as="textarea"
                                                    rows='7'
                                                    className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                        {errors, touched},
                                                        'comments'
                                                    )}`}
                                                    name='comments'
                                                    placeholder='Comments and Observations'
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

export default injectIntl(DeviceFormComponent);