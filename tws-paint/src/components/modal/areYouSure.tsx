import React, { ReactNode, useEffect, useRef, useState } from "react"

import { useAppTranslationSelector } from "@app/trans/AppTranslation"

import { simpleSleep } from "tws-common/lang/sleep"
import { DialogManager } from "tws-common/react/components/dialog"
import { Button, Modal } from "tws-common/ui"

export type AreYouSureModalOptions = {
	title?: string
	message?: string | (ReactNode & {})
	confirmLabel?: string
	cancelLabel?: string
}

export const AreYouSureModal = (
	props: {
		onConfirm: () => void
		onExit: () => void
	} & AreYouSureModalOptions,
) => {
	const { onConfirm, onExit } = props
	const [show, setShow] = useState(true)

	const trans = useAppTranslationSelector(s => s.common.dialog.areYouSure)

	const title = props.title ?? trans.defaultTitle
	const message = props.message ?? trans.defaultMessage
	const confirmLabel = props.confirmLabel ?? trans.defaultConfirmLabel
	const cancelLabel = props.cancelLabel ?? trans.defaultCancelLabel

	const isDisplayed = useRef(true)
	const handledClose = useRef(false)
	useEffect(() => {
		isDisplayed.current = true
		return () => {
			isDisplayed.current = false
		}
	}, [])

	const handleClose = (confirm: boolean) => {
		if (!handledClose.current) {
			handledClose.current = true

			const procedure = async () => {
				if (isDisplayed.current) {
					setShow(false)
					await simpleSleep(300)
					if (confirm) {
						onConfirm()
					} else {
						onExit()
					}
				}
			}

			procedure()
		}
	}

	return (
		<Modal show={show} onHide={() => handleClose(false)}>
			<Modal.Header closeButton>
				<Modal.Title>{title}</Modal.Title>
			</Modal.Header>
			<Modal.Body>{message}</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={() => handleClose(false)}>
					{cancelLabel}
				</Button>
				<Button variant="primary" onClick={() => handleClose(true)}>
					{confirmLabel}
				</Button>
			</Modal.Footer>
		</Modal>
	)
}

export const showAreYouSureModal = (
	dm: DialogManager,
	options?: {
		displayOptions?: AreYouSureModalOptions
	},
) => {
	return dm.showDialog<boolean>(({ resolve }) => (
		<AreYouSureModal
			{...(options?.displayOptions ?? {})}
			onConfirm={() => resolve(true)}
			onExit={() => resolve(false)}
		/>
	))
}
