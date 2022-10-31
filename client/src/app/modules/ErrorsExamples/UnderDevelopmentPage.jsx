import React from "react";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import { Layout } from "../../../_metronic/layout";
import "../../../_metronic/_assets/sass/pages/error/error-3.scss";

export default function UnderDevelopmentPage() {
  return (
      <div className="d-flex flex-column flex-root">
        <div
          className="error error-3 d-flex flex-row-fluid bgi-size-cover bgi-position-center"
          style={{
            backgroundImage: `url(${toAbsoluteUrl("/media/error/bg3.jpg")})`
          }}
        >
          <div className="px-10 px-md-30 py-10 py-md-0 d-flex flex-column justify-content-md-center">
            <h1 className="error-title text-stroke text-transparent">Sensefinity</h1>
            <p className="display-4 font-weight-boldest text-white mb-12">
              We are almost there!
            </p>
            <p className="font-size-h1 font-weight-boldest text-dark-75">
              This page is under development.
            </p>

          </div>
        </div>
      </div>
  );
}
