import ABookList from "@app/components/abook/ABookList"
import React from "react"
import { generateUUID } from "tws-common/lang/uuid"

const IndexPage = () => {
	return (
		<div>
			<ABookList
				abooks={[
					{
						id: generateUUID(),
						title: "Book one",
						description: "Lorem ipsum dolor sir",
					},
				]}
			/>
		</div>
	)
}

export default IndexPage
