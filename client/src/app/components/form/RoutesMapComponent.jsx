import DoneIcon from '@material-ui/icons/Done';
import { makeStyles } from '@material-ui/styles';
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import BlockUi from "react-block-ui";
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import apiService from '../../services/apiService';
import routesService from "../../services/routesService";
import toaster from '../../utils/toaster';
import '../../utils/utils';
import '../../utils/yup-validations';
import RouteMap from "../route-map/routeMap";
import TableGrid from "../table-grid/TableGrid";

const useStyles = makeStyles((theme) => ({
    headerMarginTop: {
        marginTop: theme.spacing(5),
    }
}));

function RoutesMapComponent(props) {
    const intl = props.intl
    const routeId = props.id
    const [route, setRoute] = useState({})
    const [entity, setEntity] = useState({})
    const [geofence, setGeofence] = useState({})
    const [geofenceSizes, setGeofenceSizes] = useState([])
    const [blocking, setBlocking] = useState(false)
    const [gridDataGeofencesSizes, setGridDataGeofencesSizes] = useState([])

    const classes = useStyles();

    useEffect(() => {
        apiService
            .getById('route', routeId)
            .then((response) => {
                const respRoute = response.routes || []

                if (respRoute.length > 0) {
                    console.log(respRoute)
                    const entity = respRoute[0];
                    entity.metadata = JSON.parse(entity.metadata);
                    setEntity(entity)

                    if ("route" in entity.metadata) {
                        setRoute(entity.metadata.route);
                    }

                    if ("geofence" in entity.metadata) {
                        setGeofence(entity.metadata.geofence)
                    }

                    if ("geofenceSizes" in entity.metadata) {
                        setGeofenceSizes(entity.metadata.geofenceSizes)
                    }
                }
            });
    }, []);

    const initialValues = {
        id: parseInt(props.id)
    };

    const validationSchema = Yup.object().shape({});

    const save = (setSubmitting) => {
        let newRoute = entity;
        newRoute.metadata.route = route;
        newRoute.metadata.geofence = geofence;
        newRoute.metadata.geofenceSizes = geofenceSizes;
        newRoute.metadata = JSON.stringify(newRoute.metadata);
        console.log(`on Save`)
        console.log(newRoute)

        setBlocking(true)
        routesService.update(newRoute)
            .then((_response) => {
                toaster.notify('success', intl.formatMessage({ id: 'ROUTES.UPDATED' }));

            }).catch((err) => {
                // toaster.notify('error', err.data);
            })
            .finally(() => {
                setBlocking(false)
                setSubmitting(false);
            });
    };

    const onChangeRoute = (route) => {
        console.log(route)
        setRoute(route.route)
        setGeofence(route.geofence)
        setGeofenceSizes(route.geofenceSizes)
    };

    useEffect(() => {
        let data = geofenceSizes.map((value, i) => {
            return {
                point: i + 1,
                size: value,
            };
        });
        setGridDataGeofencesSizes(data)
    }, [geofenceSizes])

    const onChangePointSize = (data, index) => {
        let newGridData = gridDataGeofencesSizes.map(i => i);
        newGridData[index] = data;
        let sizes = newGridData.map((item) => item.size);
        setGridDataGeofencesSizes(newGridData)
        setGeofenceSizes(sizes)
    }

    const columns = [
        {
            field: 'point',
            title: 'Point',
            editable: 'never'
        }, {
            field: 'size',
            title: 'Size (meters)',
        }
    ];

    return (
        <BlockUi tag='div' blocking={blocking}>
            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={({ setSubmitting }) => {
                    save(setSubmitting);
                }}
            >
                {({
                    isSubmitting,
                    handleSubmit
                }) => {
                    return (
                        <form
                            className='card card-custom'
                            onSubmit={handleSubmit}>
                            {/* begin::Header */}
                            <div
                                className={
                                    `card-header py-3 ` +
                                    classes.headerMarginTop
                                }>
                                <div className='card-title align-items-start flex-column'>
                                    <h3 className='card-label font-weight-bolder text-dark'>
                                        Route map
                                    </h3>
                                    {typeof id !== "undefined" &&
                                        <span className='text-muted font-weight-bold font-size-sm mt-1'>
                                            Draw route
                                        </span>
                                    }
                                </div>
                                <div className='card-toolbar'>
                                    <button
                                        type='submit'
                                        className='btn btn-success mr-2'
                                        disabled={isSubmitting}>
                                        <DoneIcon />
                                        Save Changes
                                        {isSubmitting}
                                    </button>
                                    <Link
                                        to='/routes/list'
                                        className='btn btn-secondary'>
                                        Back to list
                                    </Link>
                                </div>
                            </div>
                            {/* end::Header */}

                            {/* begin::Form */}
                            <div className='form'>
                                <div className='card-body'>
                                    <div className="form-group row">
                                        <div className={`col-xl-9 col-lg-9`}>
                                            <RouteMap
                                                route={route}
                                                geofenceSizes={geofenceSizes}
                                                showGeofencing={true}
                                                onChangeRoute={onChangeRoute} />
                                        </div>
                                        <div className={`col-xl-3 col-lg-3`}>
                                            <TableGrid
                                                title=''
                                                columns={columns}
                                                data={gridDataGeofencesSizes}
                                                style={{ height: 500 }}
                                                editable={{
                                                    onRowUpdate: (newData, oldData) =>
                                                        new Promise((resolve, reject) => {
                                                            //setTimeout(() => {
                                                            newData.size = parseFloat(newData.size);
                                                            const index = oldData.tableData.id;
                                                            onChangePointSize(newData, index);
                                                            resolve();
                                                            //}, 1000)
                                                        })
                                                }}
                                            />
                                        </div>
                                    </div>
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

export default injectIntl(RoutesMapComponent);