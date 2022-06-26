import React from "react"
import { useDispatch } from "react-redux"
import styled from "styled-components"

import LoadingSpinner from "@app/components/shared/loading-spinner/LoadingSpinner"
import { ABookActiveRecord } from "@app/domain/abook/ABookStore"
import {
	ABookFileMetadata,
	ABookFileMetadataType,
} from "@app/domain/abook/typedef"
import { setWTPPlaylist } from "@app/domain/wtp/actions"
import { WTPPlaylistMetadataType } from "@app/domain/wtp/playlist"

import { LOG } from "tws-common/log/logger"
import { claimId, NS_LOG_TAG } from "tws-common/misc/GlobalIDManager"
import { setIsPlayingWhenReady } from "tws-common/player/bfr/actions"
import { useQuery } from "tws-common/react/hook/query"
import { usePendingPromise } from "tws-common/react/hook/usePendingPromise"
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

/*
const FancyTable = styled.div`
	display: grid;
	grid-auto-flow: row;
	gap: 1em;
	border: 1px solid rgba(0, 0, 0, 0.7);

	& > *:nth-child(2n) {
		background-color: rgba(0, 0, 0, 0.3);
	}
`

const FancyTableTitle = styled.div`
	font-size: 0.8em;
	color: rgba(0, 0, 0, 0.7);
`

const FancyTableContent = styled.div``

const FancyTableRow = styled.div``
*/

const ABookView = (props: { abook: ABookActiveRecord }) => {
	const { abook } = props
	const {
		data: { metadata, id },
	} = abook

	const dispatch = useDispatch()

	const [taskData, setTaskData] = usePendingPromise()

	const explainFileType = (type: ABookFileMetadataType): string => {
		switch (type) {
			case ABookFileMetadataType.IMAGE:
				return "Image"
			case ABookFileMetadataType.PLAYABLE:
				return "Sound"
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
				key: string
				metadata: ABookFileMetadata
			}[] = []
			for await (const k of abook.files.keys()) {
				if (isAborted()) break
				const m = await abook.files.getMetadata(k)
				if (!m) continue // shouldn't happen unless race condition

				files.push({
					key: k,
					metadata: m,
				})
			}

			return files
		} catch (e) {
			LOG.error(LOG_TAG, "Error while loading ABook files", e)
			throw e
		}
	})

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
						<td>Name</td>
						<td>Type</td>
						<td>Actions</td>
					</tr>
				</thead>
				<tbody>
					{abookFiles.map((f, i) => (
						<tr key={f.key}>
							<td>{i + 1}</td>
							<td>{f.metadata.fileName}</td>
							<td>{explainFileType(f.metadata.type)}</td>
							<td>
								<ButtonGroup>
									<Button onClick={() => {}} variant="danger">
										Delete File
									</Button>
								</ButtonGroup>
							</td>
						</tr>
					))}
				</tbody>
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
							<td>Operations</td>
							<td>
								<ButtonGroup>
									<Button href="#" variant="danger">
										Delete ABook
									</Button>
									<Button
										onClick={() => {
											dispatch(
												setWTPPlaylist({
													type: WTPPlaylistMetadataType.ABOOK,
													abookId: abook.id,
												}),
											)

											dispatch(
												setIsPlayingWhenReady(true),
											)
											// TODO(teawithsand): navigate to player here
										}}
										variant="success"
									>
										Play ABook
									</Button>
								</ButtonGroup>
							</td>
						</tr>
					</tbody>
				</Table>
			</div>
			<div>
				<h3>ABook Files</h3>
			</div>

			<div>{files}</div>
		</ElementsGrid>
	)
}

export default ABookView
