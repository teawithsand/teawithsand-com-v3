import React from "react"
import { Routes, Route, HashRouter } from 'react-router-dom'

import Footer from "@app/Component/UI/Common/Footer"
import Home from "@app/Component/Page/Home/Home"
import Navbar from "@app/Component/UI/Common/Navbar"
import NotFound from "@app/Component/Page/NotFound/NotFound"
import Contact from "@app/Component/Page/Contact/Contact"
import AboutMe from "@app/Component/Page/AboutMe/AboutMe"

import { aboutMePath, contactPath, homePath } from "./endpoints"

export default () => {
    return <HashRouter>
        <Navbar />
        <Routes>
            <Route path={homePath} element={<Home />} />
            <Route path={contactPath} element={<Contact />} />
            <Route path={aboutMePath} element={<AboutMe />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
    </HashRouter>
}