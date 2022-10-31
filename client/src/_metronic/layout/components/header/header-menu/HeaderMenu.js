/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { useLocation } from "react-router";


const associationTable = {
    "dashboard":"Dashboard",
    "tenants": "Tenants",
    "users": "Users",
    "profiles": "Profiles",
    "assets": "Assets",
    "devices": "Devices",
    "board-families": "Board Families",
    "groups": "Groups",
    "routes": "Routes",
    "geofences": "Geofences",
    "thresholds": "Thresholds",
    "alarms": "Alarms",
    "notification-templates": "Notification Templates",
    "floor-maps": "Floor Maps"
}

export function HeaderMenu({ layoutProps }) {
    const location = useLocation();
    const currentTitle = associationTable[location.pathname.split('/')[1]]

    return <div
        id="kt_header_menu"
        className={`header-menu header-menu-mobile ${layoutProps.ktMenuClasses}`}
        {...layoutProps.headerMenuAttributes}
    >
        {/*begin::Header Nav*/}
        <ul className={`menu-nav ${layoutProps.ulClasses}`}>
            {/*begin::1 Level*/}
            <li className={`menu-item menu-item-rel`}>
                <h3 className="menu-text"><b>{currentTitle}</b></h3>
                {layoutProps.rootArrowEnabled && (<i className="menu-arrow" />)}
            </li>
            {/*end::1 Level*/}
        </ul>
        {/*end::Header Nav*/}
    </div>;
}
