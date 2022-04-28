import { homePath } from "@app/Component/endpoints"
import React from "react"
import { Link } from "react-router-dom"

export default () => {
    return <div style={{
        marginTop: "30px",
        textAlign: "center",
    }}>
        <h1>Page was not found</h1>
        <br />
        <Link to={homePath} >Go home</Link>
    </div>
}