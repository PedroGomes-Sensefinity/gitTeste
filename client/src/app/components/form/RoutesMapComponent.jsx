import React, {useEffect} from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {Link} from 'react-router-dom';
import {makeStyles} from '@material-ui/styles';
import DoneIcon from '@material-ui/icons/Done';
import { BsTrash } from "react-icons/bs";
import '../../utils/yup-validations';
import BlockUi from "react-block-ui";
import toaster from '../../utils/toaster';
import { injectIntl } from 'react-intl';
import apiService from '../../services/apiService';
import routesService from "../../services/routesService";
import RouteMap from "../route-map/routeMap";

class RoutesMapComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            intl: props.intl,
            id: props.id,
            route: {},
            geofence: {},
            entity: {},
            loading: false,
            blocking: false,
            clearRoute: false,
        };
    }

    componentDidMount() {

    }

    initialValues = {
        id: parseInt(this.props.id)
    };

    validationSchema = Yup.object().shape({});

    useStyles = makeStyles((theme) => ({
        headerMarginTop: {
            marginTop: theme.spacing(5),
        }
    }));

    save = (fields, { setSubmitting }) => {
        let route = this.state.entity;
        route.metadata.route = this.state.route;
        route.metadata.geofence = this.state.geofence;
        route.metadata = JSON.stringify(route.metadata);

        this.setState({blocking: true});

        routesService.update(route)
            .then((response) => {
                toaster.notify('success', this.state.intl.formatMessage({id: 'ROUTES.UPDATED'}));

            }).catch((err) => {
                toaster.notify('error', err.data.detail);
            })
            .finally(() => {
                this.setState({blocking: false});
                setSubmitting(false);
            });
    };

    onChangeRoute = (route) => {
        this.setState({ route: route.route });
        this.setState({ geofence: route.geofence });
    };

    render() {
        return (
            <BlockUi tag='div' blocking={this.state.blocking}>
            <Formik
                enableReinitialize
                initialValues={this.initialValues}
                validationSchema={this.validationSchema}
                onSubmit={(values, { setStatus, setSubmitting, resetForm }) => {
                    this.save(values, {
                        setSubmitting
                    });
                }}
                >
                {({
                    isSubmitting,
                    handleSubmit
                }) => {
                    const classes = this.useStyles();

                    useEffect(() => {
                            apiService
                            .getById('route', this.state.id)
                            .then((response) => {
                                const entity = response.routes[0];
                                entity.metadata = JSON.parse(entity.metadata);
                                this.setState({entity: entity});

                                if("route" in entity.metadata) {
                                    this.setState({route: entity.metadata.route});
                                }

                                if("geofence" in entity.metadata) {
                                    this.setState({geofence: entity.metadata.geofence});
                                }
                            });
                    }, []);

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
                                    {typeof this.state.id !== "undefined" &&
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
                                        Cancel
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
                                                route={this.state.route}
                                                showGeofencing={true}
                                                onChangeRoute={this.onChangeRoute} />
                                        </div>
                                        <div className={`col-xl-3 col-lg-3`}>
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
}

export default injectIntl(RoutesMapComponent);