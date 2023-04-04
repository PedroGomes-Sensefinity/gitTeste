import React, { useEffect, useMemo, useState } from "react";
import objectPath from "object-path";
// LayoutContext
import { useHtmlClassService } from "../_core/MetronicLayout";
// Import Layout components
import { Header } from "./header/Header";
import { HeaderMobile } from "./header-mobile/HeaderMobile";
import { Aside } from "./aside/Aside";
import { Footer } from "./footer/Footer";
import { LayoutInit } from "./LayoutInit";
import { SubHeader } from "./subheader/SubHeader";
import { QuickPanel } from "./extras/offcanvas/QuickPanel";
import { QuickUser } from "./extras/offcanvas/QuickUser";
import { ScrollTop } from "./extras/ScrollTop";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { IconButton } from "@material-ui/core";
import { MdChevronRight, MdChevronLeft } from "react-icons/md";
//import {StickyToolbar} from "./extras/StickyToolbar";

export function Layout({ children }) {
    const uiService = useHtmlClassService();
    const [sideMenu, setSideMenu] = useState(true)
    // Layout settings (cssClasses/cssAttributes)
    const layoutProps = useMemo(() => {
        setSideMenu(true)
        return {
            layoutConfig: uiService.config,
            headerLogo: uiService.getStickyLogo(),
            selfLayout: objectPath.get(uiService.config, "self.layout"),
            asideDisplay: objectPath.get(uiService.config, "aside.self.display"),
            subheaderDisplay: objectPath.get(uiService.config, "subheader.display"),
            desktopHeaderDisplay: objectPath.get(
                uiService.config,
                "header.self.fixed.desktop"
            ),
            contentCssClasses: uiService.getClasses("content", true),
            contentContainerClasses: uiService.getClasses("content_container", true),
            contentExtended: objectPath.get(uiService.config, "content.extended")
        };
    }, [uiService]);
    function onChange() {
        setSideMenu(!sideMenu)
    }

    return layoutProps.selfLayout !== "blank" ? (
        <>
            {/*begin::Main*/}
            <HeaderMobile />
            {/*begin::Logo*/}
            {/*end::Logo*/}
            <div className="d-flex flex-column flex-root">
                {/*begin::Page*/}
                <div className="d-flex flex-row flex-column-fluid page">
                    {sideMenu   && (<Aside style={{ "width": sideMenu ? "" : "0px" }} />)}
                    {/*begin::Wrapper*/}
                    <div style={{ "padding-left": sideMenu ? "" : "0px" }} className="d-flex flex-column flex-row-fluid wrapper" id="kt_wrapper">
                        {/*begin::Content*/}
                        <div
                            id="kt_content"
                            className={`content ${layoutProps.contentCssClasses} d-flex flex-column flex-column-fluid`}
                        >
                            {/*begin::Entry*/}
                            {!layoutProps.contentExtended && (
                                <div className="d-flex flex-column-fluid">
                                    {/*begin::Container*/}
                                    <div className={layoutProps.contentContainerClasses}>
                                        {children}
                                    </div>
                                    {/*end::Container*/}
                                </div>
                            )}

                            {layoutProps.contentExtended && { children }}
                            {/*end::Entry*/}
                        </div>
                        {/*end::Content*/}
                        <Footer sideMenu={sideMenu} onChange={onChange}></Footer>
                    </div>
                    {/*end::Wrapper*/}
                </div>
                {/*end::Page*/}
            </div>
            <QuickUser />
            <QuickPanel />
            <ScrollTop />
            { /*<StickyToolbar/>* }
            {/*end::Main*/}

            <LayoutInit />
        </>
    ) : (
        // BLANK LAYOUT
        <div className="d-flex flex-column flex-root">{children}</div>
    );
}
