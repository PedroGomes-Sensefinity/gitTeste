import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DoneIcon from '@material-ui/icons/Done';
import BlockUi from 'react-block-ui';
import { getInputClasses } from '../../../utils/formik';
import deviceService from '../../../services/deviceService';

export function DevicesProvision() {
    const [blocking, setBlocking] = useState(false);
    const [devices, setDevices] = useState(false);

    const Schema = Yup.object().shape({
        count: Yup.number()
            .required('Quantity is required')
            .min(1, 'Minimum value is 1')
            .max(10000, 'Maximum value is 10000'),
    });

    const initialValues = {
        count: '',
    };

    const formik = useFormik({
        initialValues,
        validationSchema: Schema,
        onSubmit: (values, { setStatus, setSubmitting, resetForm }) => {
            saveProvision(values, setStatus, setSubmitting, resetForm);
        }
    });

    const saveProvision = (form, setStatus, setSubmitting, resetForm) => {
        setBlocking(true);

        deviceService.provision(form.count)
            .then(r => {
                var builtDevices = '';
                r.devices.forEach(value => {
                    builtDevices = builtDevices + value.containers[0].label + ",,," + value.label + "," + value.id + "," + value.parent_id + ",,{}\n";    
                });
                
                setDevices(builtDevices);
                setBlocking(false);
                setSubmitting(false)
                resetForm(true);
            });
    };

    return (
        <BlockUi tag='div' blocking={blocking}>
            <form className='card card-custom' onSubmit={formik.handleSubmit}>
                <div className={`card-header py-3 `}>
                    <div className='card-title align-items-start flex-column'>
                        <h3 className='card-label font-weight-bolder text-dark'>
                            Device Provision
                        </h3>
                        <span className='text-muted font-weight-bold font-size-sm mt-1'></span>
                    </div>
                    <div className='card-toolbar'>
                        <button
                            type='submit'
                            className='btn btn-success mr-2'
                            disabled={
                                formik.isSubmitting ||
                                (formik.touched && !formik.isValid)
                            }>
                            <DoneIcon />
                            Save
                            {formik.isSubmitting}
                        </button>
                    </div>
                </div>

                <div className='form'>
                    <div className='card-body'>
                        <div className='form-group row'>
                            <div className='col-xl-2 col-lg-2'>
                                <label>Quantity</label>
                                <div>
                                    <input
                                        type='number'
                                        className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                            formik,
                                            'count'
                                        )}`}
                                        name='count'
                                        {...formik.getFieldProps('count')}
                                    />
                                    {formik.touched.count &&
                                    formik.errors.count ? (
                                        <div className='invalid-feedback'>
                                            {formik.errors.count}
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                        <div className='form-group row' style={{ display: devices ? 'block' : 'none' }}>
                            <div className="col-xl-10 col-lg-10">
                                <label>Devices provisioned</label>
                                <textarea
                                    rows="5"
                                    name="comments"
                                    className={`form-control form-control-lg form-control-solid`}
                                    value={devices}
                                    onChange={(event) => devices}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </BlockUi>
    );
}
