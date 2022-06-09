import CreateABookForm from "@app/components/abook/CreateABookForm"
import React from "react"
import NavBar from "tws-common/ui/material/component/NavBar"

const IndexPage = () => {
	return (
		<div>
			<NavBar />
			<CreateABookForm />
		</div>
	)
}

export default IndexPage
