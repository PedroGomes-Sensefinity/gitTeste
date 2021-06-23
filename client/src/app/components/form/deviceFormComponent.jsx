import React, {useEffect, useState} from 'react';
import {Formik, useFormik} from "formik";
import apiService from "../../services/apiService";
import * as Yup from "yup";
import {ModalProgressBar} from "../../../_metronic/_partials/controls";
import {Link} from "react-router-dom";
import AutocompleteComponent from "./autocomplete.component";
import {makeStyles} from "@material-ui/styles";
import deviceService from "../../services/deviceService";

class DeviceFormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            groups: [],
            parents: [],
            selectedGroup: '',
            selectedGroupId: '',
            selectedParent: '',
            selectedParentId: '',
            isAddMode: true,
        }
    }

    componentDidMount() {
        this.props.groups.then((response) => {
            this.setState({groups: response.groups});
        });
        this.props.parents.then((response) => {
            this.setState({parents: this.getParents(response.devices)})
        });

        this.setState({isAddMode: !this.props.id});

    }

    initialValues = {
        id: '',
        groupId: '',
        parentId: '',
        boardFamilyId: '',
        board: '',
        imei: '',
        label: '',
        metadata: '',
        comments: '',
    };

    validationSchema = Yup.object().shape({
        id: Yup.string()
            .required('Device ID is required'),
    });

    useStyles = makeStyles((theme) => ({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
            maxWidth: 300,
        },
        chips: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        chip: {
            margin: 2,
            height: 50,
        },
        headerMarginTop: {
            marginTop: theme.spacing(5),
        },
        noLabel: {
            marginTop: theme.spacing(3),
        },
    }));


    getParents = (records) => {
        let devices = [];
        records.map((device) => {
            devices.push({id: device.id, label: device.id})
        })
        return devices;
    }

    handleGroupsChange = (event, newValue) => {
        console.log(event);
        console.log(newValue);
    }

    onSubmit = (fields,  { setStatus, setSubmitting, resetForm }) => {
        if (this.state.isAddMode) {
            console.log("Inserting")
            this.saveDevice(fields,{ setStatus, setSubmitting, resetForm });
        } else {
            console.log("Editing")
            // updateUser(id, fields, setSubmitting);
        }

    }

    saveDevice = (fields, { setStatus, setSubmitting, resetForm }) => {
        console.log(fields)
        const values = {
            id: fields.id,
            parent_id:fields.parentId,
            group_id:this.getSelectedGroup(fields.groups),
            board_family_id: fields.boardFamilyId,
            board:fields.board,
            imei:fields.imei,
            label:fields.label,
            meta_data:fields.metadata,
            comments: fields.comments
        }
        deviceService.saveDevice(values, this.state.isAddMode).then( function(response) {
            console.log(response)
        });
    };

    getSelectedGroup = (item) => {
        console.log(item)
        this.state.groups.filter(group => {
           console.log(group);
        });
    }

    setSelectedGroup = (groupId) => {
        this.state.selectedGroupId = groupId;
    }

    render() {
        const id = this.props.id
        const isAddMode = !id;

        return (
            <Formik
                initialValues={this.initialValues}
                validationSchema={this.validationSchema}
                onSubmit={ (values, { setStatus, setSubmitting, resetForm }) => {
                    this.saveDevice(values, {setStatus, setSubmitting, resetForm});
                }}
            >
            {
                ({
                     isValid,
                     getFieldProps,
                     errors,
                     touched,
                     isSubmitting,
                     setFieldValue,
                     handleSubmit
                }) => {
                    const classes   = this.useStyles();

                    let groups      = this.state.groups;
                    let parents     = this.state.parents;

                    let groupId     = 'a';

                    useEffect(() => {
                        if (!isAddMode) {
                            apiService.getById('device', id).then(response => {
                                if(response.devices[0]['containers'] !== undefined) {
                                    this.setState({selectedGroup: response.devices[0]['containers'][0]['label']});
                                    this.setState({selectedGroupId: response.devices[0]['containers'][0]['id']});
                                    groupId = response.devices[0]['containers'][0]['id'];
                                }

                                this.setState({selectedParent: '1234567890'});
                                this.setState({selectedParentId: '1234567890'});

                                setFieldValue('id',             (response.devices[0]['id']),                    false);
                                setFieldValue('groupId',        (groupId),                                      false);
                                setFieldValue('parentId',       (response.devices[0]['parent_id']),             false);
                                setFieldValue('boardFamilyId',  (response.devices[0]['board_family_id']),       false);
                                setFieldValue('board',          (response.devices[0]['board']),                 false);
                                setFieldValue('imei',           (response.devices[0]['imei']),                  false);
                                setFieldValue('label',          (response.devices[0]['label']),                 false);
                                setFieldValue('metadata',       (response.devices[0]['metadata']),              false);
                                setFieldValue('comments',       (response.devices[0]['comments']),              false);
                            });
                        }
                    }, []);


                    let selectedGroup  = this.state.selectedGroup;
                    let selectedGroupId  = this.state.selectedGroupId;
                    let selectedParent = this.state.selectedParent
                    let selectedParentId  = this.state.selectedParentId;

                    return (

                        <form className="card card-custom" onSubmit={handleSubmit}  >
                            {/* begin::Header */}
                            <div className={`card-header py-3 ` + classes.headerMarginTop}>
                                <div className="card-title align-items-start flex-column">
                                    <h3 className="card-label font-weight-bolder text-dark">
                                        Device Information
                                    </h3>
                                    <span className="text-muted font-weight-bold font-size-sm mt-1">
                                    Change general settings of your device
                                  </span>
                                </div>
                                <div className="card-toolbar">
                                    <button
                                        type="submit"
                                        className="btn btn-success mr-2"
                                        disabled={
                                            isSubmitting || (touched && !isValid)
                                        }
                                    >
                                        Save Changes
                                        {isSubmitting}
                                    </button>
                                    <Link
                                        to="/devices/list"
                                        className="btn btn-secondary"
                                    >
                                        Cancel
                                    </Link>
                                </div>
                            </div>
                            {/* end::Header */}

                            {/* begin::Form */}
                            <div className="form">
                                <div className="card-body">
                                    <div className="form-group row">
                                        <div className="col-xl-6 col-lg-6">
                                            <label>Device ID</label>
                                            <div>
                                                <input
                                                    type="text"
                                                    className={`form-control form-control-lg form-control-solid` + (errors.id && touched.id ? ' is-invalid' : '')}
                                                    name="id"
                                                    placeholder="Set the Device ID"
                                                    {...getFieldProps("id")}
                                                />
                                                {touched.id && errors.id ? (
                                                    <div className="invalid-feedback">
                                                        {errors.id}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>

                                        <div className="col-xl-6 col-lg-6">
                                            <label>Label</label>
                                            <input
                                                type="text"
                                                className={`form-control form-control-lg form-control-solid ` + (errors.label && touched.label ? ' is-invalid' : '')}
                                                name="label"
                                                placeholder="Set the Device Label"
                                                {...getFieldProps("label")}
                                            />
                                            {touched.label && errors.label ? (
                                                <div className="invalid-feedback">
                                                    {errors.label}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>


                                    {/* begin::Form Group */}
                                    <div className="form-group row">
                                        <div className="col-xl-6 col-lg-6">
                                            <label>Groups {selectedGroup}</label>
                                            <AutocompleteComponent
                                                className={ `form-control form-control-lg form-control-solid ` + (errors.label && touched.label ? ' is-invalid' : '') }
                                                suggestions={ groups }
                                                placeholder={ 'Select a device group' }
                                                initialSelectedItem={ selectedGroup.toString() }
                                                initialSelectedItemId={ selectedGroupId.toString() }
                                                name={ 'groups' }
                                                onChange={this.handleGroupsChange}
                                            />
                                            {touched.groups && errors.groups ? (
                                                <div className="invalid-feedback">
                                                    {errors.groups}
                                                </div>
                                            ) : null}
                                        </div>

                                        <div className="col-xl-6 col-lg-6">
                                            <label>Device parent</label>
                                            <AutocompleteComponent
                                                className={ `form-control form-control-lg form-control-solid ` + (errors.label && touched.label ? ' is-invalid' : '') }
                                                suggestions={ parents }
                                                placeholder={ 'Select a parent device' }
                                                initialSelectedItem={ selectedParent }
                                                initialSelectedItemId={ selectedParentId.toString() }
                                                name={ 'parent' }
                                            />
                                        </div>
                                    </div>


                                    {/* begin::Form Group */}
                                    <div className="form-group row">
                                        <div className="col-lg-3 col-xl-3">
                                            <label>Board Family</label>
                                            <select
                                                className={'form-control form-control-lg form-control-solid' + (errors.boardFamilies && touched.boardFamilies ? ' is-invalid' : 'is-valid')}
                                                name="boardFamilies"
                                                {...getFieldProps("boardFamilies")}
                                            >
                                                <option value="unknown">Unknown</option>
                                                <option value="evian">Evian</option>
                                                <option value="dandelion">Dandelion</option>
                                            </select>
                                        </div>

                                        <div className="col-lg-3 col-xl-3">
                                            <label>Board ID</label>
                                            <div>
                                                <input
                                                    type="text"
                                                    className={`form-control form-control-lg form-control-solid ` + (errors.board_id && touched.board_id ? ' is-invalid' : 'is-valid')}
                                                    name="board_id"
                                                    placeholder="Set the Board ID"
                                                    {...getFieldProps("board_id")}
                                                />
                                                {touched.board_id && errors.board_id ? (
                                                    <div className="invalid-feedback">
                                                        {errors.board_id}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="col-xl-6 col-lg-6">
                                            <label>IMEI</label>
                                            <div>
                                                <input
                                                    type="text"
                                                    className={`form-control form-control-lg form-control-solid ` + (errors.imei && touched.imei ? ' is-invalid' : 'is-valid')}
                                                    name="imei"
                                                    placeholder="Set the Device IMEI"
                                                    {...getFieldProps("imei")}
                                                />
                                                {touched.imei && errors.imei ? (
                                                    <div className="invalid-feedback">
                                                        {errors.imei}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>

                                    {/* begin::Form Group */}
                                    <div className="form-group row">
                                        <div className="col-xl-6 col-lg-6">
                                            <label>Metadata</label>
                                            <div>
                                                <textarea
                                                    rows="7"
                                                    className={`form-control form-control-lg form-control-solid ` + (errors.meta_data && touched.meta_data ? ' is-invalid' : '')}
                                                    name="meta_data"
                                                    placeholder="Set the Metadata"
                                                    {...getFieldProps("meta_data")}
                                                />
                                                {touched.meta_data && errors.meta_data ? (
                                                    <div className="invalid-feedback">
                                                        {errors.meta_data}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>

                                        <div className="col-xl-6 col-lg-6">
                                            <label>Comments</label>
                                            <div>
                                                <textarea
                                                    rows="7"
                                                    className={`form-control form-control-lg form-control-solid ` + (errors.comments && touched.comments ? ' is-invalid' : '')}
                                                    name="comments"
                                                    placeholder="Comments and Observations"
                                                    {...getFieldProps("comments")}
                                                />
                                                {touched.comments && errors.comments ? (
                                                    <div className="invalid-feedback">
                                                        {errors.comments}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>

                                    {/* begin::Separator Dashed */}
                                    <div className="separator separator-dashed my-5"></div>


                                    {/* begin::Form Group */}
                                    {/*
                                    <div className="row">
                                        <div className="col-lg-2 col-xl-2">
                                            <label>Device Thresholds:</label>
                                        </div>
                                        <div className="col-xl-10 col-lg-10">
                                            <Select
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                    "thresholds"
                                                )}`}
                                                multiple
                                                value={threshold}
                                                onChange={handleThresholds}
                                                input={<Input id="select-multiple-chip"/>}
                                                renderValue={selected => (
                                                    <div className={classes.chips}>
                                                        {selected.map(value => (
                                                            <Chip key={value} label={value} className={classes.chip}/>
                                                        ))}
                                                    </div>
                                                )}
                                                MenuProps={MenuProps}
                                            >
                                                {thresholds.map(name => (
                                                    <MenuItem key={name} value={name}>
                                                        {name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </div>
                                    </div>
                                    */}
                                </div>
                            </div>
                            {/* end::Form */}
                        </form>
                    )
                }
            }
            </Formik>
        )
    }
}

export default DeviceFormComponent;