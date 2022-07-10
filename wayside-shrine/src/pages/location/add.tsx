import React, { useEffect } from "react"

import PageContainer from "@app/components/layout/PageContainer"

import { Button, Modal } from "tws-common/ui"
import { useDialogManager } from "tws-common/ui/dialog"

const LocationAddPage = () => {
	const dm = useDialogManager()

	useEffect(() => {
		dm.showDialog<void>(({ resolve }) => {
			const onClose = () => {
				resolve()
			}
			return (
				<Modal show={true} size="lg" fullscreen="lg" onHide={onClose}>
					<Modal.Header closeButton></Modal.Header>
					<Modal.Body>Ima modal man</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={onClose}>
							Close
						</Button>
						<Button variant="primary" onClick={onClose}>
							Save Changes
						</Button>
					</Modal.Footer>
				</Modal>
			)
		})
			.then(console.log)
			.catch(console.error)
	}, [])

	return (
		<PageContainer>
			<main>NIY</main>
		</PageContainer>
	)
}

export default LocationAddPage
