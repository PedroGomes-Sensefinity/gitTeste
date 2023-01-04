import DoneIcon from '@material-ui/icons/Done';
import { makeStyles } from '@material-ui/styles';
import { ErrorMessage, Field, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import BlockUi from "react-block-ui";
import { Form } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { Link, useOutletContext } from 'react-router-dom';
import * as Yup from 'yup';
import apiService from '../../services/apiService';
import boardFamiliesService from '../../services/boardFamiliesService';
import { getInputClasses } from '../../utils/formik';
import toaster from '../../utils/toaster';
import '../../utils/yup-validations';

const useStyles = makeStyles((theme) => ({
    headerMarginTop: {
        marginTop: theme.spacing(5),
    }
}));

function BoardFamiliesFormComponent(props) {
    const intl = props.intl
    const { boardFamilyId: boardId } = useOutletContext() || props
    const isAddMode = !boardId
    const [boardFamilyInfo, setBoardFamilyInfo] = useState({})
    const [blocking, setBlocking] = useState(true)

    const initialValues = {
        id: boardFamilyInfo.id || '',
        name: boardFamilyInfo.name || '',
        force_board_id: boardFamilyInfo.force_board_id || false,
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
    });

    const classes = useStyles();

    useEffect(() => {
        if (!isAddMode) {
            apiService
                .getById('board_families', boardId)
                .then((response) => {
                    const respBoardFamilies = response.board_families || [];
                    if (respBoardFamilies.length > 0) {
                        setBoardFamilyInfo(respBoardFamilies[0]);
                        setBlocking(false)
                    }
                });
        } else {
            setBlocking(false)
        }
    }, []);


    const save = (fields, { setSubmitting, resetForm }) => {
        setBlocking(true);
        setSubmitting(true);

        let method = (isAddMode) ? 'save' : 'update';
        let msgSuccess = (isAddMode)
            ? intl.formatMessage({ id: 'BOARDFAMILY.CREATED' })
            : intl.formatMessage({ id: 'BOARDFAMILY.UPDATED' });

        boardFamiliesService[method](fields)
            .then(() => {
                toaster.notify('success', msgSuccess);
                setSubmitting(false);

                setBlocking(false);

                if (isAddMode) {
                    resetForm()
                }
            });
    };

    return (
        <BlockUi tag='div' blocking={blocking}>
            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, { setFieldValue, setSubmitting, resetForm }) => {
                    save(values, {
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
                    handleSubmit,
                    values
                }) => <form
                    className='card card-custom'
                    onSubmit={handleSubmit}>
                        {/* begin::Header */}
                        <div
                            className={`card-header py-3 ` + classes.headerMarginTop}>
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
                                        <label>Name</label>
                                        <Field
                                            as="input"
                                            className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                { errors, touched },
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
                                                checked={values.force_board_id}
                                                {...getFieldProps('force_board_id')}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* end::Form */}
                    </form>
                }
            </Formik>
        </BlockUi>
    );

}

export default injectIntl(BoardFamiliesFormComponent);