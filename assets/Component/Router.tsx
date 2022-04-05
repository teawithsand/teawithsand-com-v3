import React from "react"
import { Routes, Route, HashRouter } from 'react-router-dom'
import Footer from "@app/Component/UI/Common/Footer"
import Home from "@app/Component/Page/Home"
import Navbar from "@app/Component/UI/Common/Navbar"

export default () => {
    return <HashRouter>
        <Navbar />
        <Routes>
            <Route path="/" element={<Home />} />
        </Routes>
        <Footer />
    </HashRouter>
}