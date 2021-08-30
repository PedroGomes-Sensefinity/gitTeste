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
import boardFamiliesService from '../../services/boardFamiliesService';
import { Form } from 'react-bootstrap';

class BoardFamiliesFormComponent extends React.Component {
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
        force_board_id: false,
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
            ? this.state.intl.formatMessage({id: 'BOARDFAMILY.CREATED'})
            : this.state.intl.formatMessage({id: 'BOARDFAMILY.UPDATED'});

        boardFamiliesService[method](fields)
            .then((response) => {
                toaster.notify('success', msgSuccess);
                setSubmitting(false);
                
                this.setState({blocking: false});
                
                if (this.state.id === 'new') {
                    resetForm(this.initialValues);
                    setFieldValue('force_board_id', false, false);
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
                    handleSubmit,
                    values
                }) => {
                    const classes = this.useStyles();

                    useEffect(() => {
                        console.log(this.state.isAddMode, this.state.id);
                        if (!this.state.isAddMode && this.state.id !== 'new') {
                            apiService
                            .getById('board_families', this.state.id)
                            .then((response) => {
                                let item = [];
                                if(response.board_families !== undefined && response.board_families.length > 0) {
                                    item = response.board_families[0];
                                }
                                
                                setFieldValue('id', item.id, false);
                                setFieldValue('name', item.name, false);
                                setFieldValue('force_board_id', item.force_board_id, false);
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
                                        Board family Information
                                    </h3>
                                    <span className='text-muted font-weight-bold font-size-sm mt-1'>
                                        Change general configurations about board family
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
                                        to='/board-families/list'
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
                                            <label>Name</label>
                                            <Field
                                                as="input"
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                        {errors, touched},
                                                        'name'
                                                    )}`}
                                                name='name'
                                                placeholder='Set the board family name'
                                                {...getFieldProps('name')}
                                            />
                                            <ErrorMessage name="name" component="div" className="invalid-feedback" />
                                        </div>


                                        <div className='col-xl-6 col-lg-6'>
                                            <div className='mt-10'>
                                                <Form.Check 
                                                    label="Force board ID" 
                                                    name="force_board_id" 
                                                    type="checkbox" 
                                                    id="force_board_id" 
                                                    checked={values.force_board_id === true}
                                                    {...getFieldProps('force_board_id')}
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

export default injectIntl(BoardFamiliesFormComponent);