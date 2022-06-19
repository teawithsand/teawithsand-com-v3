import { useEffect, useRef } from "react"
import { DocumentTitleHelper } from "tws-common/webapi/document/DocumentTitleHelper"

export const useDocumentTitleClaim = (priority = 0, title: string) => {
	const claim = useRef<ReturnType<
		typeof DocumentTitleHelper.createClaim
	> | null>(null)
	useEffect(() => {
		const free = () => {
			if (claim.current !== null) {
				claim.current.release()
				claim.current = null
			}
		}
		free()
		claim.current = DocumentTitleHelper.createClaim(priority, title)

		return () => {
			free()
		}
	}, [priority])

	useEffect(() => {
		if (claim.current) {
			claim.current.setTitle(title)
		}
	}, [title])
}
