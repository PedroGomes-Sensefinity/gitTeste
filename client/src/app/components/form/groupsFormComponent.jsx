import React, {useEffect} from 'react';
import {ErrorMessage, Field, Formik} from 'formik';
import * as Yup from 'yup';
import {Link} from 'react-router-dom';
import {makeStyles} from '@material-ui/styles';
import apiService from '../../services/apiService';
import {AsyncTypeahead} from 'react-bootstrap-typeahead';
import DoneIcon from '@material-ui/icons/Done';
import {getInputClasses} from '../../utils/formik';
import '../../utils/yup-validations';
import BlockUi from "react-block-ui";
import toaster from '../../utils/toaster';
import {injectIntl} from 'react-intl';
import thresholdService from "../../services/thresholdService";
import groupsService from "../../services/groupsService";

class GroupsFormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            intl: props.intl,
            id: props.id,
            label: '',
            parent_id: 0,
            isAddMode: !props.id,
            groups: [],
            selectedGroup: [],
            thresholds: [],
            selectedThresholdsId: [],
            selectedThresholds: [],
            loading: false,
            blocking: false,
        };
    }

    componentDidMount() {
        this.setState({blocking: true});

        thresholdService.getBySpec('bygroup', this.state.id).then((r) => {
            if(typeof r.thresholds !== "undefined") {
                const selectedIds = r.thresholds.map((t) => t.id);
                this.setState({thresholds: r.thresholds});
                this.setState({selectedThresholds: r.thresholds});
                this.setState({selectedThresholdsId: selectedIds});
            }

            this.setState({blocking: false});
        });
    }

    initialValues = {
        id: '',
        parent_id: '',
        thresholds: [],
        label: '',
    };

    validationSchema = Yup.object().shape({
        label: Yup.string().required('Label is required'),
    });

    useStyles = makeStyles((theme) => ({
        headerMarginTop: {
            marginTop: theme.spacing(5),
        },
    }));

    setThresholds = (records) => {
        let thresholds = [];
        records.map((threshold) => {
            thresholds.push({ id: threshold.id, label: threshold.label });
            return null;
        });
        return thresholds;
    };

    getGroups = (records) => {
        let groups = [];
        if (Array.isArray(records)) {
            records.map((group) => {
                const label = this.makeGroupLabel(group);
                groups.push({id: group.id, label: label});
                return null;
            });
        }
        return groups;
    };

    makeGroupLabel = (group) => {
        const parentParent = (group.parent_parent_id !== 0) ? "../" : "";
        const parent = (group.parent_label !== "") ? `${group.parent_label}/` : "";
        return `${parentParent}${parent}${group.label}`;
    }

    save = (fields, { setStatus, setSubmitting, resetForm }) => {
        this.setState({blocking: true});
        let method = (this.state.isAddMode) ? 'save' : 'update';
        let msgSuccess = (this.state.isAddMode)
            ? this.state.intl.formatMessage({id: 'GROUP.CREATED'})
            : this.state.intl.formatMessage({id: 'GROUP.UPDATED'});

        fields.thresholds = this.state.selectedThresholds

        groupsService[method](fields)
            .then((response) => {
                toaster.notify('success', msgSuccess);
                this.setState({blocking: false});
                setSubmitting(false);

                if (this.state.isAddMode) {
                    resetForm(this.initialValues);
                    this.setState({selectedGroup: []});
                    this.setState({selectedThresholds: []});
                }
            });
    };

    onChangeGroup = (opt, setFieldValue) => {
        this.setState({ selectedGroup: opt});
        setFieldValue('parent_id', '');

        if (opt.length > 0) {
            setFieldValue('parent_id', opt[0].id);
        }
    };


    handleSearchGroup = (query) => {
        this.setState({loading: true});

        apiService.getByText('group', query, 100, 0).then((response) => {
            this.setState({ groups: this.getGroups(response.groups) });
            this.setState({loading: false});
        });
    };

    onChangeThreshold = (opt) => {
        const selectedIds = opt.map((t) => t.id);
        this.setState({ selectedThresholdsId: selectedIds});
        this.setState({ selectedThresholds: opt});
    };

    handleSearchThreshold = (query) => {
        this.setState({loading: true});

        apiService.getByText('threshold', query, 100, 0).then((response) => {
            const thresholds = (typeof response.thresholds !== undefined && Array.isArray(response.thresholds))
                ? this.filterThresholdSelected(response.thresholds)
                : [];

            this.setState({ thresholds: thresholds });
            this.setState({ loading: false });
        });
    };

    filterThresholdSelected = (options) => {
        return options.filter((t) => {
            return !this.state.selectedThresholdsId.includes(t.id)
        });
    }

    filterBy = () => true;

    render() {
        return (
            <BlockUi tag='div' blocking={this.state.blocking}>
            <Formik
                enableReinitialize
                initialValues={this.initialValues}
                validationSchema={this.validationSchema}
                onSubmit={(values, { setStatus, setSubmitting, resetForm }) => {
                    this.save(values, {
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
                            .getById('group', this.state.id)
                            .then((response) => {
                                let groups = [];
                                if(response.groups !== undefined && response.groups.length > 0) {
                                    groups = response.groups[0];
                                }

                                if (groups.label !== undefined) {
                                    setFieldValue('id', groups.id, false);
                                    setFieldValue('label', groups.label, false);

                                    let selectedGroup = [{id: groups.id, label: this.makeGroupLabel(groups)}];
                                    this.setState({ selectedGroup: selectedGroup});
                                    setFieldValue('parent_id', groups.id, false);
                                }

                                let thresholds = [];
                                if(groups.thresholds !== undefined) {
                                    thresholds = groups.thresholds[0];
                                }
                                if (Array.isArray(thresholds) && thresholds.length > 0) {
                                    this.setThresholds(thresholds)
                                    let selectedThresholds = [{id: thresholds[0].id, label: thresholds[0].label}];
                                    this.setState({ selectedThresholds: selectedThresholds});
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
                                            <label className={`required`}>Group Label</label>
                                            <Field
                                                as="input"
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                        {errors, touched},
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
                                                labelKey='label'
                                                size="lg"
                                                onChange={(data) => this.onChangeGroup(data, setFieldValue)}
                                                options={this.state.groups}
                                                placeholder=''
                                                selected={this.state.selectedGroup}
                                                onSearch={this.handleSearchGroup}
                                                isLoading={this.state.loading}
                                                filterBy={this.filterBy}
                                                className={getInputClasses({errors, touched}, 'parent_id')}
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
                                                    onChange={this.onChangeThreshold}
                                                    options={this.state.thresholds}
                                                    clearButton={true}
                                                    placeholder=''
                                                    selected={this.state.selectedThresholds}
                                                    onSearch={this.handleSearchThreshold}
                                                    isLoading={this.state.loading}
                                                    filterBy={this.filterBy}
                                                    useCache={false}
                                                />
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

export default injectIntl(GroupsFormComponent);