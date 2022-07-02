import React from "react"
import { useDispatch } from "react-redux"

import { playerUiSetShownModal } from "@app/domain/redux/playerUi"
import { usePlayerUiSelector } from "@app/domain/redux/store"
import { setWTPPlaylist } from "@app/domain/wtp/actions"
import { WTPPlaylistMetadataType } from "@app/domain/wtp/playlist"
import { WTPSource, WTPSourceType } from "@app/domain/wtp/source"
import { useAppTranslationSelector } from "@app/trans/AppTranslation"
import { audioMimesAndExtensions } from "@app/util/fileTypes"

import { generateUUID } from "tws-common/lang/uuid"
import { setIsPlayingWhenReady } from "tws-common/player/bfr/actions"
import { Button, Form, Modal } from "tws-common/ui"

const PickLocalFilesModal = () => {
	const dispatch = useDispatch()
	const genericTrans = useAppTranslationSelector(s => s.generic)
	const dialogTrans = useAppTranslationSelector(
		s => s.player.pickLocalFilesModal,
	)
	const show = usePlayerUiSelector(s => s.shownModal === "pick-local-files")

	const onHide = () => {
		dispatch(playerUiSetShownModal(null))
	}

	return (
		<Modal fullscreen={true} show={show} centered onHide={onHide}>
			<Modal.Header closeButton>
				<Modal.Title>{dialogTrans.title}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form
					onSubmit={(e: any) => {
						e.preventDefault()
						return false
					}}
				>
					<Form.Group>
						<Form.Label>{dialogTrans.fileFieldLabel}</Form.Label>
						<Form.Control
							accept={audioMimesAndExtensions.join(",")}
							type="file"
							value={undefined}
							multiple
							onChange={(e: any) => {
								// TODO(teawithsand): check if it works on older browsers, works on state-of-art ff
								const files: File[] = [
									...(e.target.files || []),
								]
								files.sort((a, b) =>
									a.name.localeCompare(b.name),
								)

								dispatch(
									setWTPPlaylist({
										type: WTPPlaylistMetadataType.ANY_SOURCES,
										sources: files.map(
											(f): WTPSource => ({
												type: WTPSourceType.BLOB_SOURCE,
												blob: f,
												preloadedMetadata: null,
												fileName: f.name,
												id: generateUUID(),
											}),
										),
									}),
								)
								dispatch(setIsPlayingWhenReady(true))

								onHide()
							}}
						/>
					</Form.Group>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={onHide}>{genericTrans.modalClose}</Button>
			</Modal.Footer>
		</Modal>
	)
}

export default PickLocalFilesModal
