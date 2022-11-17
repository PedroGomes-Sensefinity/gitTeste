import DoneIcon from '@material-ui/icons/Done';
import { makeStyles } from '@material-ui/styles';
import { ErrorMessage, Field, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import BlockUi from "react-block-ui";
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import apiService from '../../services/apiService';
import groupsService from "../../services/groupsService";
import { getInputClasses } from '../../utils/formik';
import toaster from '../../utils/toaster';
import '../../utils/yup-validations';

const useStyles = makeStyles((theme) => ({
    headerMarginTop: {
        marginTop: theme.spacing(5),
    },
}));


function GroupsFormComponent(props) {
    const intl = props.intl
    const groupId = props.id
    const isAddMode = props.id === undefined || props.id === 'new'

    const [selectedThresholds, setSelectedThresholds] = useState([])
    const [groupInfo, setGroup] = useState({})

    const [parentGroup, setParentGroup] = useState([])

    const [optionGroups, setOptionGroups] = useState([])
    const [optionThresholds, setOptionThresholds] = useState([])

    const [blocking, setBlocking] = useState(false)
    const [loading, setLoading] = useState(false)
    const classes = useStyles();

    useEffect(() => {
        if (!isAddMode && groupId !== null) {
            apiService
                .getById('group', groupId)
                .then((response) => {
                    const repsGroups = response.groups || []
                    let group = {}
                    if (repsGroups.length > 0) {
                        group = repsGroups[0];
                    }

                    let groupInfo = {
                        id: group.id,
                        label: group.label,
                    }

                    const parent = {
                        id: group.parent_id,
                        parentLabel: group.parent_label
                    }

                    let thresholds = group.thresholds || []
                    if (thresholds.length > 0) {
                        thresholds = group.thresholds[0];
                    }

                    var selectedThreshold = []
                    if (thresholds.length > 0) {
                        selectedThreshold.push({ id: thresholds[0].id, name: thresholds[0].label })
                    }

                    setGroup(groupInfo)
                    setParentGroup([parent])
                    setSelectedThresholds(selectedThreshold);
                    setBlocking(false)
                });
        }
    }, []);

    const validationSchema = Yup.object().shape({
        label: Yup.string().required('Label is required'),
    });

    const initialValues = {
        id: groupId,
        label: groupInfo.label || '',
    };



    const getGroups = (records) => records
        .filter((group) => group.id != groupId)
        .map((group) => {
            // If is edit mode, remove actual group to avoid circular reference
            const label = makeGroupLabel(group)
            return { id: group.id, parentLabel: label }
        })



    const makeGroupLabel = (group) => {
        const parentParent = (group.parent_parent_id !== 0) ? "../" : "";
        const parent = (group.parent_label !== "") ? `${group.parent_label}/` : "";
        const toReturn = `${parentParent}${parent}${group.label}`
        return toReturn;
    }

    const save = (fields, { setSubmitting, resetForm }) => {
        setBlocking(true);
        let method = (isAddMode) ? 'save' : 'update';
        let msgSuccess = (isAddMode)
            ? intl.formatMessage({ id: 'GROUP.CREATED' })
            : intl.formatMessage({ id: 'GROUP.UPDATED' });

        fields.thresholds = selectedThresholds
        if (parentGroup.length > 0) {
            fields.parent_id = parentGroup[0].id
        }

        groupsService[method](fields)
            .then((_response) => {
                toaster.notify('success', msgSuccess);
                setBlocking(false);
                setSubmitting(false);

                if (isAddMode) {
                    resetForm(initialValues);
                    setGroup({})
                    setParentGroup({})
                    setSelectedThresholds([])
                }
            });
    };

    const onChangeParentGroup = (opt) => {
        setParentGroup(opt)
    };


    const handleSearchGroup = (query) => {
        setLoading(true)
        console.log(query)
        apiService.getByText('group', query, 100, 0).then((response) => {
            const respGroups = response.groups || []
            setOptionGroups(getGroups(respGroups));
            setLoading(false)
        });
    };

    const onChangeThreshold = (opt) => {
        setSelectedThresholds(opt);
    };

    const handleSearchThreshold = (query) => {
        setLoading(true)
        apiService.getByText('threshold', query, 100, 0).then((response) => {
            const respThresholds = response.thresholds || []
            setOptionThresholds(filterThresholdSelected(respThresholds))
            setLoading(false)
        });
    };

    const filterThresholdSelected = (options) => {
        return options.filter((t) => {
            return !selectedThresholds.find(st => t.id === st.id) !== undefined
        });
    }

    const filterBy = () => true;


    return (
        <BlockUi tag='div' blocking={blocking}>
            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, { setStatus, setSubmitting, resetForm }) => {
                    save(values, {
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
                    handleSubmit
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
                                        Group Information
                                    </h3>
                                    <span className='text-muted font-weight-bold font-size-sm mt-1'>
                                        Change general configurations about a group
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
                                        to='/groups/list'
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
                                            <label className={`required`}>Group Label</label>
                                            <Field
                                                as="input"
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                    { errors, touched },
                                                    'label'
                                                )}`}
                                                name='label'
                                                placeholder='Set the Group Label'
                                                {...getFieldProps('label')}
                                            />
                                            <ErrorMessage name="label" component="div" className="invalid-feedback" />
                                        </div>


                                        <div className='col-xl-6 col-lg-6'>
                                            <label className={``}>Parent Group</label>
                                            <AsyncTypeahead
                                                id='typeahead-groups'
                                                labelKey='parentLabel'
                                                size="lg"
                                                options={optionGroups}
                                                placeholder=''
                                                onSearch={handleSearchGroup}
                                                onChange={onChangeParentGroup}
                                                selected={parentGroup}
                                                isLoading={loading}
                                                filterBy={filterBy}
                                                className={getInputClasses({ errors, touched }, 'parent_id')}
                                            />
                                            <ErrorMessage name="parent_id" component="div" className="invalid-feedback" />
                                        </div>
                                    </div>

                                    <div className='form-group row'>
                                        <div className='col-xl-12 col-lg-12'>
                                            <label>Group Thresholds</label>
                                            <div>
                                                <AsyncTypeahead
                                                    id='typeahead-threshold'
                                                    labelKey='name'
                                                    size="lg"
                                                    multiple
                                                    onChange={onChangeThreshold}
                                                    options={optionThresholds}
                                                    clearButton={true}
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
                        </form>)
                }}
            </Formik>
        </BlockUi>
    );
}

export default injectIntl(GroupsFormComponent);