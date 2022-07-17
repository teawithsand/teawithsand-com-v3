import React, { ReactFragment } from "react"

const Layout = (props: { children?: ReactFragment }) => {
	return <>{props.children}</>
}

export default Layout
