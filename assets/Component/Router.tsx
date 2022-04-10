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

import postComponents from "@app/generated/postComponents"
import { makePostComponent } from "./Page/Blog/Post/Post"

import allEndpoints from "@app/generated/allEndpoints.json"

const checkEndpoints = (...eps: string[]) => {
    eps.forEach(ep =>{
        if(!allEndpoints.endpoints.some(e => e === ep)){
            console.error("endpoint not registered", {
                endpoint: ep,
            })
        }
    })
} 

const displayPosts = postComponents.map(data => ({
    Component: makePostComponent({
        source: data.component,
    }),
    path: data.path,
}))


checkEndpoints(homePath, contactPath, aboutMePath, blogHomePath, blogPostListPath)

export default () => {
    return <HashRouter>
        <Navbar />
        <Routes>
            <Route path={homePath} element={<Home />} />
            <Route path={contactPath} element={<Contact />} />
            <Route path={aboutMePath} element={<AboutMe />} />
            <Route path={blogHomePath} element={<BlogHome />} />
            <Route path={blogPostListPath} element={<PostList />} />
            {
                displayPosts.map(({ Component, path }, i) => <Route key={i} path={path} element={<Component />} />)
            }
            <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
    </HashRouter>
}