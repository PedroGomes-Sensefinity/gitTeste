import React from "react";

export function KibanaDashboard(props) {
    
    return (
        <iframe
            id="elasticFrame"
            height="100%"
            width="1080"
            scrolling="no"
            frameBorder="0"
            style={{ width: "100%", overflow: "auto" }}
            src={props.url}
        ></iframe>
    );
}
