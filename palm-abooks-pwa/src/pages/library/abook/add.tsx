import React from "react"

import CreateABookForm from "@app/components/abook/CreateABookForm"
import PageContainer from "@app/components/layout/PageContainer"

const ABookListPage = () => {
	return (
		<PageContainer>
			<CreateABookForm
				onSubmit={async data => {
					console.log("Submitting form: ", data)
				}}
			/>
		</PageContainer>
	)
}

export default ABookListPage
