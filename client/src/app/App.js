/**
 * Entry application component used to compose providers and render Routes.
 * */

import React, { Suspense } from "react";
import 'react-block-ui/style.css';
import ReactGA from 'react-ga';
import { Provider } from "react-redux";
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { PersistGate } from "redux-persist/integration/react";
import { I18nProvider } from "../_metronic/i18n";
import { LayoutSplashScreen, MaterialThemeProvider } from "../_metronic/layout";
import { AuthInit } from "./modules/Auth";
import { RoutingComponent } from "./RoutingComponent";




export default function App({ store, persistor, basename, history }) {
  /* Track website data if on prod */
  if (window.location.hostname !== "localhost") {
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
          <HistoryRouter history={history} basename={basename}>
            {/*This library only returns the location that has been active before the recent location change in the current window lifetime.*/}
            <MaterialThemeProvider>
              {/* Provide `react-intl` context synchronized with Redux state.  */}
              <I18nProvider>
                {/* Render routes with provided `Layout`. */}
                <AuthInit>
                  <RoutingComponent />
                </AuthInit>
              </I18nProvider>
              <ToastContainer />
            </MaterialThemeProvider>
          </HistoryRouter>
        </React.Suspense>
      </PersistGate>
    </Provider>
  );
}
