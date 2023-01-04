import * as utils from "./LocalStorageHelpers";
import { matchPath } from 'react-router';

const localStorageLastLocationKey = "metronic-lastLocation";

function acceptLocation(lastLocation) {
    if (
        lastLocation &&
        lastLocation.pathname &&
        lastLocation.pathname !== "/" &&
        lastLocation.pathname.indexOf("auth") === -1 &&
        lastLocation.pathname !== "/logout"
    ) {
        return true;
    }

    return false;
}

export function saveLastLocation(lastLocation) {
    if (acceptLocation(lastLocation)) {
        utils.setStorage(
            localStorageLastLocationKey,
            JSON.stringify(lastLocation),
            120
        );
    }
}

export function forgotLastLocation() {
    utils.removeStorage(localStorageLastLocationKey);
}

export function getLastLocation() {
    const defaultLocation = { pathname: "/", title: "Dashboard" };
    const localStorateLocations = utils.getStorage(localStorageLastLocationKey);
    if (!localStorateLocations) {
        return { pathname: "/", title: "Dashboard" };
    }

    try {
        const result = JSON.parse(localStorateLocations);
        return result;
    } catch (error) {
        console.error(error);
        return defaultLocation;
    }
}

export function getCurrentUrl(location) {
    return location.pathname.split(/[?#]/)[0];
}

export function checkIsActive(location, url) {
    const result = matchPath({ path: url }, location)
    return result !== null
}
