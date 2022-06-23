import React from "react"
import { Toast as ToastComponent, ToastContainer } from "react-bootstrap"
import { Toast } from "tws-common/ui/toast/toast"

const ToastDisplay = (props: {
	toasts: Toast[]
	onClose: (id: string) => void
}) => {
	const { toasts, onClose } = props
	return (
		<ToastContainer position="top-start">
			{toasts.map(v => (
				<ToastComponent
					key={v.id}
					onClose={() => {
						onClose(v.id)
					}}
					autohide={v.livenessSeconds !== null}
					delay={v.livenessSeconds ?? undefined}
				>
					<ToastComponent.Header>
						<strong className="me-auto">{v.title}</strong>
					</ToastComponent.Header>
					<ToastComponent.Body>{v.message}</ToastComponent.Body>
				</ToastComponent>
			))}
		</ToastContainer>
	)
}

export default ToastDisplay
