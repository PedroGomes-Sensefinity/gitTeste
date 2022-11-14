import { Table } from "react-bootstrap";
import { getInputClasses } from '../../utils/formik';
import DeleteIcon from "@material-ui/icons/Delete";
import { ErrorMessage, Field } from 'formik';
import React from 'react';



export default function NotificationTemplateSmsForm(props) {
    const addSmsContact = props.addSmsContact
    const errors = props.errors
    const touched = props.touched
    const setSmsAdded = props.setSmsAdded
    const smsAdded = props.smsAdded
    const values = props.values
    const setFieldValue = props.setFieldValue   

    const renderSmsBody = (person, index) => {
        return (
            <tr key={index}>
                <td style={{ textAlign: "center" }}>
                    <DeleteIcon onClick={() => {
                        const array = smsAdded.map(t => t);
                        array.splice(index, 1);
                        setSmsAdded(array);
                    }} /></td>
                <td>{person.name}</td>
                <td>{person.at}</td>
            </tr>
        )
    }

    const tableGridSms = () => {
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
                    {smsAdded.map(renderSmsBody.bind(this))}
                </tbody>
            </Table>
        )
    }

    return <><div className={'form-group row'}>
        <div className='col-xl-12 col-lg-12'>
            <div className='alert alert-secondary'>
                <div className=''>
                    <span>
                        <b>Time variables</b>: %timestamp%  <b>Device variables</b>: %device_group% %device_id%
                        %device_label% <b>Measurements variables</b>: %measurement_type% %measurement_value% <b>Threshold variables</b>: %threshold_name% %threshold_id% <b>Asset variables</b>: %asset_id% %asset_label% <b>Geofences variables</b>: %geofence_id% %geofence_label% %alert_status%
                    </span>
                </div>
            </div>
        </div>
        <div className='col-xl-4 col-lg-4'>
            <label>Contact Name</label>
            <Field
                component="input"
                className={`form-control form-control-lg form-control-solid  ${getInputClasses(
                    { errors, touched },
                    'smsName'
                )}`}
                name='smsName'
                placeholder='Enter the Contact Name'
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
                placeholder='351XXXXXXXXX'
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
                onClick={() => addSmsContact('smsAdded', { name: values.smsName, at: values.smsNumber }, setFieldValue)}
            >Add Contact Info</button>
        </div>
    </div>
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
                {tableGridSms()}
            </div>
        </div>
    </>
}