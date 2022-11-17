import DoneIcon from '@material-ui/icons/Done';
import { makeStyles } from '@material-ui/styles';
import { ErrorMessage, Field, Formik } from 'formik';
import React, { useEffect, useMemo, useState } from 'react';
import BlockUi from "react-block-ui";
import { AsyncTypeahead, Typeahead } from 'react-bootstrap-typeahead';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import apiService from '../../services/apiService';
import deviceService from '../../services/deviceService';
import tenantService from '../../services/tenantService';
import { getInputClasses } from '../../utils/formik';
import toaster from '../../utils/toaster';
import '../../utils/yup-validations';

const useStyles = makeStyles((theme) => ({
    headerMarginTop: {
        marginTop: theme.spacing(5),
    },
}));

function DeviceFormComponent(props) {
    const intl = props.intl
    const deviceId = props.entity
    const isAddMode = !deviceId

    const [blocking, setBlocking] = useState(false)
    const [loading, setLoading] = useState(false)

    const [device, setDevice] = useState({})
    const [selectedBoardFamily, setSelectedBoardFamily] = useState([])
    const [boardFamilies, setBoardFamilies] = useState([])

    const [selectedParent, setSelectedParent] = useState([])
    const [parents, setParents] = useState([])

    const [selectedGroup, setSelectedGroup] = useState([])
    const [groups, setGroups] = useState([])

    const forceBoardId = useMemo(() => {
        if (selectedBoardFamily.length !== 0) {
            return selectedBoardFamily[0].force_board_id || false
        }
        return false
    }, [selectedBoardFamily])

    const groupId = useMemo(() => {
        if (device.container !== undefined) {
            return device.container.id
        }
        return ''
    }, [device])

    const [tenant, setTenant] = useState({})
    const classes = useStyles();

    const initialValues = {
        id: device.id || '',
        label: device.label || '',
        group_id: groupId || '',
        board_family_id: device.board_family_id || '',
        parent_id: device.parent_id || '',
        board: device.board || '',
        imei: device.imei || '',
        meta_data: device.meta_data || '{}',
        comments: device.comments || '',
        force_board_id: forceBoardId || false,
        check_location_sublocation: device.check_location_sublocation || false,
        check_longstanding: device.check_longstanding || false
    };

    useEffect(() => {
        setBlocking(true)

        let promises = [
            apiService.get('board_families', 100, 0),
            tenantService.getInfo(),
        ];

        Promise.all(promises).then(allResponses => {
            const respBoardFamilies = allResponses[0].board_families || [];
            const respTenant = allResponses[1];

            setBoardFamilies(respBoardFamilies);
            setTenant(respTenant);
            if (!isAddMode && deviceId !== 'new') {
                apiService.getById('device', deviceId).then((response) => {
                    const respDevices = response.devices || []
                    if (respDevices.length > 0) {
                        const device = respDevices[0];
                        // initForm(device, {setFieldValue});
                        setDevice(device)
                        setBlocking(false)
                    }
                });
            } else {
                setBlocking(false)
            }
        });
    }, [])

    useEffect(() => {
        if (device.board_family_id !== undefined && device.board_family_id !== '') {
            let selectedBoardFamily = getSelectedBoardFamily(device.board_family_id);
            setSelectedBoardFamily(selectedBoardFamily);
        }
        if (device.parent_id !== undefined && device.parent_id !== '') {
            let selectedParent = [{ id: device.parent_id, label: device.parent_id }];
            setSelectedParent(selectedParent)
        }
        if (device.container !== undefined) {
            let selectedGroup = [{
                id: device.container.id,
                label: makeGroupLabel(device.container)
            }];
            setSelectedGroup(selectedGroup);
        }
    }, [device])

    const getParents = (records) => {
        if (Array.isArray(records)) {
            return records.map((device) => {
                return { id: device.id, label: device.id };
            });
        }
        return [];
    };

    const getGroups = (records) => {
        if (Array.isArray(records)) {
            return records.map((group) => {
                const label = makeGroupLabel(group);
                return { id: group.id, label: label }
            });
        }
        return []
    };

    const makeGroupLabel = (group) => {
        const parentParent = (group.parent_parent_id !== 0) ? "../" : "";
        const parent = (group.parent_label !== "") ? `${group.parent_label}/` : "";
        return `${parentParent}${parent}${group.label}`;
    }

    const saveDevice = (fields, { setSubmitting, resetForm }) => {
        setBlocking(true)
        let method = (isAddMode) ? 'save' : 'update';
        let msgSuccess = (isAddMode)
            ? intl.formatMessage({ id: 'DEVICE.CREATED' })
            : intl.formatMessage({ id: 'DEVICE.UPDATED' });
        deviceService[method](fields)
            .then((_response) => {
                toaster.notify('success', msgSuccess);

                if (isAddMode) {
                    resetForm(initialValues);
                    setSelectedGroup([])
                    setSelectedBoardFamily([])
                }
            })
            .catch((err) => {
                toaster.notify('error', err.data.detail);
            })
            .finally(() => {
                setBlocking(false)
                setSubmitting(false);
            });
    };

    const onChangeGroup = (opt, setFieldValue) => {
        setSelectedGroup(opt)
        setFieldValue('group_id', '');
        if (opt.length > 0) {
            setFieldValue('group_id', opt[0].id);
        }
    };

    const onChangeParent = (opt, setFieldValue) => {
        setSelectedParent(opt)
        setFieldValue('parent_id', '');

        if (opt.length > 0) {
            setFieldValue('parent_id', opt[0].id);
        }
    };

    const onChangeBoardFamily = (opt, setFieldValue) => {
        setFieldValue('board_family_id', '');
        setFieldValue('force_board_id', false);

        if (opt.length > 0) {
            setFieldValue('board_family_id', opt[0].id);
            setFieldValue('force_board_id', opt[0].force_board_id);
        }
        setSelectedBoardFamily(opt)
    };

    const getSelectedBoardFamily = (boardFamilyId) => {
        return boardFamilies.filter(b => b.id === boardFamilyId);
    };

    const handleSearchGroup = (query) => {
        setLoading(true)
        apiService.getByText('group', query, 100, 0).then((response) => {
            const respGroups = response.groups || []
            setGroups(getGroups(respGroups))
            setLoading(false)
        });
    };

    const handleSearchParent = (query) => {
        setLoading(true)
        apiService.getByText('device', query, 100, 0).then((response) => {
            const respParents = response.devices || []
            setParents(getParents(respParents))
            setLoading(false)
        });
    };

    const filterBy = () => true;

    const validationSchema = Yup.object().shape({
        id: Yup.number('Device ID must be numeric').moreThan(0, 'Device ID must be a positive number.')
            .test('len', 'Device ID be less or equal 18 digits',
                val => val.toString().length <= 18)
            .required('Device ID is required'),
        label: Yup.string()
            .required('Label is required'),
        group_id: Yup.string()
            .required('Group is required'),
        board_family_id: Yup.number()
            .required('Board family is required'),
        meta_data: Yup.string()
            .isJson("Metadata needs to be a valid JSON"),
        force_board_id: Yup.boolean(),
        board: Yup.string().when('force_board_id', {
            is: true,
            then: Yup.string()
                .required('Board is required')
        }),
        comments: Yup.string()
            .max(256, 'Comments must be at most 256 characters'),
    });

    return <BlockUi tag='div' blocking={blocking}>
        <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, { setFieldValue, setSubmitting, resetForm }) => {
                saveDevice(values, {
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
                return (
                    <form
                        className='card card-custom'
                        onSubmit={handleSubmit}>
                        {/* begin::Header */}
                        <div
                            className={`card-header py-3 ` + classes.headerMarginTop}>
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
                                        <label className={`required`}>Device ID</label>
                                        <div>
                                            <Field
                                                as="input"
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                    { errors, touched },
                                                    'id'
                                                )}`}
                                                name='id'
                                                placeholder='Set the Device ID'
                                                {...getFieldProps('id')}
                                                disabled={!isAddMode}
                                                maxLength={18}
                                            />
                                            <ErrorMessage name="id" component="div" className="invalid-feedback" />
                                        </div>
                                    </div>

                                    <div className='col-xl-6 col-lg-6'>
                                        <label className={`required`}>Label</label>
                                        <Field
                                            as="input"
                                            className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                { errors, touched },
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
                                            onChange={(data) => onChangeGroup(data, setFieldValue)}
                                            options={groups}
                                            clearButton={true}
                                            placeholder=''
                                            selected={selectedGroup}
                                            onSearch={handleSearchGroup}
                                            isLoading={loading}
                                            filterBy={filterBy}
                                            className={getInputClasses({ errors, touched }, 'group_id')}
                                        />
                                        <ErrorMessage name="group_id" component="div" className="invalid-feedback" />
                                    </div>
                                    <div className='col-xl-6 col-lg-6'>
                                        <label>Device parent</label>
                                        <AsyncTypeahead
                                            id='typeahead-parent'
                                            labelKey='label'
                                            size="lg"
                                            onChange={(data) => onChangeParent(data, setFieldValue)}
                                            options={parents}
                                            clearButton={true}
                                            placeholder=''
                                            selected={selectedParent}
                                            onSearch={handleSearchParent}
                                            isLoading={loading}
                                            filterBy={filterBy}
                                            className={getInputClasses({ errors, touched }, 'parent_id')}
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
                                            onChange={data => onChangeBoardFamily(data, setFieldValue)}
                                            options={boardFamilies}
                                            placeholder=''
                                            selected={selectedBoardFamily}
                                            className={getInputClasses({ errors, touched }, 'board_family_id')}
                                        />
                                        <ErrorMessage name="board_family_id" component="div" className="invalid-feedback" />
                                    </div>
                                    <div className='col-lg-3 col-xl-3'>
                                        <label className={`${values.force_board_id ? 'required' : ''}`}>Board ID</label>
                                        <div>
                                            <Field
                                                as="input"
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                    { errors, touched },
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
                                                    { errors, touched },
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
                                    {tenant.type === 'master' &&
                                        <div className='col-xl-6 col-lg-6'>
                                            <label className={`required`}>Metadata</label>
                                            <div>
                                                <Field
                                                    as="textarea"
                                                    rows='7'
                                                    className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                        { errors, touched },
                                                        'meta_data'
                                                    )}`}
                                                    name='meta_data'
                                                    placeholder='Set the meta_data'
                                                    {...getFieldProps(
                                                        'meta_data'
                                                    )}
                                                />
                                                <ErrorMessage name="meta_data" component="div"
                                                    className="invalid-feedback" />
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
                                                    { errors, touched },
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


                                    <div className='col-xl-6 col-lg-6'>
                                        <label>Metadata</label>
                                        <div>
                                            <Field
                                                as="textarea"
                                                rows='7'
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                    { errors, touched },
                                                    'meta_data'
                                                )}`}
                                                name='meta_data'
                                                placeholder='Device metadata'
                                                {...getFieldProps(
                                                    'meta_data'
                                                )}
                                            />
                                            <ErrorMessage name="metadata" component="div" className="invalid-feedback" />
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
}

export default injectIntl(DeviceFormComponent);