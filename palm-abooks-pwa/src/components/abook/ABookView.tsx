import React, { useState } from "react"
import styled from "styled-components"

import AddFilesABookForm from "@app/components/abook/form/AddFilesABookForm"
import LoadingSpinner from "@app/components/shared/loading-spinner/LoadingSpinner"
import { ABookActiveRecord } from "@app/domain/abook/ABookStore"
import {
	ABookFileMetadata,
	ABookFileMetadataType,
} from "@app/domain/abook/typedef"
import { useAppTranslationSelector } from "@app/trans/AppTranslation"

import { LOG } from "tws-common/log/logger"
import { claimId, NS_DND_ID, NS_LOG_TAG } from "tws-common/misc/GlobalIDManager"
import Sortable from "tws-common/react/components/Sortable"
import { useQuery } from "tws-common/react/hook/query"
import { Button, ButtonGroup, Table } from "tws-common/ui"

const LOG_TAG = claimId(NS_LOG_TAG, "palm-abooks-pwa/abook-view")

const ElementsGrid = styled.div`
	display: grid;
	grid-auto-flow: row;
	gap: 1em;
`

const PageTitle = styled.h1`
	text-align: center;
`

const FileRow = styled.tr`
	font-weight: ${({ $isDragging }) => ($isDragging ? "bold" : "auto")};
`

const HidableButton = styled(Button)`
	${({ $isHidden }) =>
		$isHidden &&
		`
		display: none;
	`}
`

const ABookFilesDragAndDropId = claimId(
	NS_DND_ID,
	"palm-abooks-pwa/abook-view/drag-files",
)

type FileOrderEntry = {
	fileId: string
	ordinalNumber: number
}

const ABookView = (props: {
	abook: ABookActiveRecord
	onDelete?: () => void
	onFileDelete?: (id: string) => void
	onPlay?: () => void
	onAddFiles?: (files: File[]) => Promise<void>
	onReorderABookFiles?: (entries: FileOrderEntry[]) => void
}) => {
	const {
		abook,
		onDelete,
		onFileDelete,
		onPlay,
		onAddFiles,
		onReorderABookFiles,
	} = props
	const {
		data: { metadata, id },
	} = abook
	const trans = useAppTranslationSelector(t => t.library.abook)

	const explainFileType = (type: ABookFileMetadataType): string => {
		switch (type) {
			case ABookFileMetadataType.IMAGE:
				return "Image"
			case ABookFileMetadataType.PLAYABLE_FILE:
				return "Sound"
			case ABookFileMetadataType.PLAYABLE_URL:
				return "Remote sound"
			case ABookFileMetadataType.TXT_DESCRIPTION:
				return "Description"
			default:
				return "Unknown"
		}
	}

	const {
		error,
		data: abookFiles,
		status,
	} = useQuery(`abook/view/files/${id}`, async ({ signal }) => {
		try {
			const isAborted = () => signal?.aborted ?? false
			const files: {
				id: string
				metadata: ABookFileMetadata
			}[] = []
			for await (const k of abook.files.keys()) {
				if (isAborted()) break
				const m = await abook.files.getMetadata(k)
				if (!m) continue // shouldn't happen unless race condition

				files.push({
					id: k,
					metadata: m,
				})
			}

			files.sort(
				(a, b) => a.metadata.ordinalNumber - b.metadata.ordinalNumber,
			)

			return files
		} catch (e) {
			LOG.error(LOG_TAG, "Error while loading ABook files", e)
			throw e
		}
	})

	const [ephemeralABookFiles, setEphemeralABookFiles] = useState<
		typeof abookFiles | null
	>(null)

	let files = null
	if (status === "loading" || status === "idle") {
		files = <LoadingSpinner />
	} else if (status === "error") {
		files = <div>{JSON.stringify(error)}</div>
	} else if (status === "success") {
		// TODO(teawithsand): implement files panel + operations for each file like force metadata load
		//  reading MIME/manually setting disposition/delete and other stuff
		files = (
			<Table hover striped bordered>
				<thead>
					<tr>
						<td>No.</td>
						<td>Name/URL</td>
						<td>Type</td>
						<td>Actions</td>
					</tr>
				</thead>
				<Sortable
					dragAndDropDataIdentifier={ABookFilesDragAndDropId}
					elements={ephemeralABookFiles ?? abookFiles}
					onElementsChange={newABookFilesOrder => {
						setEphemeralABookFiles(newABookFilesOrder)
					}}
					renderParent={({ onRef, children }) => (
						<tbody ref={onRef}>{children}</tbody>
					)}
					renderElement={({ item: f, onRef, isDragging }) => {
						return (
							<FileRow ref={onRef} $isDragging={isDragging}>
								<td>{f.metadata.ordinalNumber + 1}</td>
								<td>{f.metadata.fileName}</td>
								<td>{explainFileType(f.metadata.type)}</td>
								<td>
									<ButtonGroup>
										<Button
											onClick={
												onFileDelete
													? () => {
															onFileDelete(f.id)
													  }
													: undefined
											}
											variant="danger"
										>
											Delete File
										</Button>
									</ButtonGroup>
								</td>
							</FileRow>
						)
					}}
				/>
			</Table>
		)
	}

	return (
		<ElementsGrid>
			<PageTitle>ABook details: {metadata.title}</PageTitle>
			<div>
				<Table striped bordered hover>
					<tbody>
						<tr>
							<td>Title</td>
							<td>{metadata.title}</td>
						</tr>
						<tr>
							<td>Description</td>
							<td>{metadata.description}</td>
						</tr>
						<tr>
							<td>Actions</td>
							<td>
								<ButtonGroup>
									<Button onClick={onDelete} variant="danger">
										Delete ABook
									</Button>
									<Button onClick={onPlay} variant="success">
										Play ABook
									</Button>
								</ButtonGroup>
							</td>
						</tr>
					</tbody>
				</Table>
			</div>
			<div>
				<h3>ABook Files(use drag-and-drop to reorder)</h3>
			</div>

			<div>{files}</div>
			<HidableButton
				$isHidden={!ephemeralABookFiles}
				onClick={() => {
					if (ephemeralABookFiles && onReorderABookFiles) {
						const results: FileOrderEntry[] =
							ephemeralABookFiles.map((v, i) => ({
								fileId: v.id,
								ordinalNumber: i,
							}))

						onReorderABookFiles(results)
					}
				}}
			>
				Commit file order changes
			</HidableButton>

			<h3>Add new files</h3>

			<AddFilesABookForm
				onSubmit={async data => {
					if (onAddFiles && data.files.length > 0) {
						await onAddFiles(data.files)
					}
				}}
			/>
		</ElementsGrid>
	)
}

export default ABookView
