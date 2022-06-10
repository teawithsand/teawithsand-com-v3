import Navbar from "@app/components/layout/Navbar"
import React from "react"

const Layout = (props: any) => {
	const { children } = props
	return (
		<>
			<Navbar />
			{children}
		</>
	)
}

export default Layout
