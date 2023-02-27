import Footer from "@app/components/layout/Footer"
import AppNavbar from "@app/components/layout/Navbar"
import React, { ReactFragment } from "react"

const Layout = (props: { children?: ReactFragment }) => {
	return (
		<>
			<AppNavbar />
			{props.children}
			<Footer />
		</>
	)
}

export default Layout
