/* eslint-disable jsx-a11y/role-supports-aria-props */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import SVG from "react-inlinesvg";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import { usePermissions } from "../../../../../app/modules/Permission/PermissionsProvider";
import { checkIsActive, toAbsoluteUrl } from "../../../../_helpers";

export function AsideMenuList({ layoutProps }) {

  const { permissions } = usePermissions()

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
<<<<<<< client/src/_metronic/layout/components/aside/aside-menu/AsideMenuList.js
          className={`menu-item ${getMenuItemActive("/dashboard", false)}`}
          aria-haspopup="true"
        >
          <NavLink className='menu-link menu-toggle' to="/dashboard">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Devices/Display1.svg")} />
            </span>
            <span className="menu-text">Dashboards</span>
          </NavLink>
          {permissions.canViewContainerDashboard &&
            <div className="menu-submenu">
              <i className="menu-arrow" />
              <ul className="menu-subnav">
                <li className="menu-item menu-item-parent" aria-haspopup="true">
                  <span className="menu-link">
                    <span className="menu-text">Dashboard</span>
                  </span>
                </li>
                {/*begin::2 Level*/}
                <li
                  className={`menu-item ${getMenuItemActive("/dashboard/default")}`}
                  aria-haspopup="true"
                >
                  <NavLink className="menu-link" to="/dashboard/default">
                    <i className="menu-bullet menu-bullet-dot">
                      <span />
                    </i>
                    <span className="menu-text">Dashboard</span>
                  </NavLink>
                </li>
                {/*end::2 Level*/}
                {/*begin::2 Level*/}
                <li
                  className={`menu-item ${getMenuItemActive("/dashboard/containers")}`}
                  aria-haspopup="true"
                >
                  <NavLink className="menu-link" to="/dashboard/containers">
                    <i className="menu-bullet menu-bullet-dot">
                      <span />
                    </i>
                    <span className="menu-text">Container Dashboard</span>
                  </NavLink>
                </li>
                {/*end::2 Level*/}
              </ul>
            </div>}
        </li>
        {/*end::1 Level*/}

=======
              className={`menu-item ${getMenuItemActive("/dashboard", false)}`}
              aria-haspopup="true"
          >
              <NavLink className="menu-link" to="/dashboard">
                  <span className="svg-icon menu-icon">
                    <SVG src={toAbsoluteUrl("/media/svg/icons/Devices/Display1.svg")} />
                  </span>
                  <span className="menu-text">Dashboard</span>
              </NavLink>
          </li>
        {/*end::1 Level*/}
>>>>>>> client/src/_metronic/layout/components/aside/aside-menu/AsideMenuList.js
        {/*begin::1 Level*/}
        {permissions.canViewTenants &&
          <li
            className={`menu-item ${getMenuItemActive("/tenants", false)}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/tenants/list">
              <span className="svg-icon menu-icon">
                <SVG src={toAbsoluteUrl("/media/svg/icons/Files/User-folder.svg")} />
              </span>
              <span className="menu-text">Tenants</span>
            </NavLink>
          </li>
        }
        {/*end::1 Level*/}

        {/*begin::1 Level*/}
        {permissions.canViewUsers &&
          <li
            className={`menu-item ${getMenuItemActive("/users", true)}`}
            aria-haspopup="true">
            <NavLink className="menu-link menu-toggle" to="/users/list">
              <span className="svg-icon menu-icon">
                <SVG src={toAbsoluteUrl("/media/svg/icons/Files/User-folder.svg")} />
              </span>
              <span className="menu-text">Users</span>
            </NavLink>
          </li>}
        {/*end::1 Level*/}

        {/*begin::1 Level*/}
        {permissions.canViewProfiles &&
          <li
            className={`menu-item ${getMenuItemActive("/profiles", true)}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link menu-toggle" to="/profiles/list">
              <span className="svg-icon menu-icon">
                <SVG src={toAbsoluteUrl("/media/svg/icons/Communication/Group.svg")} />
              </span>
              <span className="menu-text">Profiles</span>
            </NavLink>
          </li>
        }
        {/*end::1 Level*/}

        {/*begin::1 Level*/}
        {permissions.canViewAssets &&
          <li
            className={`menu-item ${getMenuItemActive("/assets", true)}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link menu-toggle" to="/assets/list">
              <span className="svg-icon menu-icon">
                <SVG src={toAbsoluteUrl("/media/svg/icons/Communication/Group.svg")} />
              </span>
              <span className="menu-text">Assets</span>
            </NavLink>
          </li>
        }
        {/*begin::1 Level*/}
        {permissions.canViewDevices &&
          <li
            className={`menu-item ${getMenuItemActive("/devices", true)}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link menu-toggle" to="/devices">
              <span className="svg-icon menu-icon">
                <SVG src={toAbsoluteUrl("/media/svg/icons/Devices/CPU1.svg")} />
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
                  className={`menu-item ${getMenuItemActive("/devices/list")}`}
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
                  className={`menu-item ${getMenuItemActive("/devices/provision")}`}
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
                  className={`menu-item ${getMenuItemActive("/device/upload")}`}
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
              </ul>
            </div>
          </li>
        }
        {/*end::1 Level*/}

        {/*begin::1 Level*/}
        {permissions.canViewBoardFamilies &&
          <li
            className={`menu-item ${getMenuItemActive("/board-families", true)}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link menu-toggle" to="/board-families/list">
              <span className="svg-icon menu-icon">
                <SVG src={toAbsoluteUrl("/media/svg/icons/Devices/Router2.svg")} />
              </span>
              <span className="menu-text">Board family</span>
            </NavLink>
          </li>
        }
        {/*end::1 Level*/}

        {/*begin::1 Level*/}
        {permissions.canViewGroups &&
          <li
            className={`menu-item ${getMenuItemActive("/groups", false)}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/groups/list">
              <span className="svg-icon menu-icon">
                <SVG src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")} />
              </span>
              <span className="menu-text">Groups</span>
            </NavLink>
          </li>
        }
        {/*end::1 Level*/}

        {/*begin::1 Level*/}
        {permissions.canViewRoutes &&
          <li
            className={`menu-item ${getMenuItemActive("/routes", true)}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link menu-toggle" to="/routes">
              <span className="svg-icon menu-icon">
                <SVG src={toAbsoluteUrl("/media/svg/icons/Design/Select.svg")} />
              </span>
              <span className="menu-text">Routes</span>
            </NavLink>
            <div className="menu-submenu">
              <i className="menu-arrow" />
              <ul className="menu-subnav">
                <li className="menu-item menu-item-parent" aria-haspopup="true">
                  <span className="menu-link">
                    <span className="menu-text">Routes</span>
                  </span>
                </li>
                {/*begin::2 Level*/}
                <li
                  className={`menu-item ${getMenuItemActive(
                    "/routes/list"
                  )}`}
                  aria-haspopup="true"
                >
                  <NavLink className="menu-link" to="/routes/list">
                    <i className="menu-bullet menu-bullet-dot">
                      <span />
                    </i>
                    <span className="menu-text">Route List</span>
                  </NavLink>
                </li>
                <li
                  className={`menu-item ${getMenuItemActive(
                    "/routes/completion"
                  )}`}
                  aria-haspopup="true"
                >
                  <NavLink className="menu-link" to="/routes/completion">
                    <i className="menu-bullet menu-bullet-dot">
                      <span />
                    </i>
                    <span className="menu-text">Route Completion</span>
                  </NavLink>
                </li>
                {/*end::2 Level*/}
              </ul>
            </div>
          </li>
        }
        {/*begin::1 Level*/}
        {permissions.canViewGeofences &&
          <li
<<<<<<< client/src/_metronic/layout/components/aside/aside-menu/AsideMenuList.js
            className={`menu-item ${getMenuItemActive("/geofences", true)}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link menu-toggle" to="/geofences/list">
              <span className="svg-icon menu-icon">
                <SVG src={toAbsoluteUrl("/media/svg/icons/Design/Select.svg")} />
              </span>
              <span className="menu-text">Geofences</span>
            </NavLink>
=======
              className={`menu-item ${getMenuItemActive("/geofences", true)}`}
              aria-haspopup="true"
          >
              <NavLink className="menu-link menu-toggle" to="/geofences">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Design/Select.svg")} />
            </span>
                  <span className="menu-text">Geofences</span>
              </NavLink>
              <div className="menu-submenu">
                  <i className="menu-arrow" />
                  <ul className="menu-subnav">
                      <li className="menu-item menu-item-parent" aria-haspopup="true">
                <span className="menu-link">
                  <span className="menu-text">Geofences</span>
                </span>
                      </li>
                      {/*begin::2 Level*/}
                      <li
                          className={`menu-item ${getMenuItemActive(
                              "/geofences/list"
                          )}`}
                          aria-haspopup="true"
                      >
                          <NavLink className="menu-link" to="/geofences/list">
                              <i className="menu-bullet menu-bullet-dot">
                                  <span />
                              </i>
                              <span className="menu-text">Geofences List</span>
                          </NavLink>
                      </li>
                      {/*end::2 Level*/}
                  </ul>
              </div>
>>>>>>> client/src/_metronic/layout/components/aside/aside-menu/AsideMenuList.js
          </li>
        }
        {/*begin::1 Level*/}
        {permissions.canViewThresholds &&
          <li
            className={`menu-item ${getMenuItemActive("/thresholds", false)}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/thresholds/list">
              <span className="svg-icon menu-icon">
                <SVG src={toAbsoluteUrl("/media/svg/icons/Devices/Diagnostics.svg")} />
              </span>
              <span className="menu-text">Thresholds</span>
            </NavLink>
          </li>
        }
        {/*end::1 Level*/}

        {/*begin::1 Level*/}
        {permissions.canViewAlarms &&
          <li
            className={`menu-item ${getMenuItemActive("/alarms", false)}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/alarms/list">
              <span className="svg-icon menu-icon">
                <SVG src={toAbsoluteUrl("/media/svg/icons/Code/Warning-1-circle.svg")} />
              </span>
              <span className="menu-text">Alarms</span>
            </NavLink>
          </li>
        }
        {/*end::1 Level*/}

        {/*begin::1 Level*/}
        {permissions.canViewNotificationTemplates &&
          <li
            className={`menu-item ${getMenuItemActive("/notification-templates", false)}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/notification-templates/list">
              <span className="svg-icon menu-icon">
                <SVG src={toAbsoluteUrl("/media/svg/icons/Files/File.svg")} />
              </span>
              <span className="menu-text">Notification Templates</span>
            </NavLink>
          </li>
        }
        {/*end::1 Level*/}
        {permissions.canViewFloorMaps &&
          <li
            className={`menu-item ${getMenuItemActive("/floor-maps", false)}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/floor-maps/list">
              <span className="svg-icon menu-icon">
                <SVG src={toAbsoluteUrl("/media/svg/icons/Home/Home.svg")} />
              </span>
              <span className="menu-text">Floor Maps</span>
            </NavLink>
          </li>
        }
      </ul>
      {/* end::Menu Nav */}
    </>
  );
}
