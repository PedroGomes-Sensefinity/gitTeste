import { Button, Card, CardContent } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import DoneIcon from '@material-ui/icons/Done';
import EditIcon from '@material-ui/icons/Edit';
import { ErrorMessage, Field, Formik } from 'formik';
import React, { useEffect, useState } from "react";
import { Container, Modal } from 'react-bootstrap';
import { injectIntl } from "react-intl";
import * as Yup from 'yup';
import boardFamilyTemplatesService from "../../services/boardFamilyTemplatesService";
import { getInputClasses } from '../../utils/formik';
import toaster from '../../utils/toaster';
import '../../utils/yup-validations';
import TableGrid from "../table-grid/TableGrid";

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
    leftIcon: {
        marginRight: theme.spacing(1),
    },
}));

function BoardFamilyTemplatesComponent(props) {
    const intl = props.intl
    const boardFamilyId = props.id
    const classes = useStyles()
    const [templates, setTemplates] = useState([])
    const [data, setData] = useState({ board_family_id: boardFamilyId })
    const [loading, setLoading] = useState(false)
    const [isModalVisible, setModalVisible] = useState(false)

    useEffect(() => {
        setLoading(true)
        getData()
    }, [])

    const getData = () => {
        boardFamilyTemplatesService.byBoardFamily(boardFamilyId, 99999999, 0).then(response => {
            const respBoardFamilyTemplates = response.board_family_templates || []
            setTemplates(respBoardFamilyTemplates)
            setLoading(false)
        });
    }

    const onHideModal = () => {
        setModalVisible(false);
        getData();
    }

    const columns = [
        {
            field: "id",
            title: "ID"
        },
        {
            field: "version",
            title: "Version"
        }
    ];

    return <>
        <Card>
            <CardContent>
                <Button variant="contained" color="secondary" className={classes.button} onClick={() => setModalVisible(true)}>
                    <AddIcon className={classes.leftIcon} />
                    New template
                </Button>
                <TableGrid
                    actions={[
                        {
                            icon: EditIcon,
                            tooltip: 'Edit template',
                            onClick: (_event, rowData) => {
                                setData(rowData)
                                setModalVisible(true)
                            },
                        },
                    ]}
                    title=""
                    columns={columns}
                    data={templates}
                    isLoading={loading}
                />
            </CardContent>
        </Card>
        <FormModalTemplate
            show={isModalVisible}
            onHide={onHideModal}
            data={data}
            backdrop="static"
            intl={intl}
            keyboard={false}
        />
    </>
}

function FormModalTemplate(props) {
    let initialValues = {
        id: props.data.id || '',
        template: props.data.template || '',
        board_family_id: parseInt(props.data.board_family_id),
    };

    let validationSchema = Yup.object().shape({
        template: Yup.string()
            .required('Template is required')
            .isJson("Template needs to be a valid JSON"),
    });

    const save = (values, setFieldValue) => {
        let method = (values.id === '') ? 'save' : 'update';
        boardFamilyTemplatesService[method](values)
            .then(() => {
                let message = (values.id === '')
                    ? props.intl.formatMessage({ id: 'BOARDFAMILYTEMPLATE.CREATED' })
                    : props.intl.formatMessage({ id: 'BOARDFAMILYTEMPLATE.UPDATED' });
                toaster.notify('success', message);
                setFieldValue('template', '', false);
                setFieldValue('board_family_id', '', false);
                props.onHide();
            });
    }
    return (
        <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, { setFieldValue }) => save(values, setFieldValue)}
        >
            {({
                isValid,
                getFieldProps,
                errors,
                touched,
                isSubmitting,
                handleSubmit,
            }) => <Modal {...props} aria-labelledby="contained-modal-title-vcenter">
                    <form className='card card-custom' onSubmit={handleSubmit}>
                        <Modal.Header closeButton>
                            <Modal.Title id="contained-modal-title-vcenter">
                                New Template
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="show-grid">
                            <Container>
                                {/* begin::Form */}
                                <div className='form'>
                                    <div className='form-group row'>
                                        <div className='col-xl-12 col-lg-12'>
                                            <label>Template</label>
                                            <div>
                                                <Field
                                                    as="textarea"
                                                    rows='7'
                                                    className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                        { errors, touched },
                                                        'template'
                                                    )}`}
                                                    name='template'
                                                    placeholder=''
                                                    {...getFieldProps(
                                                        'template'
                                                    )}
                                                />
                                                <ErrorMessage name="template" component="div" className="invalid-feedback" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* end::Form */}
                            </Container>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={props.onHide}>Close</Button>
                            <Button
                                type='submit'
                                className='btn btn-success'
                                disabled={isSubmitting || (touched && !isValid)}
                            >
                                <DoneIcon /> Save
                            </Button>
                        </Modal.Footer>
                    </form>
                </Modal>
            }
        </Formik>
    );
}


export default injectIntl(BoardFamilyTemplatesComponent);
