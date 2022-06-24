import React from "react"
import { Toast as ToastComponent, ToastContainer } from "react-bootstrap"
import { Toast } from "tws-common/ui/toast/toast"

const ToastDisplay = (props: {
	toasts: Toast[]
	onClose: (id: string) => void
}) => {
	const { toasts, onClose } = props
	// TODO(teawithsand): limit amount of displayed toasts ,especially when screen is small.
	return (
		<ToastContainer position="bottom-center" className="mb-3">
			{toasts.map(v => (
				<ToastComponent
					key={v.id}
					onClose={() => {
						onClose(v.id)
					}}
					autohide={v.livenessSeconds !== null}
					delay={
						Math.round((v.livenessSeconds ?? 0) * 1000) || undefined
					}
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
