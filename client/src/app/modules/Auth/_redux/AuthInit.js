import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { LayoutSplashScreen } from "../../../../_metronic/layout";
import { actions } from "./authRedux";
import { getUserByToken } from "./authService";

export default function AuthInit(props) {
  const didRequest = useRef(false);
  const dispatch = useDispatch();
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const { authToken } = useSelector(
    (state) => ({ authToken: state.auth.authToken }),
    shallowEqual);

  // We should request user by authToken before rendering the application
  useEffect(() => {
    const requestUser = async () => {
      try {
        if (!didRequest.current) {
          const { data: user } = await getUserByToken();
          dispatch(actions.fulfillUser(user));
        }
      } catch (error) {
        if (!didRequest.current) {
          dispatch(actions.logout());
        }
      } finally {
        setShowSplashScreen(false);
      }
      return () => (didRequest.current = true);
    };

    if (authToken) {
      requestUser();
    } else {
      dispatch(actions.fulfillUser(undefined));
      setShowSplashScreen(false);
    }
    // eslint-disable-next-line
  }, []);

  return showSplashScreen ? <LayoutSplashScreen /> : <>{props.children}</>;
}