/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ModalProgressBar } from "../../../../_metronic/_partials/controls";
import * as auth from "../../../modules/Auth";
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { TabContainer } from "react-bootstrap";
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import AutocompleteComponent from "../../../components/form/autocomplete.component";
import apiService from "../../../services/apiService";
import {array, object, string} from "yup";
import {useDispatch} from "react-redux";
import {makeStyles} from "@material-ui/styles";
import connect from "react-redux/lib/connect/connect";

const useStyles = makeStyles((theme) => ({
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

export function DevicesForm(props) {
  // Fields
  const [loading, setloading] = useState(false);


  // Autocompletes
  const [device, setDevice]     = useState(false);
  const [groups, setGroups]     = useState(false);
  const [parents, setParents]   = useState(false);

  const dispatch = useDispatch();

  const [value, setValue] = React.useState(0);
  const [threshold, setThreshold] = React.useState([]);


  const classes = useStyles();

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  let { id } = useParams();
  function getData() {
    if (!device) {
      apiService.getById('device', id).then(function (response) {
        setDevice(response.devices[0]);
      });
    }
  }

  function getGroups() {
    if (!groups) {
      apiService.get('group', 100, 0 ).then(function (response) {
        setGroups(response.groups);
      });
    }
  }

  function getParents() {
    if (!parents) {
      let devices = [];
      apiService.get('device', 100, 0 ).then(function (response) {
        response.devices.map((device) => {
          devices.push({id: device.id, label: device.id})
        })
        setParents(devices);
      });
    }
  }



  function resolveRequests() {
    return Promise.all([ getData(), getGroups(), getParents() ]);
  }

  // Methods
  const saveDevice = (values, setStatus, setSubmitting) => {
    setloading(true);
    const updatedDevice = Object.assign(device, {
      username: values.username,
      email: values.email,
      language: values.language,
      timeZone: values.timeZone,
      communication: {
        email: values.communicationEmail,
        sms: values.communicationSMS,
        phone: values.communicationPhone,
      },
    });
    // device for update preparation
    dispatch(props.setDevice(updatedDevice));
    setTimeout(() => {
      setloading(false);
      setSubmitting(false);
      // Do request to your server for device update, we just imitate device update there, For example:
      // update(updatedDevice)
      //  .then(()) => {
      //    setloading(false);
      //  })
      //  .catch((error) => {
      //    setloading(false);
      //    setSubmitting(false);
      //    setStatus(error);
      // });
    }, 1000);
  };

  // UI Helpers
  const initialValues = {
    id: device.id,
    groups: device.group_id,
    parents: device.parent_id,
    boardFamilies: device.board_family_id,
    board: device.board,
    imei: device.imei,
    label: device.label,
    meta_data: device.meta_data,
    comments: device.comments,
  };

  const Schema = Yup.object().shape({
    id: Yup.string().required("Device ID is mandatory"),
    boardFamilies: Yup.string(),
    label: Yup.string(),
    parents: Yup.string(),
    groups: Yup.string(),
    board: Yup.string(),
    imei: Yup.string(),
    meta_data: Yup.string(),
    comments: Yup.string(),
  });

  const getInputClasses = (fieldname) => {
    if (formik.touched[fieldname] && formik.errors[fieldname]) {
      return "is-invalid";
    }

    if (formik.touched[fieldname] && !formik.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const formik = useFormik({
    initialValues,
    validationSchema: Schema,
    enableReinitialize: true,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      saveDevice(values, setStatus, setSubmitting);
    }
  });

  function onSubmit(fields, { setStatus, setSubmitting }) {
    saveDevice(fields, setStatus, setSubmitting);
  }

  const thresholds = [
    'Threshold 1',
    'Threshold 2',
    'Threshold 3',
  ];

  function handleThresholds(event) {
    setThreshold(event.target.value);
  }

  function getElementLabel(items) {
    if (items) {
      return items.find(element => element.id== device.containers[0].id).label
    }
    return "";
  }

  return (
    <div>
      <Paper square>
        <Tabs value={value} indicatorColor="primary" textColor="primary" onChange={handleChange}>
          <Tab label="Device Info"/>
          <Tab label="Configuration"/>
        </Tabs>
      </Paper>
      <TabContainer>
        {
          value === 0 && deviceForm()
        }
      </TabContainer>
      <TabContainer>
        {
          value === 1 && "Send Msg"
        }
      </TabContainer>
    </div>
  )

  function handleChange(event, newValue) {
    setValue(newValue);
  }

  function handleGroupsChange(event, newValue) {
    console.log(event);
    console.log(newValue);
  }
  
  function deviceForm() {
    return (
      <form className="card card-custom" onSubmit={formik.handleSubmit}>
        {loading && <ModalProgressBar/>}

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
                  formik.isSubmitting || (formik.touched && !formik.isValid)
                }
            >
              Save Changes
              {formik.isSubmitting}
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
                      className={`form-control form-control-lg form-control-solid ${getInputClasses(
                          "id"
                      )}`}
                      name="id"
                      value={device.id}
                      placeholder="Set the Device ID"
                      {...formik.getFieldProps("id")}
                  />
                  {formik.touched.id && formik.errors.id ? (
                      <div className="invalid-feedback">
                        {formik.errors.id}
                      </div>
                  ) : null}
                </div>
              </div>

              <div className="col-xl-6 col-lg-6">
                <label>Label</label>
                <input
                    type="text"
                    className={`form-control form-control-lg form-control-solid ${getInputClasses(
                        "label"
                    )}`}
                    name="label"
                    placeholder="Set the Device Label"
                    {...formik.getFieldProps("label")}
                />
                {formik.touched.label && formik.errors.label ? (
                    <div className="invalid-feedback">
                      {formik.errors.label}
                    </div>
                ) : null}
              </div>
            </div>


            {/* begin::Form Group */}
            <div className="form-group row">
              <div className="col-xl-6 col-lg-6">
                <label>Groups </label>
                <AutocompleteComponent
                    className={`form-control form-control-lg form-control-solid ${getInputClasses(
                        "groups"
                    )}`}
                    suggestions={groups}
                    placeholder={'Select a device group'}
                    // title={'Groups'}
                    name={'groups'}
                    initialSelectedItem={ '' }
                    onChange={handleGroupsChange}
                />
                {formik.touched.groups && formik.errors.groups ? (
                    <div className="invalid-feedback">
                      {formik.errors.groups}
                    </div>
                ) : null}
              </div>

              <div className="col-xl-6 col-lg-6">
                <label>Device parent</label>
                <AutocompleteComponent
                    className={`form-control form-control-lg form-control-solid ${getInputClasses(
                        "device_parent"
                    )}`}
                    suggestions={parents}
                    placeholder={'Select a parent device'}
                    // title={'Device parent'}
                    name={'parent'}
                    class={'form-control form-control-lg form-control-solid'}
                />
              </div>
            </div>


            {/* begin::Form Group */}
            <div className="form-group row">
              <div className="col-lg-3 col-xl-3">
                <label>Board Family</label>
                <select
                    className="form-control form-control-lg form-control-solid"
                    name="boardFamilies"
                    {...formik.getFieldProps("boardFamilies")}
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
                      className={`form-control form-control-lg form-control-solid ${getInputClasses(
                          "board_id"
                      )}`}
                      name="board_id"
                      placeholder="Set the Board ID"
                      {...formik.getFieldProps("board_id")}
                  />
                  {formik.touched.board_id && formik.errors.board_id ? (
                      <div className="invalid-feedback">
                        {formik.errors.board_id}
                      </div>
                  ) : null}
                </div>
              </div>
              <div className="col-xl-6 col-lg-6">
                <label>IMEI</label>
                <div>
                  <input
                      type="text"
                      className={`form-control form-control-lg form-control-solid ${getInputClasses(
                          "imei"
                      )}`}
                      name="imei"
                      placeholder="Set the Device IMEI"
                      {...formik.getFieldProps("imei")}
                  />
                  {formik.touched.imei && formik.errors.imei ? (
                      <div className="invalid-feedback">
                        {formik.errors.imei}
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
                    className={`form-control form-control-lg form-control-solid ${getInputClasses(
                        "meta_data"
                    )}`}
                    name="meta_data"
                    placeholder="Set the Metadata"
                    {...formik.getFieldProps("meta_data")}
                />
                  {formik.touched.meta_data && formik.errors.meta_data ? (
                      <div className="invalid-feedback">
                        {formik.errors.meta_data}
                      </div>
                  ) : null}
                </div>
              </div>

              <div className="col-xl-6 col-lg-6">
                <label>Comments</label>
                <div>
                <textarea
                    rows="7"
                    className={`form-control form-control-lg form-control-solid ${getInputClasses(
                        "comments"
                    )}`}
                    name="comments"
                    placeholder="Comments and Observations"
                    {...formik.getFieldProps("comments")}
                />
                  {formik.touched.comments && formik.errors.comments ? (
                      <div className="invalid-feedback">
                        {formik.errors.comments}
                      </div>
                  ) : null}
                </div>
              </div>
            </div>

            {/* begin::Separator Dashed */}
            <div className="separator separator-dashed my-5"></div>

            {/* begin::Form Group */}
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
          </div>
        </div>
        {/* end::Form */}
      </form>
    );
  }
}
export default connect(null, auth.actions)(DevicesForm);
