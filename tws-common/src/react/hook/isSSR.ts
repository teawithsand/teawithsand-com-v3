import { useEffect, useState } from "react"

/**
 * Returns true, if SSR is enabled in SSR-capable manner.
 */
export const useIsSSR = () => {
	const [isServer, setIsServer] = useState(true)
	useEffect(() => {
		setIsServer(false)
	}, [])
	return isServer
}
