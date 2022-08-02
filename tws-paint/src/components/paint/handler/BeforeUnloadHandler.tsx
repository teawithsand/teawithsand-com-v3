import React, { useEffect } from "react"

export const BeforeUnloadHandler = () => {
	useEffect(() => {
		const beforeUnload = (e: any) => {
			e.preventDefault()
			return (e.returnValue =
				"Any unsaved work may be lost. Make sure you've saved your drawing.")
		}
		window.addEventListener("beforeunload", beforeUnload, { capture: true })
		return () => {
			window.removeEventListener("beforeunload", beforeUnload, {
				capture: true,
			})
		}
	}, [])
	return <></>
}
