import { render } from "react-dom"
import React from "react"
import TeaAnimation from "./Component/TeaAnimation/TeaAnimation"

import "@app/styles/global.scss"
import Router from "@app/Component/Router"

const App = () => {
    return <Router />
}

document.title = "teawithsand.com"

const initApp = async () => {
    // const target = document.createElement("div")
    // target.id = "root"
    // document.body.appendChild(target)

    render(<App />, document.getElementById('root'));
}
document.addEventListener("DOMContentLoaded", () => {
    initApp()
})


// disable SW for dev, since it's caching is annoying and sometimes causes old versions of code to be loaded
// it integrates badly with hot reload
window.addEventListener("load", () => {
    // disable SW for the time being 
    // Website is fast enough anyway
    // loadAndRegisterServiceWorker()
})