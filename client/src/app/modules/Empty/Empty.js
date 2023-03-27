import React, { useEffect, useState } from "react";
import { ErrorPage1 } from "../ErrorsExamples/ErrorPage1";

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}


export function Empty() {
    const [errorPage, setErrorPage] = useState(<></>)


    useEffect(() => {
        delay(1000).then(() => setErrorPage(<ErrorPage1></ErrorPage1>));
    });

    return (
        <div>
            {errorPage}
        </div>
    );
}
