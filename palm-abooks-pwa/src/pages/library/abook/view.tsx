import React from "react"
import { useDispatch } from "react-redux"

import ABookView from "@app/components/abook/ABookView"
import PageContainer from "@app/components/layout/PageContainer"
import ErrorExplainer from "@app/components/shared/error-explainer/ErrorExplainer"
import NotFoundErrorExplainer from "@app/components/shared/error-explainer/NotFoundErrorExplainer"
import LoadingSpinner from "@app/components/shared/loading-spinner/LoadingSpinner"
import { useABookStore } from "@app/domain/abook/ABookStore"
import { ABookFileMetadataType } from "@app/domain/abook/typedef"
import {
	ABookGTaskRunnerBus,
	AppGTaskRunnerContext,
	GTaskGroupImpl,
} from "@app/domain/gtask"
import { setWTPPlaylist } from "@app/domain/wtp/actions"
import { WTPPlaylistMetadataType } from "@app/domain/wtp/playlist"
import { abookLibraryListPath } from "@app/paths"
import { useAppTranslationSelector } from "@app/trans/AppTranslation"

import { collectAsyncIterable } from "tws-common/lang/asyncIterator"
import { generateUUID } from "tws-common/lang/uuid"
import { useGTaskRunnerContext } from "tws-common/misc/gtask"
import { setIsPlayingWhenReady } from "tws-common/player/bfr/actions"
import { useQuery } from "tws-common/react/hook/query"
import { useGetParamsObject } from "tws-common/react/hook/useGetParams"
import { useStickySubscribable } from "tws-common/react/hook/useStickySubscribable"
import { addFlashMessage, createFlashMessage } from "tws-common/ui/flash"

const ABookViewPage = () => {
	const store = useABookStore()
	const { id } = useGetParamsObject()

	const {
		data: abook,
		status,
		error,
		refetch,
	} = useQuery(["abook-view-get-abook", id], async () => {
		const abookAR = await store.get(id ?? "")
		return abookAR
	})

	const taskRunner = useGTaskRunnerContext(AppGTaskRunnerContext)
	const dispatch = useDispatch()
	const trans = useAppTranslationSelector(t => t.library.abook)

	const currentTask = useStickySubscribable(ABookGTaskRunnerBus)
	if (currentTask !== null) {
		return <LoadingSpinner />
	}

	let inner = null
	if (status === "idle" || status === "loading") {
		inner = <LoadingSpinner />
	} else if (status === "error") {
		inner = <ErrorExplainer error={error} />
	} else {
		if (!abook) {
			inner = (
				<NotFoundErrorExplainer
					title="Given ABook was not found"
					buttonTargetPath={abookLibraryListPath}
					buttonText="Go to list"
				/>
			)
		} else {
			inner = (
				<ABookView
					abook={abook}
					onAddFiles={async files => {
						taskRunner.putTask({
							metadata: {
								group: GTaskGroupImpl.ABOOK,
								abookLockType: "write",
							},
							task: async () => {
								let i = 0
								for (const f of files) {
									try {
										const fileId = generateUUID()

										const fileList =
											await collectAsyncIterable(
												abook.files.keys(),
											)

										await abook.files.setFile(fileId, f, {
											type: ABookFileMetadataType.PLAYABLE_FILE,
											fileName: f.name,
											metadataLoadingResult: null,
											ordinalNumber: fileList.length + i,
										})
									} finally {
										i++
									}
								}

								refetch()
							},
						})
					}}
					onPlay={() => {
						dispatch(
							setWTPPlaylist({
								type: WTPPlaylistMetadataType.ABOOK,
								abookId: abook.id,
							}),
						)

						dispatch(setIsPlayingWhenReady(true))
					}}
					onFileDelete={id => {
						taskRunner.putTask({
							metadata: {
								group: GTaskGroupImpl.ABOOK,
								abookLockType: "write",
							},
							task: async ctx => {
								if (!ctx.claim.isValid) return

								try {
									const f = await abook.files.getMetadata(id)
									if (!f) {
										return
									}

									await abook.files.delete(id)

									dispatch(
										addFlashMessage(
											createFlashMessage({
												message:
													trans.flash.abookFileRemoveSuccessFlash(
														abook.data.metadata
															.title,
														f.fileName ?? `#${id}`,
													),
											}),
										),
									)
								} finally {
									refetch()
								}
							},
						})
					}}
					onDelete={() => {
						taskRunner.putTask({
							metadata: {
								group: GTaskGroupImpl.ABOOK,
								abookLockType: "write",
							},
							task: async ctx => {
								if (!ctx.claim.isValid) return

								try {
									await abook.delete()
									dispatch(
										addFlashMessage(
											createFlashMessage({
												message:
													trans.flash.abookRemoveSuccessFlash(
														abook.data.metadata
															.title,
													),
											}),
										),
									)
								} finally {
									refetch()
								}
							},
						})
					}}
				/>
			)
		}
	}

	return <PageContainer>{inner}</PageContainer>
}

export default ABookViewPage
