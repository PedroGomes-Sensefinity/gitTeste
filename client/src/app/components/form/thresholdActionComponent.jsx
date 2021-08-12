import React, {useEffect} from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {makeStyles} from '@material-ui/styles';
import thresholdService from '../../services/thresholdService';
import deviceThresholdService from '../../services/deviceThresholdService';
import apiService from '../../services/apiService';
import {AsyncTypeahead} from 'react-bootstrap-typeahead';
import DoneIcon from '@material-ui/icons/Done';
import '../../utils/yup-validations';
import BlockUi from "react-block-ui";
import {injectIntl} from 'react-intl';
import toaster from '../../utils/toaster';

class ThresholdActionComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            intl: props.intl,
            id: props.id,
            threshold: {},
            options: [],
            selected: [],
            selectedIds: [],
            loading: false,
            blocking: false,
        };
    }

    componentDidMount() {}

    initialValues = {
        action: '',
    };

    validationSchema = Yup.object().shape({});

    useStyles = makeStyles((theme) => ({
        headerMarginTop: {
            marginTop: theme.spacing(5),
        }
    }));

    handleSearch = (query) => {
        this.setState({loading: true});

        apiService.getByText('notificationstemplate', query, 100, 0).then((response) => {
            console.log(response);
            const data = (typeof response.notifications_templates !== undefined && Array.isArray(response.notifications_templates))
                ? this.filterOptionsBySelected(response.notifications_templates)
                : [];

            this.setState({ options: data });
            this.setState({ loading: false });
        });
    };

    filterOptionsBySelected = (opt) => {
        return opt.filter(o => {
            return !this.state.selectedIds.includes(o.id);
        });
    }

    onChange = (opt) => {
        const selectedIds = opt.map((t) => t.id);
        console.log(selectedIds, opt);
        this.setState({selected: opt});
        this.setState({selectedIds: selectedIds});
    };

    save = () => {
        this.setState({blocking: true});

        let threshold = this.state.threshold;
        let rule = JSON.parse(threshold.rule);

        rule['what'] = [];

        this.state.selected.map(s => {
            rule.what.push({
                id: s.id,
                type: s.type,
                label: s.label,
            });
        });

        threshold.rule = JSON.stringify(rule);
        
        thresholdService.update(threshold)
            .then(() => {
                toaster.notify('success', this.state.intl.formatMessage({id: 'THRESHOLD.ACTION_SAVED'}));
                this.setState({blocking: false});
            });
    };

    filterBy = () => true;

    render() {
        return (
            <BlockUi tag='div' blocking={this.state.blocking}>
            <Formik
                enableReinitialize
                initialValues={this.initialValues}
                validationSchema={this.validationSchema}
                onSubmit={(values, { setStatus, setSubmitting, resetForm }) => {
                    this.save();
                }}
                >
                {({
                    isValid,
                    getFieldProps,
                    errors,
                    touched,
                    isSubmitting,
                    setFieldValue,
                    handleSubmit,
                    values
                }) => {
                    const classes = this.useStyles();

                    useEffect(() => {
                        if (!this.state.isAddMode && this.state.id !== 'new') {
                            apiService
                            .getById('threshold', this.state.id)
                            .then((response) => {
                                const threshold = response.thresholds[0];
                                const rule = JSON.parse(threshold.rule);
                                this.setState({threshold: threshold});

                                if(typeof rule.what !== "undefined" && Array.isArray(rule.what)) {
                                    const actionsId = rule.what.map(function (r) { return r.id });
                                    this.setState({selected: rule.what});
                                    this.setState({selectedIds: actionsId});
                                }
                            });
                        }
                    }, []);

                    return (
                        <form
                            className='card card-custom'
                            onSubmit={handleSubmit}>
                            {/* begin::Header */}
                            <div
                                className={`card-header py-3 `+ classes.headerMarginTop}>
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
                                                onChange={this.onChange}
                                                options={this.state.options}
                                                clearButton={true}
                                                placeholder=''
                                                selected={this.state.selected}
                                                onSearch={this.handleSearch}
                                                isLoading={this.state.loading}
                                                filterBy={this.filterBy}
                                                useCache={false}
                                            />
                                            </div>
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

export default injectIntl(ThresholdActionComponent);