/**
 * Entry application component used to compose providers and render Routes.
 * */

import React from "react";
import ReactGA from 'react-ga';
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { AuthInit } from "./modules/Auth";
import { PermissionsProvider } from "./modules/Permission/PermissionsProvider"
import { Routes } from "../app/Routes";
import { ToastContainer } from 'react-toastify';
import { I18nProvider } from "../_metronic/i18n";
import { LayoutSplashScreen, MaterialThemeProvider } from "../_metronic/layout";
import 'react-block-ui/style.css';




export default function App({ store, persistor, basename }) {
  /* Track website data if on prod */
  if(window.location.hostname !== "localhost" ){
      const trackingId = "UA-43625140-3";
      ReactGA.initialize(trackingId);
  }
  return (
    /* Provide Redux store */
    <Provider store={store}>
      {/* Asynchronously persist redux stores and show `SplashScreen` while it's loading. */}
      <PersistGate persistor={persistor} loading={<LayoutSplashScreen />}>
        {/* Add high level `Suspense` in case if was not handled inside the React tree. */}
        <React.Suspense fallback={<LayoutSplashScreen />}>
          {/* Override `basename` (e.g: `homepage` in `package.json`) */}
          <BrowserRouter basename={basename}>
            {/*This library only returns the location that has been active before the recent location change in the current window lifetime.*/}
            <MaterialThemeProvider>
              {/* Provide `react-intl` context synchronized with Redux state.  */}
              <I18nProvider>
                {/* Render routes with provided `Layout`. */}
                <AuthInit>
                  <PermissionsProvider>
                    <Routes />
                  </PermissionsProvider>
                </AuthInit>
              </I18nProvider>
              <ToastContainer />
            </MaterialThemeProvider>
          </BrowserRouter>
        </React.Suspense>
      </PersistGate>
    </Provider>
  );
}
