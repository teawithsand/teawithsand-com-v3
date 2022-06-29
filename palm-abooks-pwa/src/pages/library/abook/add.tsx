import React from "react"

import CreateABookForm from "@app/components/abook/CreateABookForm"
import PageContainer from "@app/components/layout/PageContainer"
import { useABookStore } from "@app/domain/abook/ABookStore"
import { ABookFileMetadataType } from "@app/domain/abook/typedef"

import { getNowTimestamp } from "tws-common/lang/time/Timestamp"
import { generateUUID } from "tws-common/lang/uuid"
import LoadingSpinner from "@app/components/shared/loading-spinner/LoadingSpinner"
import useStickySubscribable from "tws-common/react/hook/useStickySubscribable"
import { ABookGTaskRunnerBus } from "@app/domain/gtask"

const ABookListPage = () => {
	const store = useABookStore()

	const currentTask = useStickySubscribable(ABookGTaskRunnerBus)
	if (currentTask !== null) {
		return <LoadingSpinner />
	}

	return (
		<PageContainer>
			<CreateABookForm
				onSubmit={async data => {
					const id = await store.create({
						addedAt: getNowTimestamp(),
						description: data.description,
						title: data.title,
					})

					const abook = await store.get(id)
					if (!abook)
						throw new Error(
							"Unreachable code - just created abook does not exist",
						)

					for (const f of data.files) {
						const fileId = generateUUID()
						await abook.files.setFile(fileId, f, {
							type: ABookFileMetadataType.PLAYABLE,
							fileName: f.name,
							metadataLoadingResult: null,
							url: null,
						})
					}
				}}
			/>
		</PageContainer>
	)
}

export default ABookListPage
