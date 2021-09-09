import React, { useState } from 'react';
import DoneIcon from '@material-ui/icons/Done';
import BlockUi from 'react-block-ui';
import deviceService from '../../../services/deviceService';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { DropzoneArea } from 'material-ui-dropzone';
import toaster from '../../../utils/toaster';
import { useIntl } from "react-intl";

export function DevicesUpload(props) {
    const intl = useIntl();

    const [blocking, setBlocking] = useState(false);
    const [file, setFile] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [timestamp, setTimestamp] = useState(false);

    const useStyles = makeStyles((theme) =>
        createStyles({
            previewChip: {
                minWidth: 160,
                maxWidth: 210,
            },
        })
    );

    const classes = useStyles();

    const onChange = (files) => {
        setFile(files[0]);
    };

    const onSubmit = (event) => {
        event.preventDefault();

        if (typeof file === "undefined") {
            toaster.notify('error', intl.formatMessage({id: 'UPLOAD.FILE_EMPTY'}));
            return false;
        }

        setBlocking(true);
        setSubmitting(true);

        const formData = new FormData();
        formData.append('devices', file);

        deviceService.upload(formData).then((r) => {    
            toaster.notify('success', intl.formatMessage({id: 'UPLOAD.SUCCESS'}));
            setBlocking(false);
            setSubmitting(false);
            setTimestamp((new Date()).getTime())
        });
    };

    return (
        <BlockUi tag='div' blocking={blocking}>
            <form className='card card-custom' onSubmit={onSubmit}>
                <div className={`card-header py-3 `}>
                    <div className='card-title align-items-start flex-column'>
                        <h3 className='card-label font-weight-bolder text-dark'>
                            Device Upload
                        </h3>
                        <span className='text-muted font-weight-bold font-size-sm mt-1'></span>
                    </div>
                    <div className='card-toolbar'>
                        <button
                            type='submit'
                            className='btn btn-success mr-2'
                            disabled={submitting}>
                            <DoneIcon />
                            Upload
                        </button>
                    </div>
                </div>

                <div className='form'>
                    <div className='card-body'>
                        <div className='form-group row'>
                            <div className='col-xl-12 col-lg-12'>
                                <DropzoneArea
                                    key={timestamp}
                                    acceptedFiles={['.csv']}
                                    showPreviews={true}
                                    showPreviewsInDropzone={false}
                                    useChipsForPreview
                                    previewGridProps={{
                                        container: {
                                            spacing: 1,
                                            direction: 'row',
                                        },
                                    }}
                                    previewChipProps={{
                                        classes: { root: classes.previewChip },
                                    }}
                                    previewText='Selected file'
                                    filesLimit={1}
                                    showAlerts={false}
                                    onChange={(files) => onChange(files)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </BlockUi>
    );
}