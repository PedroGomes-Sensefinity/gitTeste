import { Field, Formik } from 'formik';
import React, { useEffect, useState } from 'react';

import { getInputClasses } from '../../utils/formik';

import DoneIcon from '@material-ui/icons/Done';
import { makeStyles } from '@material-ui/styles';
import * as ace from 'brace';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';

import apiService from '../../services/apiService';
import NotificationTemplateSmsForm from './NotificationTemplateSmsForm';
import NotificationTemplateEmailForm from './NotificationTemplateEmailForm';
import NotificationTemplatesWebhookForm from './NotificationTemplatesWebhookForm.jsx';

import BlockUi from "react-block-ui";
import { injectIntl } from 'react-intl';
import toaster from '../../utils/toaster';
import '../../utils/yup-validations';

import { ContentState, convertToRaw, EditorState } from 'draft-js';
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

import 'brace/mode/json';
import "brace/snippets/json";
import "brace/theme/dreamweaver";
import 'brace/theme/monokai';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import AceEditor from "react-ace";
import * as  ace from 'brace';
import notificationService from "../../services/notificationService";

const useStyles = makeStyles((theme) => ({
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

function NotificationsTemplatesFormComponent(props) {
    const intl = props.intl
    const notificationTemplateId = props.id
    const isAddMode = !notificationTemplateId
    const [editorState, setEditorState] = useState(EditorState.createEmpty())
    const [notificationTemplateInfo, setNotificationTemplate] = useState({})
    const [blocking, setBlocking] = useState(false)
    const [emailsAdded, setEmailsAdded] = useState([])
    const [smsAdded, setSmsAdded] = useState([])
    const [jsonTemplate, setJsonTemplate] = useState('')

    const classes = useStyles();

    useEffect(() => {
        if (!isAddMode && notificationTemplateId !== 'new') {
            apiService
                .getById('notificationstemplate', notificationTemplateId)
                .then((response) => {
                    const respNotifs = response.notifications_templates || []
                    if (respNotifs.length > 0) {
                        const notification = respNotifs[0]
                        let template = JSON.parse(notification.template);
                        notification.template = template
                        setNotificationTemplate(notification)

                        if (notification.type === 'alarm') {
                            setJsonTemplate(template.body)
                        }
                    }

                });
        }
    }, []);

    const onEditorStateChange = (editorState) => {
        setEditorState(editorState);
    };

    console.log(notificationTemplateInfo)

    const initialValues = {
        id: notificationTemplateId,
        type: notificationTemplateInfo.type || '',
        label: notificationTemplateInfo.label || '',
        thresholds: [],
        emailsName: notificationTemplateInfo.emailsName || [],
        emailsEmail: notificationTemplateInfo.emailsEmail || [],
        smsName: notificationTemplateInfo.smsName || [],
        smsNumber: notificationTemplateInfo.smsNumber || [],
        smsBody: '',
        contentType: '',
        charset: '',
        webhook: '',
        emailSubject: '',
        cacheControl: '',
        url: '',
    };

    const validationSchema = Yup.object().shape({
        type: Yup.string().required('Type is required'),
        label: Yup.string().required('Label is required'),
        smsName: Yup.string().matches(/^[a-zA-Z\s]+$/, "Must be only letters and spaces"),
        smsNumber: Yup.string()
            .matches(/^\+?\d+(-\d+)*$/, "Must be a valid number")
            .min(10, 'Must have at least 10 digits'),
        emailsName: Yup.string().matches(/^[a-zA-Z\s]+$/, "Must be only letters and spaces"),
        emailsEmail: Yup.string().email(),
    });

    const save = (fields) => {
        console.log(`called save with ${JSON.stringify(fields)}`)
        setBlocking(true)
        let method = (isAddMode) ? 'save' : 'update';
        let msgSuccess = (isAddMode)
            ? intl.formatMessage({ id: 'DEVICE.CREATED' })
            : intl.formatMessage({ id: 'DEVICE.UPDATED' });

        const notificationTemplate = createNotificationTemplateFromFields(fields)

        notificationService[method](notificationTemplate)
            .then((_response) => {
                toaster.notify('success', msgSuccess);
                setBlocking(false)
            });
    };

    const createNotificationTemplateFromFields = (fields) => {
        let body = fields[fields.type];
        let targets = []

        if (fields.type === 'email') {
            let emailsArr = emailsAdded.map((val) => {
                return { name: val.name, at: [val.at] }
            })
            targets = emailsArr;
            body = convertToHtml(editorState.getCurrentContent())
        }

        if (fields.type === 'sms') {
            let smsArr = smsAdded.map((val) => {
                smsArr.push({ name: val.name, at: [val.at] });
            })
            targets = smsArr;
        }

        if (fields.type === 'alarm') {
            body = jsonTemplate;
        }

        let template = {
            subject: fields.emailSubject,
            body: body,
            targets_list: targets
        }

        if (fields.type === 'webhook') {
            template = {
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
            template: JSON.stringify(template)
        }
    }

    const convertToHtml = (content) => {
        return draftToHtml(convertToRaw(content))
    }

    const onChangeContentType = (val, setFieldValue) => {
        setFieldValue('contentType', val[0]);
    };

    const filterBy = () => true;

    const addSmsContact = (values, setFieldValue) => {
        if (values.name !== '' && values.at !== '') {
            const arr = smsAdded.map((s) => s).concat(values)
            setSmsAdded(arr)
        }
        setFieldValue('smsName', '', false);
        setFieldValue('smsNumber', '', false);
    }

    const addEmailContact = (values, setFieldValue) => {
        if (values.name !== '' && values.at !== '') {
            const arr = emailsAdded.map((s) => s).concat(values)
            setEmailsAdded(arr)
        }
        setFieldValue('emailsName', '', false);
        setFieldValue('emailsEmail', '', false);
    }

    const onJsonChange = (val) => {
        setJsonTemplate(val)
    }

    const setHtmlEditorContent = (content) => {
        const contentBlock = htmlToDraft(content);
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const newEditorState = EditorState.createWithContent(contentState);
        setEditorState(newEditorState)
    }

    const setTargets = (targets, type) => {
        let arr = targets.map(val => {
            return { name: val.name, at: val.at[0] }
        })

        switch (type) {
            case "sms": setSmsAdded(arr)
            case "email": setEmailsAdded(arr)
        }
    }

    return (
        <BlockUi tag='div' blocking={blocking}>
            <Formik
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
                    errors,
                    touched,
                    isSubmitting,
                    handleSubmit,
                    values,
                    setFieldValue
                }) => {
                    console.log(values)
                    console.log(isValid)
                    return (
                        <form
                            className='card card-custom'
                            onSubmit={handleSubmit}>
                            {/* begin::Header */}
                            <div
                                className={`card-header py-3 ` + classes.headerMarginTop}>
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
                                        to='/notification-templates/list'
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

                                        <div className='col-xl-8 col-lg-8'>
                                            <label>Template Label</label>
                                            <Field
                                                component="input"
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                    { errors, touched },
                                                    'label'
                                                )}`}
                                                name='label'
                                                placeholder='Set the Template Label'
                                            />
                                        </div>
                                    </div>
                                    {(values.type === 'sms') && <NotificationTemplateSmsForm
                                        errors={errors}
                                        touched={touched}
                                        smsAdded={smsAdded}
                                        addSmsContact={addSmsContact}
                                        setSmsAdded={setSmsAdded}
                                        setFieldValue={setFieldValue}
                                        values={values}
                                    />
                                    }
                                    {(values.type === 'webhook') &&
                                        <NotificationTemplatesWebhookForm />
                                    }
                                    {(values.type === 'email') &&
                                        <NotificationTemplateEmailForm
                                            setFieldValue={setFieldValue}
                                            emailsAdded={emailsAdded}
                                            setEmailsAdded={setEmailsAdded}
                                            values={values}
                                            onEditorStateChange={onEditorStateChange}
                                            editorState={editorState}
                                            addEmailContact={addEmailContact} />
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
                                                value={jsonTemplate}
                                                onChange={(data) => onJsonChange(data)}
                                                setOptions={{
                                                    enableBasicAutocompletion: true,
                                                    enableLiveAutocompletion: true,
                                                    enableSnippets: true,
                                                    showLineNumbers: true,
                                                    tabSize: 2
                                                }}
                                                editorProps={{ $blockScrolling: true }}
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

export default injectIntl(NotificationsTemplatesFormComponent);