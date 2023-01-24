import React from "react";

export function KibanaDashboard(props) {
    // Use date to prevent cache!
    const date = new Date();

    return (
        <iframe
            name={date.toString()}
            id={date.toString()}
            height="100%"
            width="1080"
            scrolling="no"
            frameBorder="0"
            style={{ width: "100%", overflow: "auto" }}
            src={props.url}
        ></iframe>
    );
}
