import React from "react"
import { Routes, Route, HashRouter } from 'react-router-dom'

import Footer from "@app/Component/UI/Common/Footer"
import Home from "@app/Component/Page/Home/Home"
import Navbar from "@app/Component/UI/Common/Navbar"
import NotFound from "@app/Component/Page/NotFound/NotFound"
import Contact from "@app/Component/Page/Contact/Contact"
import AboutMe from "@app/Component/Page/AboutMe/AboutMe"

import { aboutMePath, blogHomePath, blogPostListPath, contactPath, homePath } from "./endpoints"
import BlogHome from "@app/Component/Page/Blog/Home/BlogHome"
import PostList from "./Page/Blog/PostList/PostList"

export default () => {
    return <HashRouter>
        <Navbar />
        <Routes>
            <Route path={homePath} element={<Home />} />
            <Route path={contactPath} element={<Contact />} />
            <Route path={aboutMePath} element={<AboutMe />} />
            <Route path={blogHomePath} element={<BlogHome />} />
            <Route path={blogPostListPath} element={<PostList />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
    </HashRouter>
}