import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { LayoutSplashScreen } from "../../../../_metronic/layout";
import * as auth from "../_redux/authRedux";

function Logout(props) {
  const hasAuthToken = props.hasAuthToken;

  useEffect(() => {
    props.logout();
  }, [])

  return hasAuthToken ? <LayoutSplashScreen /> : <Redirect to="/auth/login" />;
}

export default connect(
  ({ auth }) => ({ hasAuthToken: Boolean(auth.authToken) }),
  auth.actions
)(Logout);
