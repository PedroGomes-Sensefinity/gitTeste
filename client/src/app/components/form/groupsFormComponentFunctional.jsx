import DoneIcon from '@material-ui/icons/Done';
import { makeStyles } from '@material-ui/styles';
import { ErrorMessage, Field, Formik } from 'formik';
import React, { useEffect, useMemo, useState } from 'react';
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

// still unused
function GroupsFormComponentFunctional(props) {
    const intl = props.intl
    const id = props.id
    const isAddMode = props.id === undefined

    const [selectedThresholds, setSelectedThresholds] = useState([])
    const [selectedGroups, setSelectedGroup] = useState([])

    const [optionGroups, setOptionGroups] = useState([])
    const [optionThresholds, setOptionThresholds] = useState([])

    const [blocking, setBlocking] = useState(true)
    const [loading, setLoading] = useState(false)

    const classes = useStyles();

    useEffect(() => {
        if (!isAddMode && id !== null) {
            apiService
                .getById('group', id)
                .then((response) => {
                    let group = {}
                    if (response.groups !== undefined && response.groups.length > 0) {
                        group = response.groups[0];
                    }

                    let selectedGroup = {
                        id: group.id,
                        label: makeGroupLabel(group),
                        parentLabel: group.parent_label
                    }

                    let thresholds = []
                    if (group.thresholds !== undefined) {
                        thresholds = group.thresholds[0];
                    }

                    var selectedThreshold = []
                    if (Array.isArray(thresholds) && thresholds.length > 0) {
                        selectedThreshold.push({ id: thresholds[0].id, name: thresholds[0].label })
                    }

                    setSelectedThresholds(selectedThreshold);
                    setSelectedGroup([selectedGroup])
                    setBlocking(false)
                });
        }
    }, []);

    const validationSchema = Yup.object().shape({
        label: Yup.string().required('Label is required'),
    });

    const initialValues = useMemo(() => {
        if (selectedGroups.length != 0) {
            const group = selectedGroups[0]
            return {
                id: group.id,
                parent_id: group.parent_id,
                parentLabel: group.parent_label || '',
                thresholds: group.thresholds,
                label: group.label,
            };

        }
    }, [selectedGroups]);

    const getGroups = (records) => {
        let groups = [];
        if (Array.isArray(records)) {
            groups = records.map((group) => {
                // If is edit mode, remove actual group to avoid circular reference
                const label = makeGroupLabel(group)
                return { id: group.id, parentLabel: label }
            })
        }
        return groups;
    }

    const makeGroupLabel = (group) => {
        const parentParent = (group.parent_parent_id !== 0) ? "../" : "";
        const parent = (group.parent_label !== "") ? `${group.parent_label}/` : "";
        const toReturn = `${parentParent}${parent}${group.label}` 
        console.log(toReturn)
        return toReturn;
    }

    const save = (fields, { setSubmitting, resetForm }) => {
        setBlocking(true);
        let method = (isAddMode) ? 'save' : 'update';
        let msgSuccess = (isAddMode)
            ? intl.formatMessage({ id: 'GROUP.CREATED' })
            : intl.formatMessage({ id: 'GROUP.UPDATED' });

        fields.thresholds = selectedThresholds

        groupsService[method](fields)
            .then((response) => {
                toaster.notify('success', msgSuccess);
                setBlocking(false);
                setSubmitting(false);

                if (isAddMode) {
                    resetForm(initialValues);
                    setSelectedGroup([])
                    setSelectedThresholds([])
                }
            });
    };

    const onChangeParentGroup = (opt) => {
        setSelectedGroup(opt)
    };


    const handleSearchGroup = (query) => {
        setLoading(true)

        apiService.getByText('group', query, 100, 0).then((response) => {
            setOptionGroups(getGroups(response.groups));
            setLoading(false)
        });
    };

    const onChangeThreshold = (opt) => {
        setSelectedThresholds(opt);
    };

    const handleSearchThreshold = (query) => {
        setLoading(true)

        apiService.getByText('threshold', query, 100, 0).then((response) => {
            const thresholds = (typeof response.thresholds !== undefined && Array.isArray(response.thresholds))
                ? filterThresholdSelected(response.thresholds)
                : [];
            setOptionThresholds(thresholds)
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
                                                onChange={onChangeParentGroup}
                                                selected={selectedGroups}
                                                onSearch={handleSearchGroup}
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

export default injectIntl(GroupsFormComponentFunctional);