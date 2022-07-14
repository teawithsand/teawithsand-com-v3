import { useMemo } from "react"
import { generateUUID } from "tws-common/lang/uuid"

/**
 * This hook SHOULD NOT be used with SSR, since it may cause different results when rendering on server and on client.
 */
const useUniqueId = () => {
	// requireNoSSR() // may break some code for now, but should be included in future
	return useMemo(() => generateUUID(), [])
}

export default useUniqueId
