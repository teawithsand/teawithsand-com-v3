import React, { ReactNode } from "react"
import Navbar from "@app/components/layout/Navbar"
import Footer from "@app/components/layout/Footer"

export default (props: { children: ReactNode; withNoMain?: boolean }) => {
	if (props.withNoMain) {
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
