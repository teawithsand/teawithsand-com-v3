import { useEffect, useState } from "react"

export const useIsSSR = () => {
	const [isServer, setIsServer] = useState(true)
	useEffect(() => {
		setIsServer(false)
	}, [])
	return isServer
}
