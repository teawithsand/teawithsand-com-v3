import React from "react"
import { Routes, Route, BrowserRouter } from 'react-router-dom'

import Footer from "@app/Component/UI/Common/Footer"
import Home from "@app/Component/Page/Home/Home"
import Navbar from "@app/Component/UI/Common/Navbar"
import NotFound from "@app/Component/Page/NotFound/NotFound"
import Contact from "@app/Component/Page/Contact/Contact"
import AboutMe from "@app/Component/Page/AboutMe/AboutMe"

import { aboutMePath, blogHomePath, blogPostListPath, contactPath, homePath, paintPath, portfolioPath } from "./endpoints"
import BlogHome from "@app/Component/Page/Blog/Home/BlogHome"
import PostList from "./Page/Blog/PostList/PostList"

import postComponents from "@app/generated/postComponents"
import { makePostComponent } from "./Page/Blog/Post/Post"

import allEndpoints from "@app/generated/allEndpoints.json"
import Portfolio from "./Page/Portfolio/Portfolio"
import PaintPage from "./Page/Tool/PaintPage"

const checkEndpoints = (...eps: string[]) => {
    eps.forEach(ep => {
        if (!allEndpoints.endpoints.some(e => e === ep)) {
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


checkEndpoints(homePath, contactPath, aboutMePath, blogHomePath, blogPostListPath, portfolioPath, paintPath)

const PageComponent = (props: {
    Component: any,
}) => {
    const { Component } = props
    return <>
        <Navbar />
        {Component}
        <Footer />
    </>
}

export default () => {
    return <BrowserRouter>
        <Routes>
            <Route path={homePath} element={
                <PageComponent Component={<Home />} />}
            />
            <Route path={contactPath} element={
                <PageComponent Component={<Contact />} />}
            />
            <Route path={aboutMePath} element={
                <PageComponent Component={<AboutMe />} />}
            />
            <Route path={blogHomePath} element={
                <PageComponent Component={<BlogHome />} />}
            />
            <Route path={blogPostListPath} element={
                <PageComponent Component={<PostList />} />
            } />
            <Route path={portfolioPath} element={
                <PageComponent Component={<Portfolio />} />
            } />
            <Route path={paintPath} element={<PaintPage />} />

            {
                displayPosts.map(({ Component, path }, i) => <Route key={i} path={path} element={
                    <PageComponent Component={<Component />} />
                } />)
            }
            <Route path="*" element={ <PageComponent Component={<NotFound />} />} />
        </Routes>
    </BrowserRouter>
}