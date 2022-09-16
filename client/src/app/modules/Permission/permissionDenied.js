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
                        Sensefinity
                    </h1>
                    <p className="display-4 font-weight-bold" style={{marginTop: "22rem"}}>
                        You don’t have permissions to see this page.
                    </p>
                    <p className="display-4 font-weight-bold">
                        Please contact Sensefinity Team if you think this is an error.
                    </p>
                </div>
            </div>
        </div>
    );
}