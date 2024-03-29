import React, { ReactNode } from "react"

import Footer from "@app/components/layout/Footer"
import Navbar from "@app/components/layout/Navbar"

const Layout = (props: { children: ReactNode; withNoMain?: boolean }) => {
	if (!props.withNoMain) {
		return (
			<>
				<Navbar />
				<main>{props.children ?? null}</main>
				<Footer />
			</>
		)
	} else {
		return (
			<>
				<Navbar />
				{props.children ?? null}
				<Footer />
			</>
		)
	}
}

export default Layout
