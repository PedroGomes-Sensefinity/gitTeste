import React, {useEffect} from 'react';
import {ErrorMessage, Field, Formik} from 'formik';

import {getInputClasses} from '../../utils/formik';

import * as Yup from 'yup';
import {Link} from 'react-router-dom';
import {makeStyles} from '@material-ui/styles';
import apiService from '../../services/apiService';
import {AsyncTypeahead} from 'react-bootstrap-typeahead';
import DoneIcon from '@material-ui/icons/Done';

import '../../utils/yup-validations';
import BlockUi from "react-block-ui";
import groupsUtil from '../../utils/groups';
import toaster from '../../utils/toaster';
import { injectIntl } from 'react-intl';

import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import * as ace from 'brace';
import 'brace/mode/json';
import 'brace/theme/monokai';

import AceEditor from "react-ace";

import "brace/mode/json";
import "brace/theme/dreamweaver";
import "brace/snippets/json";
import "brace/ext/language_tools";
import DeleteIcon from "@material-ui/icons/Delete";
import {Table} from "react-bootstrap";
import notificationService from "../../services/notificationService";

class NotificationsTemplatesFormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            intl: props.intl,
            id: props.id,
            type: "",
            label: "",
            template: "",
            group_id: 0, // container
            isAddMode: !props.id,
            groupList: [],
            groups: [], // containers
            selectedGroup: [], // container
            loading: false,
            blocking: false,
            editorState: EditorState.createEmpty(),
            emailsAdded: [],
            smsAdded: [],
            jsonTemplate : '',
            contentType : '',
            charset : '',
        };
    }

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };

    componentDidMount() {
        // this.setState({blocking: true}
    }

    initialValues = {
        id: this.props.id,
        group_id: '',
        thresholds: [],
        label: '',
        emailsName: '',
        emailsEmail: '',
        smsName: '',
        smsNumber: '',
        smsBody: '',
        contentType: '',
        charset: '',
        webhook: '',
        emailSubject: '',
        cacheControl: '',
        url: '',
    };

    validationSchema = Yup.object().shape({
        type: Yup.string().required('Type is required'),
        label: Yup.string().required('Label is required'),
        // group_id: Yup.string().required('Parent Group is required'),
        smsName: Yup.string().matches(/^[a-zA-Z\s]+$/, "Must be only letters and spaces"),
        smsNumber: Yup.string()
            .matches(/^[0-9]+$/, "Must be a valid number")
            .min(10, 'Must have at least 10 digits'),
        emailsName: Yup.string().matches(/^[a-zA-Z\s]+$/, "Must be only letters and spaces"),
        emailsEmail: Yup.string().email(),
    });

    useStyles = makeStyles((theme) => ({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
            maxWidth: 300,
        },
        chips: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        chip: {
            margin: 2,
            height: 50,
        },
        headerMarginTop: {
            marginTop: theme.spacing(5),
        },
        noLabel: {
            marginTop: theme.spacing(3),
        },
    }));


    save = (fields, { setStatus, setSubmitting, resetForm }) => {
        this.setState({blocking: true});
        let method = (this.state.isAddMode) ? 'save' : 'update';
        let msgSuccess = (this.state.isAddMode)
            ? this.state.intl.formatMessage({id: 'DEVICE.CREATED'})
            : this.state.intl.formatMessage({id: 'DEVICE.UPDATED'});

        const notificationTemplate = this.setNotificationTemplate(fields)

        notificationService[method](notificationTemplate)
            .then((response) => {
                toaster.notify('success', msgSuccess);
                this.setState({blocking: false});
            });
    };

    setNotificationTemplate(fields) {
        let body    = fields[fields.type];
        let targets = []

        if (fields.type === 'email') {
            let emailsArr = []
            this.state.emailsAdded.forEach((val, index) => {
                emailsArr.push({ name: val.name, at: [val.at]});
            })
            targets = emailsArr;
            body    = this.convertToHtml(this.state.editorState.getCurrentContent())
        }

        if (fields.type === 'sms') {
            let smsArr = []
            this.state.smsAdded.forEach((val, index) => {
                smsArr.push({ name: val.name, at: [val.at]});
            })
            targets = smsArr;
        }

        if (fields.type === 'alarm') {
            body    = this.state.jsonTemplate;
        }

        let template = {
            subject: fields.emailSubject,
            body: body,
            targets_list: targets
        }

        if (fields.type === 'webhook') {
            template  = {
                url: fields.url,
                method: fields.method,
                content_type: fields.contentType,
                cache_control: fields.cacheControl,
                charset: fields.charset,
                body: body,
            };
        }

        return {
            id: fields.id,
            type: fields.type,
            label: fields.label,
            group_id: fields.group_id,
            template: JSON.stringify(template)
        }
    }

    convertToHtml(content) {
        return draftToHtml(convertToRaw(content))
    }

    onChangeGroup = (opt, setFieldValue) => {
        this.setState({ selectedGroup: opt});
        setFieldValue('group_id', '');

        if (opt.length > 0) {
            setFieldValue('group_id', opt[0].id);
        }
    };

    onChangeContentType = (val, setFieldValue) => {
        setFieldValue('contentType', val[0]);
    };

    onChangeCharset = (val, setFieldValue ) => {
        setFieldValue('charset',val[0]);
    };

    getGroups = (records) => {
        let groups = [];
        records.map((group) => {
            const label = groupsUtil.makeGroupLabel(group);
            groups.push({ id: group.id, label: label });
        });
        return groups;
    };

    handleSearchGroup = (query) => {
        this.setState({loading: true});

        apiService.getByText('group', query, 100, 0).then((response) => {
            this.setState({ groups: this.getGroups(response.groups) });
            this.setState({loading: false});
        });
    };

    getGroupList = () => {
        return apiService.get('group', 100, 0);
    }

    filterBy = () => true;

    renderEmailsBody(person, index) {
        return (
            <tr key={index}>
                <td style={{ textAlign: "center" }}>
                    <DeleteIcon onClick={() => this.deleteTableItem('emailsAdded', index)} /></td>
                <td>{person.name}</td>
                <td>{person.at}</td>
            </tr>
        )
    }

    renderSmsBody(person, index) {
        return (
            <tr key={index}>
                <td style={{ textAlign: "center" }}>
                    <DeleteIcon onClick={() => this.deleteTableItem('smsAdded', index)} /></td>
                <td>{person.name}</td>
                <td>{person.at}</td>
            </tr>
        )
    }

    deleteTableItem = (arr, index) => {
        const array = [...this.state[arr]];
        if (index !== -1) {
            array.splice(index, 1);
            this.setState({[arr]: array});
        }
    }

    tableGridEmails = () => {
        return (
            <Table responsive bordered hover>
                <thead>
                    <tr>
                        <th>
                            &nbsp;
                        </th>
                        <th>Name</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.emailsAdded.map(this.renderEmailsBody.bind(this))}
                </tbody>
            </Table>
        )
    }
    tableGridSms = () => {
        return (
            <Table responsive bordered hover>
                <thead>
                <tr>
                    <th>
                        &nbsp;
                    </th>
                    <th>Name</th>
                    <th>SMS</th>
                </tr>
                </thead>
                <tbody>
                    {this.state.smsAdded.map(this.renderSmsBody.bind(this))}
                </tbody>
            </Table>
        )
    }

    addContact(stateString, values, setFieldValue) {
        if (stateString in this.state) {
            if (values.name !== '' && values.at !== '') {
                const arr = this.state[stateString].concat(values)
                this.setState({[stateString]: arr})
            }
        }
        setFieldValue('smsName', '', false);
        setFieldValue('smsNumber', '', false);
        setFieldValue('emailsName', '', false);
        setFieldValue('emailsEmail', '', false);
    }

    onJsonChange(val) {
        this.setState({jsonTemplate: val})
    }

    setHtmlEditorContent(content) {
        const contentBlock = htmlToDraft(content);
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const editorState  = EditorState.createWithContent(contentState);

        this.setState({
            editorState: editorState
        })
    }

    setTargets(targets, stateArr){
        let arr = []
        targets.forEach((val, index) => {
            arr.push({name: val.name, at: val.at[0]})
        })
        this.setState({[stateArr]: arr})
    }

    render() {
        return (
            <BlockUi tag='div' blocking={this.state.blocking}>
            <Formik
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
                    errors,
                    touched,
                    isSubmitting,
                    handleSubmit,
                    values,
                    setFieldValue
                }) => {
                    const classes = this.useStyles();

                    useEffect(() => {


                        if (!this.state.isAddMode && this.state.id !== 'new') {
                            apiService
                            .getById('notificationstemplate', this.state.id)
                            .then((response) => {
                                const notification = response.notifications_templates[0]
                                const template     = JSON.parse(notification.template);


                                this.getGroupList().then((response) => {
                                    this.setState({ groupList: response.groups });
                                    const group = this.state.groupList.filter((group) => {
                                        return group.id === notification.group_id;
                                    })

                                    let selectedGroup = [{id: notification.group_id, label: groupsUtil.makeGroupLabel(group[0])}];
                                    this.setState({ selectedGroup: selectedGroup});
                                });

                                setFieldValue('label', notification.label, false);
                                setFieldValue('type', notification.type, false);



                                setFieldValue('group_id', notification.group_id, false);

                                if(notification.type === 'sms') {
                                    this.setTargets(template.targets_list, 'smsAdded');
                                    setFieldValue('sms', template.body, false);
                                }

                                if(notification.type === 'email') {
                                    setFieldValue('emailSubject', template.subject, false);
                                    this.setTargets(template.targets_list, 'emailsAdded');
                                    this.setHtmlEditorContent(template.body);
                                }

                                if(notification.type === 'alarm') {
                                    this.setState({jsonTemplate: template.body})
                                }

                                if(notification.type === 'webhook') {
                                    setFieldValue('method', template.method)
                                    setFieldValue('contentType', template.content_type)
                                    setFieldValue('charset', template.charset)
                                    setFieldValue('cacheControl', template.cache_control)
                                    setFieldValue('url', template.url)
                                    setFieldValue('webhook', template.body)
                                }
                            });
                        }
                    }, []);

                    useEffect(() => {
                        this.setState({type: values.type});
                    }, [values.type]);

                    return (
                        <form
                            className='card card-custom'
                            onSubmit={handleSubmit}>
                            {/* begin::Header */}
                            <div
                                className={`card-header py-3 `+ classes.headerMarginTop}>
                                <div className='card-title align-items-start flex-column'>
                                    <h3 className='card-label font-weight-bolder text-dark'>
                                        Template Information
                                    </h3>
                                    <span className='text-muted font-weight-bold font-size-sm mt-1'>
                                        Change general configurations about a template
                                    </span>
                                </div>
                                <div className='card-toolbar'>
                                    <button
                                        type='submit'
                                        className='btn btn-success mr-2'
                                        disabled={
                                            isSubmitting ||
                                            (touched && !isValid)
                                        }
                                    >
                                        <DoneIcon />
                                        Save Changes
                                        {isSubmitting}
                                    </button>
                                    <Link
                                        to='/devices/list'
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
                                        <div className='col-xl-4 col-lg-4'>
                                            <label>Type</label>
                                            <Field
                                                component="select"
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                    { errors, touched },
                                                    'type'
                                                )}`}
                                                name='type'
                                                placeholder='Select the type of this alarm'
                                            >
                                                <option key='0' value=''>&nbsp;</option>
                                                <option key='alarm' value='alarm'>Alarm</option>
                                                <option key='email' value='email'>Email</option>
                                                <option key='sms' value='sms'>SMS</option>
                                                <option key='webhook' value='webhook'>Webhook</option>
                                            </Field>
                                        </div>

                                        <div className='col-xl-4 col-lg-4'>
                                            <label>Template Label</label>
                                            <Field
                                                component="input"
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                    { errors, touched },
                                                    'label'
                                                )}`}
                                                name='label'
                                                placeholder='Set the Group Label'
                                            />
                                        </div>

                                        <div className='col-xl-4 col-lg-4'>
                                            <label>
                                                Group
                                            </label>
                                            <AsyncTypeahead
                                                id='typeahead-groups'
                                                labelKey='label'
                                                size="lg"
                                                name={'group_id'}
                                                onSearch={this.handleSearchGroup}
                                                onChange={(data) => this.onChangeGroup(data, setFieldValue)}
                                                options={this.state.groups}
                                                clearButton={true}
                                                placeholder='Select a group'
                                                selected={this.state.selectedGroup}
                                                isLoading={this.state.loading}
                                                filterBy={this.filterBy}
                                            />
                                        </div>
                                    </div>

                                    {(values.type === 'sms') &&
                                    <div className={'form-group row '}>
                                        <div className='col-xl-4 col-lg-4'>
                                            <label>Contact Name</label>
                                            <Field
                                                component="input"
                                                className={`form-control form-control-lg form-control-solid  ${getInputClasses(
                                                    { errors, touched },
                                                    'smsName'
                                                )}`}
                                                name='smsName'
                                                placeholder='Enter the notification message'
                                            />
                                            <ErrorMessage
                                                name='smsName'
                                                component='div'
                                                className='invalid-feedback'
                                            />
                                        </div>
                                        <div className='col-xl-4 col-lg-4'>
                                            <label>Contact Phone Number</label>
                                            <Field
                                                component="input"
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                    { errors, touched },
                                                    'smsNumber'
                                                )}`}
                                                name='smsNumber'
                                                placeholder=''
                                            />
                                            <ErrorMessage
                                                name='smsNumber'
                                                component='div'
                                                className='invalid-feedback'
                                            />
                                        </div>
                                        <div className='col-xl-4 col-lg-4'>
                                            <button
                                                className='btn btn-success mr-2'
                                                type={'button'}
                                                onClick={() => this.addContact('smsAdded', {name:values.smsName, at: values.smsNumber}, setFieldValue)}
                                            >Add Contact Info</button>
                                        </div>
                                    </div>
                                    }
                                    {(values.type === 'sms') &&
                                    <div className={'form-group row '}>
                                        <div className='col-xl-8 col-lg-8'>
                                            <Field
                                                component="textarea"
                                                className={`form-control form-control-lg form-control-solid`}
                                                name='sms'
                                                placeholder='Set the SMS text'
                                            />
                                        </div>
                                        <div className='col-xl-4 col-lg-4'>
                                            {this.tableGridSms()}
                                        </div>
                                    </div>
                                    }
                                    {(values.type === 'webhook') &&
                                    <div className={'form-group row '}>
                                        <div className='col-xl-3 col-lg-3'>
                                            <label>Method</label>
                                            <Field
                                                component="select"
                                                className={`form-control form-control-lg form-control-solid`}
                                                name='method'
                                                placeholder=''
                                            >
                                                <option key='0' value=''>&nbsp;</option>
                                                <option key='get' value='post'>GET</option>
                                                <option key='post' value='post'>POST</option>
                                                <option key='put' value='put'>PUT</option>
                                            </Field>
                                        </div>
                                        <div className='col-xl-3 col-lg-3'>
                                            <label>Content Type</label>

                                            <Field
                                                component="input"
                                                className={`form-control form-control-lg form-control-solid`}
                                                name='contentType'
                                                placeholder='Set the content type'
                                            />
                                        </div>
                                        <div className='col-xl-3 col-lg-3'>
                                            <label>Charset</label>
                                            <Field
                                                component="input"
                                                className={`form-control form-control-lg form-control-solid`}
                                                name='charset'
                                                placeholder='Set the content type'
                                            />
                                        </div>
                                        <div className='col-xl-3 col-lg-3'>
                                            <label>Cache Control</label>
                                            <Field
                                                component="input"
                                                className={`form-control form-control-lg form-control-solid`}
                                                name='cacheControl'
                                                placeholder='Cache Control'
                                            />
                                        </div>
                                    </div>
                                    }
                                    {(values.type === 'webhook') &&
                                        <div className={'form-group row '}>
                                            <div className='col-xl-12 col-lg-12'>
                                                <Field
                                                    component="input"
                                                    className={`form-control form-control-lg form-control-solid`}
                                                    name='url'
                                                    placeholder='Enter the url endpoint'
                                                />
                                            </div>
                                        </div>
                                    }
                                    {(values.type === 'webhook') &&
                                    <div className={'form-group row '}>
                                        <div className='col-xl-12 col-lg-12'>
                                            <label>Notification message</label>
                                            <Field
                                                component="textarea"
                                                className={`form-control form-control-lg form-control-solid`}
                                                name='webhook'
                                                placeholder='Enter the notification message'
                                            />
                                        </div>
                                    </div>
                                    }
                                    {(values.type === 'email') &&
                                    <div className={'form-group row '}>
                                        <div className='col-xl-4 col-lg-4'>
                                            <label>Contact Name</label>
                                            <Field
                                                component="input"
                                                className={`form-control form-control-lg form-control-solid`}
                                                name='emailsName'
                                                placeholder='Name'
                                            />
                                        </div>
                                        <div className='col-xl-4 col-lg-4'>
                                            <label>Contact Email</label>
                                            <Field
                                                component="input"
                                                className={`form-control form-control-lg form-control-solid`}
                                                name='emailsEmail'
                                                placeholder='Email'
                                                rows={10}
                                            />
                                        </div>
                                        <div className='col-xl-4 col-lg-4'>
                                            <button
                                                className='btn btn-success'
                                                type={'button'}
                                                onClick={() => this.addContact('emailsAdded', {name:values.emailsName, at: values.emailsEmail}, setFieldValue)}
                                            >
                                                Add Contact Info
                                            </button>
                                        </div>
                                    </div>
                                    }
                                    {(values.type === 'email') &&
                                    <div className='form-group row'>
                                        <div className={'col-xl-8 col-lg-8'}>
                                            <label>Email Subject</label>
                                            <Field
                                                component="input"
                                                className={`form-control form-control-lg form-control-solid`}
                                                name='emailSubject'
                                                placeholder='Enter the subject'
                                            />
                                        </div>
                                    </div>
                                    }
                                    {(values.type === 'email') &&
                                    <div className={'form-group row '}>
                                        <div className='col-xl-8 col-lg-8'>
                                            <Editor
                                                editorState={this.state.editorState}
                                                wrapperClassName="demo-wrapper"
                                                editorClassName="demo-editor"
                                                onEditorStateChange={this.onEditorStateChange}
                                            />
                                        </div>
                                        <div className='col-xl-4 col-lg-4'>
                                            {this.tableGridEmails()}
                                        </div>
                                    </div>
                                    }
                                    {(values.type === 'alarm') &&
                                    <div className={'form-group row '}>
                                        <AceEditor
                                            mode="json"
                                            theme="dreamweaver"
                                            name="json-editor"
                                            fontSize={14}
                                            width="100%"
                                            showPrintMargin={true}
                                            showGutter={true}
                                            highlightActiveLine={true}
                                            value={this.state.jsonTemplate}
                                            onChange={(data) => this.onJsonChange(data)}
                                            setOptions={{
                                                enableBasicAutocompletion: true,
                                                enableLiveAutocompletion: true,
                                                enableSnippets: true,
                                                showLineNumbers: true,
                                                tabSize: 2
                                            }}
                                            editorProps={{$blockScrolling: true}}
                                        />
                                    </div>
                                    }
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

export default injectIntl(NotificationsTemplatesFormComponent);