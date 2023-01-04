import DoneIcon from "@material-ui/icons/Done";
import { makeStyles } from "@material-ui/styles";
import { ErrorMessage, Formik } from 'formik';
import React, { useEffect, useState } from "react";
import BlockUi from "react-block-ui";
import { injectIntl } from "react-intl";
import { Link, useOutletContext } from "react-router-dom";
import * as Yup from "yup";
import apiService from "../../services/apiService";
import tenantsService from "../../services/tenantsService";
import { getInputClasses } from "../../utils/formik";
import toaster from "../../utils/toaster";
import { ColorPickerComponent } from "./ColorPickerComponent";
import { UploadComponent } from "./UploadComponent";

const FILE_SIZE = 20 * 1024; // 2 MB
const SUPPORTED_FORMATS = [
    "image/jpg",
    "image/jpeg",
    "image/gif",
    "image/svg",
    "image/png"
];

const useStyles = makeStyles((theme) => ({
    headerMarginTop: {
        marginTop: theme.spacing(5),
        centerimage: {}
    }
}));

function TenantsPersonalizationComponent(props) {
    const intl = props.intl
    const { tenantId } = useOutletContext()
    const isAddMode = !tenantId || tenantId === 'new'
    const [blocking, setBlocking] = useState(false)
    const [logoUrl, setLogoUrl] = useState('')
    const [color, setColor] = useState({})

    const classes = useStyles();
    useEffect(() => {
        if (!isAddMode) {
            apiService
                .getById('tenant_new', tenantId)
                .then((response) => {
                    const tenantResp = response.tenants_new || []
                    if (tenantResp.length === 1) {
                        let color = "";
                        if (typeof tenantResp[0].color !== "undefined") {
                            color = { hex: response.tenants_new[0].color };
                        }

                        // setFieldValue('color', color);
                        setColor(color)

                        const attachment = tenantResp[0].attachment;
                        if (attachment !== undefined) {
                            setLogoUrl(`${attachment.url}`)
                        }
                    }
                });
        }
    }, []);

    const initialValues = {
        id: props.id,
        color: '',
        files: [],
        file: File
    };

    const validationSchema = Yup.object().shape({
        color: Yup.string().required('A color is required'),
        file: Yup.mixed().required("A file is required")
            .test(
                "fileSize",
                "File too large",
                value => value && value.size <= FILE_SIZE
            )
            .test(
                "fileFormat",
                "Unsupported Format",
                value => value && SUPPORTED_FORMATS.includes(value.type)
            ),
    });

    const upload = (fields, { setSubmitting }) => {
        setBlocking(true)
        setSubmitting(true);

        let data = new FormData();

        if (typeof fields.files[0] === "undefined") {
            tenantsService.tenantAttachment({
                id: parseInt(fields.id),
                attachment: {
                    id: 0
                },
                color: fields.color
            }).then((res) => {
                toaster.notify('success', msgSuccess);
                setBlocking(false)
            });

            setBlocking(false)
            setSubmitting(false);
            return
        }

        data.append('file', fields.files[0])

        let msgSuccess = intl.formatMessage({ id: 'TENANT.UPLOAD' })
        tenantsService.upload(data)
            .then((response) => {
                setLogoUrl(response.detail)
                tenantsService.tenantAttachment({
                    id: parseInt(fields.id),
                    attachment: {
                        id: parseInt(response.id)
                    },
                    color: fields.color
                }).then((_res) => {
                    toaster.notify('success', msgSuccess);
                    setBlocking(false);
                });
            });

        setBlocking(false)
        setSubmitting(false);
    }

    return (
        <BlockUi tag='div' blocking={blocking}>
            <Formik
                enableReinitialize
                initialValues={initialValues}
                onSubmit={(values, { setSubmitting }) => {
                    upload(values, {
                        setSubmitting,
                    });
                }}
            >
                {({
                    isValid,
                    errors,
                    touched,
                    isSubmitting,
                    setFieldValue,
                    handleSubmit
                }) => {
                    return (
                        <form
                            className='card card-custom'
                            onSubmit={handleSubmit}>
                            {/* begin::Header */}
                            <div
                                className={`card-header py-3 ` + classes.headerMarginTop}>
                                <div className='card-title align-items-start flex-column'>
                                    <h3 className='card-label font-weight-bolder text-dark'>
                                        Tenant Personalization
                                    </h3>
                                    <span className='text-muted font-weight-bold font-size-sm mt-1'>
                                        Change the logo and primary color of your Sensefinity platform
                                    </span>
                                </div>
                                <div className='card-toolbar'>
                                    <button
                                        type='submit'
                                        className='btn btn-success mr-2'
                                        disabled={
                                            isSubmitting ||
                                            (touched && !isValid)
                                        }>
                                        <DoneIcon />
                                        Save Changes
                                        {isSubmitting}
                                    </button>
                                    <Link
                                        to='/tenants/list'
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
                                            <label>Select your logo</label>
                                            <UploadComponent className={`${getInputClasses(
                                                { errors, touched },
                                                'file'
                                            )}`}
                                                setFieldValue={setFieldValue}
                                            />
                                            <p>Upload an image of max 200x100px so that it displays correctly. The image will be showed after new login.</p>
                                            <ErrorMessage name="file" component="div"
                                                className="invalid-feedback" />
                                        </div>
                                        <div className='col-xl-4 col-lg-4'>
                                            {logoUrl !== '' &&
                                                <div className={'text-center'}>
                                                    <img
                                                        src={logoUrl}
                                                        title={'Logo'}
                                                        alt={'Logo'}
                                                        width={'200px'}
                                                    />
                                                </div>
                                            } &nbsp;
                                        </div>
                                        <div className='col-xl-4 col-lg-4'>
                                            <div>
                                                <label>Color picker</label>
                                                <ColorPickerComponent
                                                    label={color}
                                                    className={`${getInputClasses(
                                                        { errors, touched },
                                                        'color'
                                                    )}`}
                                                    onChange={color => {
                                                        setFieldValue('color', color)
                                                    }}
                                                />
                                                <ErrorMessage name="color" component="div"
                                                    className="invalid-feedback" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    );
                }}
            </Formik>
        </BlockUi>
    );
}

export default injectIntl(TenantsPersonalizationComponent);