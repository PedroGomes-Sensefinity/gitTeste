import React, {useEffect} from 'react';
import {ErrorMessage, Field, Formik} from 'formik';
import * as Yup from 'yup';
import {Link} from 'react-router-dom';
import {makeStyles} from '@material-ui/styles';
import floorMapService from '../../services/floorMapService';
import apiService from '../../services/apiService';
import DoneIcon from '@material-ui/icons/Done';
import {getInputClasses} from '../../utils/formik';
import '../../utils/yup-validations';
import BlockUi from "react-block-ui";
import toaster from '../../utils/toaster';
import { injectIntl } from 'react-intl';

class FloorMapFormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            intl: props.intl,
            id: props.id,
            isAddMode: !props.id,
            metadata: {},
            label: "",
            description: "",
            loading: false,
            blocking: false,
        };
    }

    componentDidMount() {

    }

    initialValues = {
        id: this.props.id,
        label: "",
        description: "",
    };

    validationSchema = Yup.object().shape({
        label: Yup.string().max(50).required('Label is required'),
        description: Yup.string().max(255, 'Description is too long. Max 255 characters.'),
    });

    useStyles = makeStyles((theme) => ({
        headerMarginTop: {
            marginTop: theme.spacing(5),
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

    save = (fields, {setSubmitting, resetForm}) => {
        this.setState({blocking: true});
        let method = (this.state.isAddMode) ? 'save' : 'update';
        let msgSuccess = (this.state.isAddMode)
            ? this.state.intl.formatMessage({id: 'FLOORMAP.CREATED'})
            : this.state.intl.formatMessage({id: 'FLOORMAP.UPDATED'});

        floorMapService[method](fields)
            .then((response) => {
                toaster.notify('success', msgSuccess);
                this.setState({blocking: false});
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
                    this.save(values, {setSubmitting, resetForm});
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
                            .getById('floormaps', this.state.id)
                            .then((response) => {
                                const res = response.floormaps[0];
                                setFieldValue('label', res.label, false);
                                setFieldValue('description', res.description, false);
                            });
                        }
                    }, [setFieldValue]);

                    return (
                        <form
                            className='card card-custom'
                            onSubmit={handleSubmit}>
                            {/* begin::Header */}
                            <div
                                className={`card-header py-3 `+ classes.headerMarginTop}>
                                <div className='card-title align-items-start flex-column'>
                                    <h3 className='card-label font-weight-bolder text-dark'>
                                        Floor map Information
                                    </h3>
                                    <span className='text-muted font-weight-bold font-size-sm mt-1'>
                                        Change information about the floor map
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
                                        to='/floor-maps/list'
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
                                            <label className={`required`}>Label</label>
                                            <div>
                                                <Field
                                                    as="input"
                                                    className={`form-control form-control-lg form-control-solid required ${getInputClasses(
                                                        {errors, touched},
                                                        'label'
                                                    )}`}
                                                    name='label'
                                                    placeholder='Set the Floor map label'
                                                    {...getFieldProps('label')}
                                                />
                                                <ErrorMessage name="label" component="div" className="invalid-feedback" />
                                            </div>
                                        </div>

                                        <div className='col-xl-6 col-lg-6'>
                                            <label>Description</label>
                                            <Field
                                                    as="textarea"
                                                    rows='5'
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
                                                <ErrorMessage name="description" component="div" className="invalid-feedback"/>
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

export default injectIntl(FloorMapFormComponent);