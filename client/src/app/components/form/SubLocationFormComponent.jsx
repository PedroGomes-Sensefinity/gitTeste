import DoneIcon from '@material-ui/icons/Done';
import { makeStyles } from '@material-ui/styles';
import { ErrorMessage, Field, Formik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import BlockUi from "react-block-ui";
import { injectIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import sublocationService from "../../services/sublocationservice";
import apiServiceV2 from '../../services/v2/apiServiceV2';
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

function SubLocationFormComponent(props) {

    const id = props.id;
    const isAddMode = !id
    const classes = useStyles();
    const history = useHistory()
    const { permissions } = useSelector(({ auth }) => ({ permissions: auth.permissions }))
    const [blocking, setBlocking] = useState(false)

    const [subLocationInfo, setSubLocationInfo] = useState({})

    const initialTenantID = subLocationInfo.tenant === undefined ? '0' : subLocationInfo.tenant.id
    const [tenantsOptions, setTenantOptions] = useState([])

    const initialLocationId = subLocationInfo.location === undefined ? '0' : subLocationInfo.location.id

    const [geofences, setGeofences] = useState([])
    const [locationsOptions, setLocationsOptions] = useState([
        { id: 0, name: "No Location" },
    ])

    const initialValues = {
        id: subLocationInfo.id || '',
        name: subLocationInfo.name || '',
        port_code: subLocationInfo.port_code || '',
        geofences: geofences,
        tenant_id: initialTenantID,
        tenantsOptions: tenantsOptions,
        location_id: initialLocationId,
        locationsOptions: locationsOptions
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
            apiServiceV2.get(`v2/sublocations/${id}`).then((response) => {
                const respSubLocation = response.sublocation
                if (respSubLocation === undefined) {
                    history.push('/not-found')
                }
                setSubLocationInfo(respSubLocation)
                const geofencesArr = []
                if (respSubLocation.geofence !== undefined && respSubLocation.geofence !== "{}") {
                    geofencesArr.push(JSON.parse(response.sublocation.geofence))
                    setGeofences(geofencesArr)
                }
                apiServiceV2.get(`v2/locations?limit=50&tenant_id=${respSubLocation.tenant.id}`)
                    .then(response => {
                        //Get Locations Available
                        const respLocations = response.locations || []
                        const options = respLocations.map((location) => {
                            return { id: location.id, name: location.name }
                        })
                        setLocationsOptions(options)
                        
                    })
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

    const onChangeShape = (setFieldValue) => ((shapes) => setGeofences(shapes))

    const columnsGeofences = [
        {
            field: 'name',
            title: 'Shape'
        }
    ];

    const refetchLocations = (tenantId, setFieldValue) => {
        setFieldValue('location_id', 0)
        if (tenantId !== 0) {
            apiServiceV2.get(`v2/locations?limit=50&tenant_id=${tenantId}`).then((response) => {
                const respLocations = response.locations || []
                const options = respLocations.map((location) => {
                    return { id: location.id, name: location.name }
                })
                setFieldValue('locationsOptions', options)
            });
        } else {
            setFieldValue('locationsOptions', [])
        }
    }


    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        location_id: Yup.number().moreThan(0, 'Location is required').required('Location is required'),
        tenant_id: Yup.number().moreThan(0, 'Tenant is required').required('Tenant is required')
    });

    const save = (fields, { setFieldValue, setSubmitting }) => {
        if (fields.geofences.length === 0) {
            toaster.notify('error', "SubLocation needs 1 Shape!");
            setBlocking(false);
            setSubmitting(false);
            return
        }
        if (fields.geofences.length > 1) {
            toaster.notify('error', "SubLocation must only have 1 Shape!");
            setBlocking(false);
            setSubmitting(false);
            return
        }
        setBlocking(true);
        setSubmitting(true);
        const endpoint = isAddMode ? "save" : "update"


        fields["geofence"] = JSON.stringify(fields.geofences[0])
        if (fields["id"] === "") {
            fields["id"] = 0
        } else {
            fields["id"] = parseInt(fields["id"])
        }
        fields["location_id"] = parseInt(fields["location_id"])

        const toSubmit = {
            id: fields.id,
            name: fields.name,
            port_code: fields.port_code,
            tenant_id: fields.tenant_id,
            location_id: fields.location_id,
            geofence: JSON.stringify(fields.geofences[0])
        }

        sublocationService[endpoint](id, toSubmit)
            .then((_response) => {
                toaster.notify('success', "Success SubLocations!");
                setSubmitting(false);
                setBlocking(false);

                if (isAddMode) {
                    setFieldValue('location_id', 1, false);
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
                    setFieldValue,
                    errors,
                    touched,
                    isSubmitting,
                    handleSubmit,
                    setFieldTouched,
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
                                    SubLocation
                                </h3>
                                <span className='text-muted font-weight-bold font-size-sm mt-1'>
                                    Create or Edit SubLocations
                                </span>
                                <span className='text-muted font-weight-bold font-size-sm mt-1'>
                                    <label className="required">&nbsp;</label> All fields marked with asterisks are required
                                </span>
                            </div>
                            <div className='card-toolbar'>
                                {permissions.canEditSubLocations && <button
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
                                    to='/sublocations/list'
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
                                            disabled={!permissions.canEditSubLocations}
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
                                        <label>Port Code</label>
                                        <Field
                                            as="input"
                                            disabled={!permissions.canEditSubLocations}
                                            className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                { errors, touched },
                                                'port_code'
                                            )}`}
                                            name='port_code'
                                            placeholder='Set the Port Code'
                                            {...getFieldProps('port_code')}
                                        />
                                        <ErrorMessage name="name" component="div" className="invalid-feedback" />
                                    </div>
                                </div>

                                <div className='form-group row'>
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
                                            placeholder='Tenant'
                                            {...getFieldProps("tenant_id")}
                                            onChange={e => {
                                                const newTenantId = Number.parseInt(e.target.value)
                                                setFieldValue("tenant_id", newTenantId);
                                                refetchLocations(newTenantId, setFieldValue)
                                                setFieldTouched('tenant_id', true)
                                            }}
                                        >
                                            {<option key="0" value="0">No Tenant</option>}
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
                                    <div className='col-xl-6 col-lg-6'>
                                        <label className={`required`}>Location</label>
                                        <Field
                                            type={"number"}
                                            disabled={!permissions.canEditSubLocations}
                                            as="select"
                                            className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                { errors, touched },
                                                'location_id'
                                            )}`}
                                            name='location_id'
                                            placeholder='Parent Location'
                                            {...getFieldProps('location_id')}
                                            onChange={e => {
                                                setFieldValue('location_id', Number.parseInt(e.target.value));
                                                setFieldTouched('location_id', true)
                                            }}
                                        >
                                            <option key={0} value={0}>No Location</option>
                                            {values.locationsOptions.map((e) => {
                                                return (<option key={e.id} value={e.id}>{e.name}</option>);
                                            })}
                                        </Field>
                                        <ErrorMessage
                                            name='location_id'
                                            component='div'
                                            className='invalid-feedback'
                                        />
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
                                        <Map zoom={5} shapes={values.geofences} onChangeShape={onChangeShape(setFieldValue)} />
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
                                                            const dataUpdate = [...geofences];
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

export default injectIntl(SubLocationFormComponent);
