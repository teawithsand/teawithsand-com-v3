import React, { ReactNode } from "react"
import Navbar from "@app/components/layout/Navbar"
import Footer from "@app/components/layout/Footer"

export default (props: { children: ReactNode }) => {
	return (
		<>
			<Navbar />
			<main>{props.children ?? null}</main>
			<Footer />
		</>
	)
}
