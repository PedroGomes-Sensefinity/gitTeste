import React  from "react";
import boardFamilyTemplatesService from "../../services/boardFamilyTemplatesService";
import BlockUi from "react-block-ui";
import { injectIntl } from "react-intl";
import TableGrid from "../../components/table-grid/table-grid.component";
import { Card, CardContent, Button } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Modal } from 'react-bootstrap'
import * as Yup from 'yup';
import {ErrorMessage, Field, Formik} from 'formik';
import {getInputClasses} from '../../utils/formik';
import '../../utils/yup-validations';
import DoneIcon from '@material-ui/icons/Done';
import EditIcon from '@material-ui/icons/Edit';
import toaster from '../../utils/toaster';

class BoardFamilyTemplatesComponent extends React.Component {
    tableRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            intl: props.intl,
            id: props.id,
            templates: [],
            data: {
                board_family_id: this.props.id
            },
            loading: false,
            blocking: false,
            modalShow: false,
        };
    }

    componentDidMount() {
        this.setState({ loading: true });
        this.getData();
    }

    getData = () => {
        boardFamilyTemplatesService.byBoardFamily(this.state.id, 99999999, 0).then(response => {
            console.log(response);
            this.setState({ templates: response.board_family_templates });
            this.setState({ loading: false });
        });
    }

    onHideModal = () => {
        this.setState({modalShow: false});
        this.getData();
    }

    FormModalTemplate(props) {
        console.log(props);
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

        let useStyles = makeStyles((theme) => ({
            headerMarginTop: {
                marginTop: theme.spacing(5),
            }
        }));

        return (
            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, { setStatus, setSubmitting, resetForm, setFieldValue }) => {
                  let method = (values.id === '') ? 'save' : 'update';
                  console.log(method);
                  console.log(values);
                  boardFamilyTemplatesService[method](values)
                    .then(() => {
                        let message = (values.id === '') 
                            ? props.intl.formatMessage({id: 'BOARDFAMILYTEMPLATE.CREATED'})
                            : props.intl.formatMessage({id: 'BOARDFAMILYTEMPLATE.UPDATED'});

                        toaster.notify('success', message);
                        setFieldValue('template', '', false);
                        setFieldValue('board_family_id', '', false);
                        props.onHide();
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
                    setFieldValue
                }) => {
                    return (
                        <Modal {...props} aria-labelledby="contained-modal-title-vcenter">
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
                                                            {errors, touched},
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
                    );
                }}
            </Formik>
        );
      }

    render() {
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

        const classes = makeStyles((theme) => ({
            button: {
                margin: theme.spacing(1),
            },
            leftIcon: {
                marginRight: theme.spacing(1),
            },
        }));

        return (
            <BlockUi tag="div" blocking={this.state.blocking}>
                <Card>
                    <CardContent>
                        <Button variant="contained" color="secondary" className={classes.button} onClick={() => this.setState({modalShow: true}) }>
                            <AddIcon className={classes.leftIcon} />
                            New template
                        </Button>
                        <TableGrid
                            actions={[
                                {
                                    icon: EditIcon,
                                    tooltip: 'Edit template',
                                    onClick: (event, rowData) => {
                                        this.setState({data: rowData});
                                        this.setState({modalShow: true})
                                    },
                                },
                            ]}
                            title=""
                            columns={columns}
                            data={this.state.templates}
                            isLoading={this.state.loading}
                        />
                    </CardContent>
                </Card>

                <this.FormModalTemplate
                  show={this.state.modalShow}
                  onHide={this.onHideModal}
                  data={this.state.data}
                  backdrop="static"
                  intl={this.state.intl}
                  keyboard={false}
                />
            </BlockUi>
        );
    }
}

export default injectIntl(BoardFamilyTemplatesComponent);
