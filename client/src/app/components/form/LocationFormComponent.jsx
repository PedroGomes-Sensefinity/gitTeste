import DoneIcon from '@material-ui/icons/Done';
import { makeStyles } from '@material-ui/styles';
import { ErrorMessage, Field, Formik } from 'formik';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import BlockUi from "react-block-ui";
import { injectIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import apiServiceV2 from '../../services/v2/apiServiceV2';
import locationServiceV2 from '../../services/v2/locationServiceV2';
import { getInputClasses } from '../../utils/formik';
import toaster from '../../utils/toaster';
import '../../utils/yup-validations';
import Map from "../geo-fencing-map/map";
import TableGrid from '../table-grid/TableGrid';
const useStyles = makeStyles((theme) => ({
    headerMarginTop: {
        marginTop: theme.spacing(5),
    }
}));

function LocationFormComponent(props) {

    const id = props.id;
    const isAddMode = !id
    const classes = useStyles();
    const [blocking, setBlocking] = useState(false)
    const [geofences, setGeofences] = useState([])
    const { permissions } = useSelector(({ auth }) => ({ permissions: auth.permissions }))

    //const [initialValues, setInitialValues] = useState({ id: '', name: '', tenantsOptions: tenantsOptions })
    const [tenantsOptions, setTenantOptions] = useState([])

    const [location, setLocation] = useState({
        id: '',
        name: ''
    })

    const initialTenantID = location.tenant === undefined ? 0 : location.tenant.id

    const initialValues = {
        id: location.id || '',
        name: location.name || '',
        tenant_id: initialTenantID,
        tenantsOptions: tenantsOptions,
        geofences: geofences,
        tenant_id: initialTenantID
    }

    useEffect(() => {
        apiServiceV2.get("v2/tenants/children").then(response => {
            const respTenants = response.tenants_new || [];

            setTenantOptions(respTenants.map(tenant => {
                return { id: tenant.id, name: tenant.name };
            }));
        });

        //Edit Case
        if (typeof id !== 'undefined' && id !== 0) {
            //Get Geofence Data
            apiServiceV2.get("v2/locations/" + id).then((response) => {
                setLocation(response.location)
                const geofencesArr = []
                if (response.location.geofence !== undefined && response.location.geofence !== "{}") {
                    geofencesArr.push(JSON.parse(response.location.geofence))
                    setGeofences(geofencesArr)
                }
            });
        }
    }, []);

    const getGeofenceIndexById = useCallback((id) => {
        for (let i = 0; i < geofences.length; i++) {
            if (geofences[i].id === id) {
                return i;
            }
        }
        return -1;
    }, [geofences])

    const onChangeShape = (setFieldValue) => ((shapes) => {
        setFieldValue('geofences', shapes)
    })


    const columnsGeofences = [
        {
            field: 'name',
            title: 'Shape'
        }
    ];


    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
    });

    const save = (fields, { setFieldValue, setSubmitting }) => {
        if (fields.geofences.length === 0) {
            toaster.notify('error', "Location needs 1 Shape!");
            setBlocking(false);
            setSubmitting(false);
            return
        }
        if (fields.geofences.length > 1) {
            toaster.notify('error', "Location must only have 1 Shape!");
            setBlocking(false);
            setSubmitting(false);
            return
        }
        setBlocking(true);
        setSubmitting(true);
        const endpoint = isAddMode ? "create" : "update"
        fields["geofence"] = JSON.stringify(fields.geofences[0])
        if (fields["id"] === "") {
            fields["id"] = 0
        } else {
            fields["id"] = parseInt(fields["id"])
        }

        console.log(fields)
        locationServiceV2[endpoint](fields)
            .then((_response) => {
                toaster.notify('success', "Success Locations!");
                setSubmitting(false);
                setBlocking(false);

                if (isAddMode) {
                    setFieldValue('name', '', false);
                    setFieldValue('id', '', false);
                    setGeofences([])
                }
                setBlocking(false);
                setSubmitting(false);
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
                    setFieldValue,
                    values
                }) => {
                    return <form
                        className='card card-custom'
                        onSubmit={handleSubmit}>
                        {/* begin::Header */}
                        <div
                            className={`card-header py-3 ` + classes.headerMarginTop}>
                            <div className='card-title align-items-start flex-column'>
                                <h3 className='card-label font-weight-bolder text-dark'>
                                    Location
                                </h3>
                                <span className='text-muted font-weight-bold font-size-sm mt-1'>
                                    Create or Edit Locations
                                </span>
                                <span className='text-muted font-weight-bold font-size-sm mt-1'>
                                    <label className="required">&nbsp;</label> All fields marked with asterisks are required
                                </span>
                            </div>
                            <div className='card-toolbar'>
                                {permissions.canEditLocations && <button
                                    type='submit'
                                    className='btn btn-success mr-2'
                                    disabled={
                                        isSubmitting ||
                                        (touched && !isValid)
                                    }>
                                    <DoneIcon />
                                    Save Changes
                                    {isSubmitting}
                                </button>}
                                <Link
                                    to='/locations/list'
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
                                        <label className={`required`}>Name</label>
                                        <Field
                                            as="input"
                                            disabled={!permissions.canEditLocations}
                                            className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                { errors, touched },
                                                'name'
                                            )}`}
                                            name='name'
                                            placeholder='Set the Location Name'
                                            {...getFieldProps('name')}
                                        />
                                        <ErrorMessage name="name" component="div" className="invalid-feedback" />
                                    </div>

                                    <div className='col-xl-6 col-lg-6'>
                                        <label className={`required`}>Tenant</label>
                                        <Field
                                            disabled={!isAddMode}
                                            type={"number"}
                                            as="select"
                                            className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                { errors, touched },
                                                "tenant_id"
                                            )}`}
                                            name="tenant_id"
                                            placeholder=""
                                            {...getFieldProps("tenant_id")}
                                            onChange={e => {
                                                setFieldValue("tenant_id", Number.parseInt(e.target.value));
                                            }}
                                        >
                                            {isAddMode && <option key="" value=""></option>}
                                            {values.tenantsOptions.map(e => {
                                                return (
                                                    <option key={e.id} value={e.id}>
                                                        {e.name}
                                                    </option>
                                                );
                                            })}
                                        </Field>
                                        <ErrorMessage name="tenant_id" component="div" className="invalid-feedback" />
                                    </div>
                                </div>

                            </div>
                        </div>
                        {/* end::Form */}
                        {/* begin::Form */}
                        <div className='form'>
                            <div className='card-body'>
                                <div className="form-group row">
                                    {/*begin:: Map */}
                                    <div className={`col-xl-6 col-lg-6`}>
                                        <Map zoom={6} shapes={geofences} onChangeShape={onChangeShape(setFieldValue)} />
                                    </div>
                                    <div className={`col-xl-6 col-lg-6  `}>
                                        <TableGrid
                                            title=''
                                            columns={columnsGeofences}
                                            data={values.geofences}
                                            style={{ height: 500 }}
                                            editable={{
                                                onRowUpdate: (newData, oldData) =>
                                                    new Promise((resolve, _reject) => {
                                                        setTimeout(() => {
                                                            const dataUpdate = [...values.geofences];
                                                            const index = getGeofenceIndexById(oldData.tableData.id);
                                                            dataUpdate[index] = newData;
                                                            onChangeShape(setFieldValue)(dataUpdate);
                                                            resolve();
                                                        }, 1000)
                                                    })
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* end::Form */}
                    </form>
                }
                }
            </Formik>
        </BlockUi>
    );
}

export default injectIntl(LocationFormComponent);
