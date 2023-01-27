import React, {useMemo} from "react";
import {Link} from "react-router-dom";
import objectPath from "object-path";
import SVG from "react-inlinesvg";
import {useHtmlClassService} from "../../_core/MetronicLayout";
import {toAbsoluteUrl} from "../../../_helpers";

export function Brand() {
  const uiService = useHtmlClassService();

  const layoutProps = useMemo(() => {
    return {
      brandClasses: uiService.getClasses("brand", true),
      asideSelfMinimizeToggle: objectPath.get(
          uiService.config,
          "aside.self.minimize.toggle"
      ),
      headerLogo: uiService.getLogo(),
      headerStickyLogo: uiService.getStickyLogo()
    };
  }, [uiService]);

  return (
    <>
      {/* begin::Brand */}
      <div
        style={{"padding":"15px"}}
          className={` flex-column-auto ${layoutProps.brandClasses}`}
          id="kt_brand"
      >
        {/* begin::Logo */}
        <Link to="" className="brand-logo">
          <img style={{"border-radius":"20%","display": "block","marginLeft":"auto","marginRight":"auto", "width":"40%"}} className="header-logo" alt="logo" src={layoutProps.headerLogo} width="70%"/>
        </Link>
        {/* end::Logo */}

      </div>
      {/* end::Brand */}
      </>
  );
}
