import AppNavbar from "@app/components/layout/Navbar"
import React, { ReactFragment } from "react"

const Layout = (props: { children?: ReactFragment }) => {
	return (
		<>
			<AppNavbar />
			{props.children}
		</>
	)
}

export default Layout
