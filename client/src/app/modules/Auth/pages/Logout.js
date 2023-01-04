import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { LayoutSplashScreen } from "../../../../_metronic/layout";
import templates from "../../../utils/links";
import { actions } from '../_redux/authRedux';

export default function Logout() {
  const { hasAuthToken } = useSelector(({ auth }) => ({ hasAuthToken: Boolean(auth.authToken) }))
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(actions.logout())
  }, [])

  return hasAuthToken ? <LayoutSplashScreen /> : <Navigate to={templates.login} />;
}
