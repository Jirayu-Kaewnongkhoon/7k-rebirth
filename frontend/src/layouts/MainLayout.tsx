import { useLocation } from "react-router";
import { useEffect } from "react";

import Sidebar from "../components/Sidebar/Sidebar";

function MainLayout() {
    return (
        <>
            <Sidebar />
            <ScrollToTop />
        </>
    )
}

export default MainLayout


function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}