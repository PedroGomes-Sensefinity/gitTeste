import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { LayoutSplashScreen } from "../../../../_metronic/layout";
import { actions } from '../_redux/authRedux';

export default function Logout() {
  const { hasAuthToken } = useSelector(({ auth }) => ({ hasAuthToken: Boolean(auth.authToken) }))
  const dispatch = useDispatch()

  console.log(hasAuthToken)
  useEffect(() => {
    dispatch(actions.logout())
  }, [])

  return hasAuthToken ? <LayoutSplashScreen /> : <Redirect to="/auth/login" />;
}
