import React from "react"

import { useAppTranslationSelector } from "@app/trans/AppTranslation"

import { Button, Modal } from "tws-common/ui"

const AreYouSureModal = (props: {
	title?: string
	description?: string
	show: boolean
	onCancel: () => void
	onConfirm: () => void
}) => {
	const { title, description, show, onCancel, onConfirm } = props

	const trans = useAppTranslationSelector(t => t.oldCommon.sureModal)

	return (
		<Modal show={show} centered onHide={() => onCancel()}>
			<Modal.Header closeButton>
				<Modal.Title>Modal heading</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<h4>{title ?? trans.defaultTitle}</h4>
				<p>{description ?? trans.defaultDescription}</p>
				<Button onClick={() => onConfirm()} variant="success">
					{trans.confirm}
				</Button>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={() => onCancel()}>{trans.cancel}</Button>
			</Modal.Footer>
		</Modal>
	)
}

export default AreYouSureModal
