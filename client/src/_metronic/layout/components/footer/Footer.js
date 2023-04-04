import React, { useMemo } from "react";
import { useHtmlClassService } from "../../_core/MetronicLayout";
import { IconButton } from "@material-ui/core";
import { MdChevronRight, MdChevronLeft } from "react-icons/md";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import objectPath from "object-path";

export function Footer(props) {
  const today = new Date().getFullYear();
  const uiService = useHtmlClassService();

  const layoutProps = useMemo(() => {
    return {
      headerLogo: uiService.getStickyLogo(),
      footerClasses: uiService.getClasses("footer", true),
      asideDisplay: objectPath.get(uiService.config, "aside.self.display"),
      footerContainerClasses: uiService.getClasses("footer_container", true)
    };
  }, [uiService]);

  console.log(layoutProps.footerClasses)

  return (
    <div
      className={`footer bg-white d-flex flex-lg-column  ${layoutProps.footerClasses}`}
      id="kt_footer"
    >
      <div
        className={`${layoutProps.footerContainerClasses} d-flex flex-column flex-md-row align-items-center justify-content-between`}
      >
        <div className="text-dark order-2 order-md-1">
          {layoutProps.asideDisplay && <Button variant="outline-primary" onClick={props.onChange}>
            {props.sideMenu ? "Hide" : "Show"} Menu!
          </Button>}

        </div>
        <div className="nav nav-dark order-1 order-md-2">

          <a
            href="https://www.sensefinity.com"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link pr-3 pl-0"
          >
            &copy; Sensefinity
          </a>
          <Link to={{ pathname: "https://sensefinity.com" }} target="_blank">
            <img style={{ width: "100px", padding: "10px" }} alt="logo" src="/media/logos/sensefinity_iot-small.png" />
          </Link>
        </div>
      </div>
    </div>
  );
}
