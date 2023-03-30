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
import { getInputClasses } from '../../utils/formik';
import toaster from '../../utils/toaster';
import '../../utils/yup-validations';
import { useSelector } from 'react-redux'

const useStyles = makeStyles((theme) => ({
    headerMarginTop: {
        marginTop: theme.spacing(5),
    },
}));

function DeviceFormComponent(props) {
    const intl = props.intl
    const deviceId = props.entity
    const isAddMode = !deviceId

    const { permissions } = useSelector(({ auth }) => ({ permissions: auth.permissions }))

    const [blocking, setBlocking] = useState(false)
    const [loading, setLoading] = useState(false)

    const [device, setDevice] = useState({})
    const [selectedBoardFamily, setSelectedBoardFamily] = useState([])
    const [boardFamilies, setBoardFamilies] = useState([])
    const [selectedParent, setSelectedParent] = useState([])
    const [selectedGroup, setSelectedGroup] = useState([])

    const forceBoardId = selectedBoardFamily.length !== 0 ? selectedBoardFamily[0].force_board_id : false
    const classes = useStyles();

    const initialValues = {
        id: device.id || '',
        label: device.label || '',
        //group stuff
        group: selectedGroup,
        group_options: [],
        //parent device stuff 
        parent_device: selectedParent,
        parent_options: [],
        // board family stuff
        board_family: selectedBoardFamily,
        board_families_options: boardFamilies,
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

        const promises = [
            apiService.get('board_families', 100, 0)
        ];

        Promise.all(promises).then(allResponses => {
            const respBoardFamilies = allResponses[0].board_families || [];
            setBoardFamilies(respBoardFamilies);
            if (!isAddMode && deviceId !== 'new') {
                apiService.getById('device', deviceId).then((response) => {
                    const respDevices = response.devices || []
                    if (respDevices.length > 0) {
                        const device = respDevices[0];
                        // initForm(device, {setFieldValue});
                        updateInitialValues(device, respBoardFamilies)
                        setDevice(device)
                        setBlocking(false)
                    }
                });
            } else {
                setBlocking(false)
            }
        });
    }, [])

    const updateInitialValues = (device, boardFamilies) => {
        if (device.board_family_id !== undefined && device.board_family_id !== '') {
            let selectedBoardFamily = getSelectedBoardFamily(device.board_family_id, boardFamilies);
            setSelectedBoardFamily(selectedBoardFamily)
        }

        if (device.parent_id !== undefined && device.parent_id !== '') {
            let selectedParent = [{ id: device.parent_id, label: device.parent_id }];
            setSelectedParent(selectedParent)
        }

        if (device.container !== undefined && device.container.id !== 0) {
            let selectedGroup = [{
                id: device.container.id,
                label: device.container.label,
                //displayLabel is an extra field that is used only for display purposes, it is needed for the displayed field value is kept the same 
                displayLabel: makeGroupLabel(device.container)
            }];
            setSelectedGroup(selectedGroup)
        }
    }

    const updateForceBoardId = (newBoardFamilyArr, setFieldValue) => {
        setFieldValue('force_board_id', false)
        if (newBoardFamilyArr.length > 0) {
            const boardFamily = newBoardFamilyArr[0]
            setFieldValue('force_board_id', boardFamily.force_board_id)
        }
    }

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
                return { ...group, displayLabel: makeGroupLabel(group) }
            });
        }
        return []
    };

    const makeGroupLabel = (group) => {
        console.log('making group label from')
            console.log(group)
        const parentParent = (group.parent_label !== undefined && group.parent_parent_id !== 0) ? "../" : "";
        const parent = (group.parent_label !== undefined && group.parent_label !== "" ) ? `${group.parent_label}/` : "";
        return `${parentParent}${parent}${group.label}`;
    }

    const saveDevice = (fields, setSubmitting, resetForm) => {
        setBlocking(true)
        let method = (isAddMode) ? 'save' : 'update';
        let msgSuccess = (isAddMode)
            ? intl.formatMessage({ id: 'DEVICE.CREATED' })
            : intl.formatMessage({ id: 'DEVICE.UPDATED' });

        let body = {}

        if (fields.parent_device.length > 0) {
            body.parent_id = fields.parent_device[0].id
        }
        const group_id = fields.group[0].id
        const board_family_id = fields.board_family[0].id

        body = {
            ...body,
            id: fields.id,
            label: fields.label,
            group_id,
            board_family_id,
            board: fields.board,
            imei: fields.imei,
            meta_data: fields.meta_data,
            comments: fields.comments
        }

        const newDevice = {
            ...body,
            container: fields.group[0]
        }

        deviceService[method](body)
            .then(() => {
                if (method == 'update') {
                    setDevice(newDevice)
                    updateInitialValues(newDevice, boardFamilies)
                }
                toaster.notify('success', msgSuccess);
                resetForm(initialValues)
            })
            .catch((err) => {
                toaster.notify('error', err.data.detail);
            })
            .finally(() => {
                setSubmitting(false)
                setBlocking(false)
            });
    };

    const getSelectedBoardFamily = (boardFamilyId, boardFamilies) => {
        return boardFamilies.filter(b => b.id === boardFamilyId);
    };

    const handleSearchGroup = (query, setFieldValue) => {
        setLoading(true)
        apiService.getByText('group', query, 100, 0).then((response) => {
            const respGroups = response.groups || []
            setFieldValue('group_options', getGroups(respGroups))
            setLoading(false)
        });
    };

    const handleSearchParent = (query, setFieldValue) => {
        setLoading(true)
        apiService.getByText('device', query, 100, 0).then((response) => {
            const respParents = response.devices || []
            setFieldValue('parent_options', getParents(respParents))
            setLoading(false)
        });
    };

    const filterBy = () => true;

    const validationSchema = Yup.object().shape({
        id: Yup.number('Device ID must be numeric').test('len', 'Device ID be less or equal 18 digits',
            val => val?.toString().length <= 18)
            .moreThan(0, 'Device ID must be a positive number.')
            .required('Device ID is required'),
        label: Yup.string()
            .required('Label is required'),
        group: Yup.array().of(Yup.object().shape({
            id: Yup.number().moreThan(0),
            label: Yup.string()
        })).min(1, 'Group is required').max(1, 'Group is required'),
        parent_device: Yup.array().of(Yup.object().shape({
            id: Yup.number().moreThan(0),
            label: Yup.string()
        })).max(1, 'Group is required'),
        board_family: Yup.array().of(Yup.object().shape({
            id: Yup.number().moreThan(0),
            label: Yup.string()
        })).min(1, 'Board Family is required').max(1, 'Board Family is required'),
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
            onSubmit={(values, { setSubmitting, resetForm }) => {
                saveDevice(values, setSubmitting, resetForm);
            }}
        >
            {({
                isValid,
                getFieldProps,
                setFieldTouched,
                errors,
                touched,
                isSubmitting,
                setFieldValue,
                handleSubmit,
                values
            }) => {
                console.log(values)
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
                            {permissions.canEditDevices && <button
                                    type='submit'
                                    className='btn btn-success mr-2'
                                    disabled={
                                        isSubmitting ||
                                        !isValid
                                    }>
                                    <DoneIcon />
                                    Save Changes
                                    {isSubmitting}
                                </button>}
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
                                                disabled={!isAddMode || !permissions.canEditDevices}
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
                                            disabled={!permissions.canEditDevices}
                                            placeholder='Set the Device Label'
                                            {...getFieldProps('label')}
                                        />
                                        <ErrorMessage name="label" component="div" className="invalid-feedback" />
                                    </div>
                                </div>

                                <div className='form-group row'>
                                    <div className='col-xl-6 col-lg-6'>
                                        <label className={`required`}>Groups</label>
                                        <Field name="group">
                                            {({ field }) => {
                                                return <AsyncTypeahead
                                                    id='async-typeahead-group'
                                                    labelKey='displayLabel'
                                                    name={field.name}
                                                    size="lg"
                                                    onChange={(value) => {
                                                        setFieldValue('group', value)
                                                    }}
                                                    onBlur={() => {
                                                        setFieldTouched('group')
                                                    }}
                                                    options={values.group_options}
                                                    clearButton={true}
                                                    placeholder=''
                                                    selected={field.value}
                                                    onSearch={(q) => handleSearchGroup(q, setFieldValue)}
                                                    isLoading={loading}
                                                    filterBy={filterBy}
                                                    className={getInputClasses({ errors, touched }, 'group')}
                                                />
                                            }}
                                        </Field>
                                        <ErrorMessage name="group" component="div" className="invalid-feedback" />
                                    </div>
                                    <div className='col-xl-6 col-lg-6'>
                                        <label>Device parent</label>
                                        <Field name='parent_device'>
                                            {({ field }) =>
                                                <AsyncTypeahead
                                                    id='typeahead-parent'
                                                    labelKey='label'
                                                    name={field.name}
                                                    size="lg"
                                                    onChange={value => {
                                                        setFieldValue('parent_device', value)
                                                    }}
                                                    options={values.parent_options}
                                                    clearButton={true}
                                                    placeholder=''
                                                    selected={field.value}
                                                    onSearch={q => handleSearchParent(q, setFieldValue)}
                                                    isLoading={loading}
                                                    filterBy={filterBy}
                                                    className={getInputClasses({ errors, touched }, 'parent_id')}
                                                />}
                                        </Field>
                                    </div>
                                </div>

                                <div className='form-group row'>
                                    <div className='col-lg-3 col-xl-3'>
                                        <label className={`required`}>Board Family</label>
                                        <Field name="board_family">
                                            {({ field }) =>
                                                <Typeahead
                                                    id='typeahead-board-family'
                                                    labelKey="name"
                                                    name={field.name}
                                                    size="lg"
                                                    onChange={(value) => {
                                                        updateForceBoardId(value, setFieldValue)
                                                        setFieldValue('board_family', value)
                                                    }}
                                                    onBlur={() => {
                                                        setFieldTouched(field.name)
                                                    }}
                                                    options={values.board_families_options}
                                                    placeholder=''
                                                    selected={field.value}
                                                    className={getInputClasses({ errors, touched }, 'board_family')}
                                                />
                                            }
                                        </Field>
                                        <ErrorMessage name="board_family" component="div" className="invalid-feedback" />
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
                                                disabled={!permissions.canEditDevices}
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
                                                disabled={!permissions.canEditDevices}
                                                {...getFieldProps('imei')}
                                            />
                                            <ErrorMessage name="imei" component="div" className="invalid-feedback" />
                                        </div>
                                    </div>
                                </div>

                                <div className='form-group row'>

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
                                                disabled={!permissions.canEditDevices}
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
                                                disabled={!permissions.canEditDevices}
                                                {...getFieldProps(
                                                    'meta_data'
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* end::Form */}
                    </form>
                )
            }}
        </Formik>
    </BlockUi >
}

export default injectIntl(DeviceFormComponent);