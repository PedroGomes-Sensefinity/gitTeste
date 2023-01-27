import React from "react";

export function KibanaDashboard(props) {
    // Use date to prevent cache!
    const date = new Date();

    return (
        <iframe
            name={date.toString()}
            id={date.toString()}
            height="95%"
            frameBorder="0"
            style={{ width: "100%"}}
            src={props.url}
        ></iframe>
    );
}
