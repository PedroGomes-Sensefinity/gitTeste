/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Switch, Redirect } from "react-router-dom";
import { toAbsoluteUrl } from "../../../../_metronic/_helpers";
import { ContentRoute } from "../../../../_metronic/layout";
import Login from "./Login";
import ForgotPassword from "./ForgotPassword";
import "../../../../_metronic/_assets/sass/pages/login/classic/login-1.scss";
import RecoverPassword from "./RecoverPassword";
import './AuthPage.css';
import Typed from "react-typed"


var strarray = new Array(
  "There are over 250 foodborne diseases, all of which can be traced back to three categories of hazards: biological, chemical or physical.",
  "The North American logistics market is worth 1.4 trillion euros.",
  "Logistics carry 83% of all the farming & agriculture produce.",
  "In 2017 alone, the heavy trucks were involved in 107,000 crashes that led to passenger injuries.",
  "Only 1% of the earth’s water is safe for human consumption.",
  "In the last 170 years, we added 2.4 trillion tons of Carbon Dioxide into our atmosphere.",
  "As of 2018, the concentration of carbon dioxide (CO2) in our atmosphere was the highest it has been in 3 million years.",
  "In 2015, about 54.4 million people had low access to a supermarket due to limited transportation and uneven distribution of supermarkets.",
  "Given the right temperature and nutrients, bacteria can divide every 20 minutes.",
  "Some parasites, such as fish-borne trematodes, are only transmitted through food.",
  "Freezing food can help slow the growth of bacteria.",
  "Keep your refrigerator at 40°F/4ºC",
  "Half of all seafood gets thrown away.",
  "Around 90% of goods are carried out by sea.",
  "If a shipping container is properly taken care of, it can last 20 or more years.",
  "It is estimated that between 2,000 and 10,000 containers get lost at sea every year.",
  "GPS trackers can be used to keep track of the most important things in your life including family (people and pets!) and valuable possessions such as vehicles.",
  "1.5 trillion spent in transit logistics in the U.S. each year.",
  "Across the world, $8 billion is spent on moving goods over road transportation.",
  "Sensefinity saved 1 729 535 kgs of food!",
  "5 853 810 kgs of CO2 reduction with our platform!",
  "Sensefinity tool generated 393 955 alerts to help businesses find out issues.",
  "Sensefinity's platform processed 95 653 159 data insights."
);

function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

export function AuthPage() {
  strarray = shuffle(strarray)
  return (
    <>
      <div className="d-flex flex-column flex-root">
        {/*begin::Login*/}
        <div
          className="login login-1 login-signin-on d-flex flex-column flex-lg-row flex-column-fluid bg-white"
          id="kt_login"
        >
          {/*begin::Aside*/}
          <div
            className="login-aside d-flex flex-row-auto bgi-size-cover bgi-no-repeat p-10 p-lg-10"
            style={{
              backgroundImage: `url(${toAbsoluteUrl("/media/bg/bg-4.jpg")})`,
            }}
          >
            {/*begin: Aside Container*/}
            <div className="d-flex flex-row-fluid flex-column justify-content-between">
              {/* start:: Aside header */}
              {/* <Link to="/" className="flex-column-auto mt-5 pb-lg-0 pb-10">
                <img
                  alt="Logo"
                  className="max-h-70px"
                  src={toAbsoluteUrl("/media/logos/sensefinity_iot.png")}
                />
              </Link> */}
              {/* end:: Aside header */}

              {/* start:: Aside content */}
              <div className="flex-column-fluid d-flex flex-column justify-content-center">
                <h3 className="font-size-h1 mb-5 text-white">
                  Welcome to Sensefinity!
                </h3>
                <p className="font-weight-lighter text-white opacity-80">
                  A 360° complete IoT tracking and analytics solution for businesses enabling end to end supply chain visibility
                </p>
              </div>
              {/* end:: Aside content */}

              <div className="footer">
                <img src="/media/images/lightbulb.png" alt="Girl in a jacket" width="37" height="37" />
                <Typed className="font-weight-lighter text-white"
                  style={{ "fontFamily": "Lucida Console", "fontSize": "15px", "margin": "10px" }}
                  strings={strarray}
                  typeSpeed={80}
                  backDelay={15000}
                  backSpeed={10}
                  loop
                />

              </div>

              {/* start:: Aside footer for desktop */}
              <div className="d-none flex-column-auto d-lg-flex justify-content-between mt-10">
                {/* <div className="opacity-70 font-weight-bold	text-white">
                  &copy; 2020 Metronic
                </div> */}
                {/* <div className="d-flex">
                  <Link to="/terms" className="text-white">
                    Privacy
                  </Link>
                  <Link to="/terms" className="text-white ml-10">
                    Legal
                  </Link>
                  <Link to="/terms" className="text-white ml-10">
                    Contact
                  </Link>
                </div> */}
              </div>
              {/* end:: Aside footer for desktop */}
            </div>
            {/*end: Aside Container*/}
          </div>
          {/*begin::Aside*/}

          {/*begin::Content*/}
          <div className="d-flex flex-column flex-row-fluid position-relative p-7 overflow-hidden">
            {/*begin::Content header*/}
            {/* <div className="position-absolute top-0 right-0 text-right mt-5 mb-15 mb-lg-0 flex-column-auto justify-content-center py-5 px-10">
              <span className="font-weight-bold text-dark-50">
                Don't have an account yet?
              </span>
              <Link
                to="/auth/registration"
                className="font-weight-bold ml-2"
                id="kt_login_signup"
              >
                Sign Up!
              </Link>
            </div> */}
            {/*end::Content header*/}

            {/* begin::Content body */}
            <div className="d-flex flex-column-fluid flex-center mt-30 mt-lg-0">
              <Switch>
                <ContentRoute path="/auth/login" component={Login} />

                <ContentRoute path="/auth/forgot-password" component={ForgotPassword} />

                <ContentRoute
                  path="/auth/password-recover/:id"
                  component={RecoverPassword}
                />
                <Redirect from="/auth" exact={true} to="/auth/login" />
                <Redirect to="/auth/login" />
              </Switch>
            </div>
            {/*end::Content body*/}
            {/*ISSUES DIV*/}
            <div className='text-center mb-8 mb-lg-14'>
              <h3>
                Maintenance Scheduled: <strong>23/03/2023 to 24/03/2023</strong>
              </h3>
              <p className='text-muted font-weight-bold'>
                During this time you will be able to use the platform, but you will not be able to edit your data! We will post any updates here!
              </p>
            </div>
            {/* begin::Mobile footer */}
            <div className="d-flex d-lg-none flex-column-auto flex-column flex-sm-row justify-content-between align-items-center mt-5 p-5">
              {/* <div className="text-dark-50 font-weight-bold order-2 order-sm-1 my-2">
                &copy; 2020 Metronic
              </div> */}
              {/* 
              <div className="d-flex order-1 order-sm-2 my-2">
                <Link to="/terms" className="text-dark-75 text-hover-primary">
                  Privacy
                </Link>
                <Link
                  to="/terms"
                  className="text-dark-75 text-hover-primary ml-4"
                >
                  Legal
                </Link>
                <Link
                  to="/terms"
                  className="text-dark-75 text-hover-primary ml-4"
                >
                  Contact
                </Link>
              </div> */}
            </div>
            {/* end::Mobile footer */}
          </div>
          {/*end::Content*/}
        </div>
        {/*end::Login*/}
      </div>
    </>
  );
}
