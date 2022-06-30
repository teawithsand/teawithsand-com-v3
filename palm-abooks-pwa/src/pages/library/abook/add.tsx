import { navigate } from "gatsby"
import React from "react"

import CreateABookForm from "@app/components/abook/CreateABookForm"
import PageContainer from "@app/components/layout/PageContainer"
import LoadingSpinner from "@app/components/shared/loading-spinner/LoadingSpinner"
import { useABookStore } from "@app/domain/abook/ABookStore"
import { ABookFileMetadataType } from "@app/domain/abook/typedef"
import {
	ABookGTaskRunnerBus,
	AppGTaskRunnerContext,
	GTaskGroupImpl,
} from "@app/domain/gtask"
import { abookLibraryViewPath } from "@app/paths"

import { getNowTimestamp } from "tws-common/lang/time/Timestamp"
import { generateUUID } from "tws-common/lang/uuid"
import { useGTaskRunnerContext } from "tws-common/misc/gtask"
import useStickySubscribable from "tws-common/react/hook/useStickySubscribable"

const ABookListPage = () => {
	const store = useABookStore()

	const currentTask = useStickySubscribable(ABookGTaskRunnerBus)
	if (currentTask !== null) {
		return <LoadingSpinner />
	}

	const taskRunner = useGTaskRunnerContext(AppGTaskRunnerContext)

	// TODO(teawithsand): prevent blinking of form page for a while before navigate takes place

	return (
		<PageContainer>
			<CreateABookForm
				onSubmit={async data => {
					const handle = taskRunner.putTask({
						metadata: {
							group: GTaskGroupImpl.ABOOK,
							abookLockType: "write",
						},
						task: async () => {
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

							let i = 0
							for (const f of data.files) {
								i++
								const fileId = generateUUID()
								await abook.files.setFile(fileId, f, {
									type: ABookFileMetadataType.PLAYABLE,
									fileName: f.name,
									metadataLoadingResult: null,
									url: null,
									ordinalNumber: i,
								})
							}

							navigate(abookLibraryViewPath(id))
						},
					})

					await handle.promise
				}}
			/>
		</PageContainer>
	)
}

export default ABookListPage
