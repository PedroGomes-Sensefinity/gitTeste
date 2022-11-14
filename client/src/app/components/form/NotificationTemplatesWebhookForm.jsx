import { Field } from 'formik';
import React from "react";

export default function NotificationTemplatesWebhookForm() {
    return <>
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
    </>
}