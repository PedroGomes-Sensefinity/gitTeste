import DeleteIcon from "@material-ui/icons/Delete";
import { Field } from 'formik';
import React from 'react';
import { Editor } from "react-draft-wysiwyg";

import { Table } from "react-bootstrap";

export default function NotificationTemplateEmailForm(props) {

    const addEmailContact = props.addEmailContact
    const setFieldValue = props.setFieldValue
    const emailsAdded = props.emailsAdded
    const setEmailsAdded = props.setEmailsAdded
    const values = props.values
    const onEditorStateChange = props.onEditorStateChange
    const editorState = props.editorState

    const tableGridEmails = () => {
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
                    {emailsAdded.map(renderEmailsBody.bind(this))}
                </tbody>
            </Table>
        )
    }

    const renderEmailsBody = (person, index) => {
        return (
            <tr key={index}>
                <td style={{ textAlign: "center" }}>
                    <DeleteIcon onClick={() => {
                        const array = emailsAdded.map(t => t);
                        array.splice(index, 1);
                        setEmailsAdded(array);
                    }} /></td>
                <td>{person.name}</td>
                <td>{person.at}</td>
            </tr>
        )
    }

    return <>
        <div className={'form-group row '}>
            <div className='col-xl-12 col-lg-12'>
                <div className='alert alert-secondary'>
                    <div className=''>
                        <span>
                            <b>Time variables</b>: %timestamp%  <b>Device variables</b>: %device_group% %device_id%
                            %device_label% <b>Measurements variables</b>: %measurement_type% %measurement_value% <b>Threshold variables</b>: %threshold_name% %threshold_id% <b>Asset variables</b>: %asset_id% %asset_label% <b>Geofences variables</b>: %geofence_id% %geofence_label% %alert_status% <b>Shape variables</b>: %shape_id% %shape_label%
                        </span>
                    </div>
                </div>
            </div>
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
                    onClick={() => addEmailContact({ name: values.emailsName, at: values.emailsEmail }, setFieldValue)}
                >
                    Add Contact Info
                </button>
            </div>
        </div>
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

        <div className={'form-group row '}>
            <div className='col-xl-8 col-lg-8'>
                <Editor
                    editorState={editorState}
                    wrapperClassName="demo-wrapper"
                    editorClassName="demo-editor"
                    onEditorStateChange={onEditorStateChange}
                />
            </div>
            <div className='col-xl-4 col-lg-4'>
                {tableGridEmails()}
            </div>
        </div>
    </>
}