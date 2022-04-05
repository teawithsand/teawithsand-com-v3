import React from "react"
import { Routes, Route, HashRouter } from 'react-router-dom'
import Footer from "@app/Component/UI/Common/Footer"
import Home from "@app/Component/Page/Home/Home"
import Navbar from "@app/Component/UI/Common/Navbar"
import NotFound from "./Page/NotFound/NotFound"
import { contactPath, homePath } from "./endponts"
import Contact from "./Page/Contact/Contact"

export default () => {
    return <HashRouter>
        <Navbar />
        <Routes>
            <Route path={homePath} element={<Home />} />
            <Route path={contactPath} element={<Contact />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
    </HashRouter>
}