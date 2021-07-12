/* eslint-disable jsx-a11y/role-supports-aria-props */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl, checkIsActive } from "../../../../_helpers";

export function AsideMenuList({ layoutProps }) {
  const location = useLocation();
  const getMenuItemActive = (url, hasSubmenu = false) => {
    return checkIsActive(location, url)
      ? ` ${!hasSubmenu &&
          "menu-item-active"} menu-item-open menu-item-not-hightlighted`
      : "";
  };

  return (
    <>
      {/* begin::Menu Nav */}
      <ul className={`menu-nav ${layoutProps.ulClasses}`}>
        {/*begin::1 Level*/}
        <li
          className={`menu-item ${getMenuItemActive("/dashboard", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/dashboard">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")} />
            </span>
            <span className="menu-text">Dashboard</span>
          </NavLink>
        </li>
        {/*end::1 Level*/}
        {/*begin::1 Level*/}
        <li
            className={`menu-item ${getMenuItemActive("/tenants", true)}`}
            aria-haspopup="true"
        >
          <NavLink className="menu-link menu-toggle" to="/tenants">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Files/User-folder.svg")} />
            </span>
            <span className="menu-text">Tenants</span>
          </NavLink>
          <div className="menu-submenu">
            <i className="menu-arrow" />
            <ul className="menu-subnav">
              <li className="menu-item menu-item-parent" aria-haspopup="true">
                <span className="menu-link">
                  <span className="menu-text">Tenants</span>
                </span>
              </li>
              {/*begin::2 Level*/}
              <li
                  className={`menu-item ${getMenuItemActive(
                      "/tenants/list"
                  )}`}
                  aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/tenants/list">
                  <i className="menu-bullet menu-bullet-dot">
                    <span />
                  </i>
                  <span className="menu-text">Tenants List</span>
                </NavLink>
              </li>
              {/*end::2 Level*/}
            </ul>x
          </div>
        </li>
        {/*end::1 Level*/}

        {/*begin::1 Level*/}
        <li
            className={`menu-item ${getMenuItemActive("/devices", true)}`}
            aria-haspopup="true"
        >
          <NavLink className="menu-link menu-toggle" to="/devices">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Devices/Router2.svg")} />
            </span>
            <span className="menu-text">Devices</span>
          </NavLink>
          <div className="menu-submenu">
            <i className="menu-arrow" />
            <ul className="menu-subnav">
              <li className="menu-item menu-item-parent" aria-haspopup="true">
                <span className="menu-link">
                  <span className="menu-text">Devices</span>
                </span>
              </li>
              {/*begin::2 Level*/}
              <li
                className={`menu-item ${getMenuItemActive(
                  "/devices/list"
                )}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/devices/list">
                  <i className="menu-bullet menu-bullet-dot">
                    <span />
                  </i>
                  <span className="menu-text">Device List</span>
                </NavLink>
              </li>
              {/*end::2 Level*/}
              {/*begin::2 Level*/}
              <li
                className={`menu-item ${getMenuItemActive(
                  "/devices/provision"
                )}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/devices/provision">
                  <i className="menu-bullet menu-bullet-dot">
                    <span />
                  </i>
                  <span className="menu-text">Device Provision</span>
                </NavLink>
              </li>
              {/*end::2 Level*/}
              {/*begin::2 Level*/}
              <li
                className={`menu-item ${getMenuItemActive(
                  "/device/upload"
                )}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/devices/upload">
                  <i className="menu-bullet menu-bullet-dot">
                    <span />
                  </i>
                  <span className="menu-text">Device Upload</span>
                </NavLink>
              </li>
              {/*end::2 Level*/}
            </ul>x
          </div>
        </li>
        {/*end::1 Level*/}

        {/*begin::1 Level*/}
        <li
          className={`menu-item ${getMenuItemActive("/groups/list", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/groups/list">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")} />
            </span>
            <span className="menu-text">Groups</span>
          </NavLink>
        </li>
        {/*end::1 Level*/}

        {/*begin::1 Level*/}
        <li
          className={`menu-item ${getMenuItemActive("/thresholds/list", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/thresholds/list">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")} />
            </span>
            <span className="menu-text">Thresholds</span>
          </NavLink>
        </li>
        {/*end::1 Level*/}

        {/*begin::1 Level*/}
        <li
          className={`menu-item ${getMenuItemActive("/alarms/list", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/alarms/list">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")} />
            </span>
            <span className="menu-text">Alarms</span>
          </NavLink>
        </li>
        {/*end::1 Level*/}

        {/*begin::1 Level*/}
        <li
          className={`menu-item ${getMenuItemActive("/notification-templates/list", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/notification-templates/list">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")} />
            </span>
            <span className="menu-text">Notification templates</span>
          </NavLink>
        </li>
        {/*end::1 Level*/}
      </ul>
      {/* end::Menu Nav */}
    </>
  );
}
