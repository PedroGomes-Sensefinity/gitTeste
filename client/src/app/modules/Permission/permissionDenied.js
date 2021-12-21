import React from "react";
import {toAbsoluteUrl} from "../../../_metronic/_helpers";

export default function PermissionDenied() {
    return (
        <div className="d-flex flex-column flex-root">
            <div
                className="error error-6 d-flex flex-row-fluid bgi-size-cover bgi-position-center"
                style={{
                    backgroundImage: `url(${toAbsoluteUrl("/media/error/bg6.jpg")})`,
                }}
            >
                <div className="d-flex flex-column flex-row-fluid text-center">
                    <h1
                        className="error-title font-weight-boldest text-white mb-12"
                    >
                        Oops...
                    </h1>
                    <p className="display-4 font-weight-bold text-white" style={{marginTop: "22rem"}}>
                        Looks like something went wrong.
                    </p>
                    <p className="display-4 font-weight-bold text-white">
                        We're working on it
                    </p>
                </div>
            </div>
        </div>
    );
}