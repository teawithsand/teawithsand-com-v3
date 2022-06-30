import React from "react"
import { ReactElement, ReactFragment, ReactNode } from "react"
import AppNavbar from "@app/components/navbar/Navbar"

const Layout = (props: {
	children: ReactElement | ReactNode | ReactFragment | null | undefined
}) => {
	return (
		<>
			<AppNavbar />
			{props.children}
		</>
	)
}

export default Layout
