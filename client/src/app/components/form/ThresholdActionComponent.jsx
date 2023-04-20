import DoneIcon from '@material-ui/icons/Done';
import { makeStyles } from '@material-ui/styles';
import { Formik } from 'formik';
import React, { useCallback, useState } from 'react';
import BlockUi from "react-block-ui";
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { injectIntl } from 'react-intl';
import * as Yup from 'yup';
import apiService from '../../services/apiService';
import thresholdService from '../../services/thresholdService';
import apiServiceV2 from '../../services/v2/apiServiceV2';
import thresholdServiceV2 from '../../services/v2/thresholdServiceV2';
import toaster from '../../utils/toaster';
import '../../utils/yup-validations';

const useStyles = makeStyles((theme) => ({
    headerMarginTop: {
        marginTop: theme.spacing(5),
    }
}));

function ThresholdActionComponent(props) {

    const threshold = props.threshold
    const onThresholdChange = props.onChange
    const [options, setOptions] = useState([]);
    const [selectedIds, setSelectedIds] = useState(threshold.rule.what.map(r => r.id) || []);
    const [selected, setSelected] = useState(threshold.rule.what);
    const [loading, setLoading] = useState(false);
    const [blocking, setBlocking] = useState(false);
    const initialValues = {
        action: '',
    };
    const classes = useStyles()
    const handleSearch = (query) => {
        setLoading(true)
        apiServiceV2.getByLimitOffsetSearchTenant("v2/notification-templates",50, 0, query,threshold.tenant.id).then((response) => {
            const data = (typeof response.notification_templates !== undefined && Array.isArray(response.notification_templates))
                ? filterOptionsBySelected(response.notification_templates)
                : [];
            setOptions(data)
            setLoading(false)
        }).catch(err => {
            setOptions([])
            setLoading(false)
        });
    };

    const validationSchema = Yup.object().shape({});

    const filterOptionsBySelected = (opt) => {
        return opt.filter(o => {
            return !selectedIds.includes(o.id);
        });
    }

    const onChange = (opt) => {
        const tmpSelectedIds = opt.map((t) => t.id);
        setSelected(opt);
        setSelectedIds(tmpSelectedIds);
    };

    const save = useCallback(() => {
        setBlocking(true)
        // this ugly mess of a code is brought to you by Javascript :D (and its inability to copy objects by value)
        const tempThreshold = JSON.parse(JSON.stringify(threshold))

        let rule = tempThreshold.rule
        rule['what'] = selected.slice().map(s => {
            return {
                id: s.id,
                type: s.type,
                label: s.label,
            }
        })
        
        tempThreshold.rule = JSON.stringify(rule);
        thresholdServiceV2.update(tempThreshold)
            .then(() => {
                toaster.notify('success', props.intl.formatMessage({ id: 'THRESHOLD.ACTION_SAVED' }));
                tempThreshold.rule = rule
                onThresholdChange(tempThreshold)
                setBlocking(false)
            });
    }, [selected]);

    const filterBy = () => true;

    return <BlockUi tag='div' blocking={blocking}>
        <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={() => {
                save();
            }}
        >
            {({
                isSubmitting,
                handleSubmit,
            }) => <form
                className='card card-custom'
                onSubmit={handleSubmit}>
                    {/* begin::Header */}
                    <div
                        className={`card-header py-3 ` + classes.headerMarginTop}>
                        <div className='card-title align-items-start flex-column'>
                            <h3 className='card-label font-weight-bolder text-dark'>
                                Threshold actions
                            </h3>
                            <span className='text-muted font-weight-bold font-size-sm mt-1'>
                                Change actions of your threshold
                            </span>
                        </div>
                        <div className='card-toolbar'>
                            <button
                                type='submit'
                                className='btn btn-success mr-2'
                                disabled={isSubmitting}>
                                <DoneIcon />
                                Save
                            </button>
                        </div>
                    </div>
                    {/* end::Header */}

                    {/* begin::Form */}
                    <div className='form'>
                        <div className='card-body'>
                            <div className='form-group row'>
                                <div className='col-xl-6 col-lg-6'>
                                    <label>Actions</label>
                                    <div>
                                        <AsyncTypeahead
                                            id='typeahead-threshold-actions'
                                            labelKey='label'
                                            size="lg"
                                            multiple
                                            onChange={onChange}
                                            options={options}
                                            clearButton={true}
                                            placeholder=''
                                            selected={selected}
                                            onSearch={handleSearch}
                                            isLoading={loading}
                                            filterBy={filterBy}
                                            useCache={false}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* end::Form */}
                </form>
            }
        </Formik>
    </BlockUi>
}

export default injectIntl(ThresholdActionComponent);