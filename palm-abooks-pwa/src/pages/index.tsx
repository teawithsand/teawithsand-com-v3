import ABookList from "@app/components/abook/ABookList"
import React from "react"
import { getNowTimestamp } from "tws-common/lang/time/Timestamp"
import { generateUUID } from "tws-common/lang/uuid"

const IndexPage = () => {
	return (
		<div>
			<ABookList
				abooks={[
					{
						id: generateUUID(),
						metadata: {
							title: "Book one",
							description: "Lorem ipsum dolor sir",
							addedAt: getNowTimestamp(),
						},
					},
				]}
			/>
		</div>
	)
}

export default IndexPage
