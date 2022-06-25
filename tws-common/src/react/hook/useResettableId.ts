import { useState } from "react"
import { generateUUID } from "tws-common/lang/uuid"

/**
 * Useful, when one wants to manually trigger useEffect on some circumstances.i
 */
export const useResettableId = (): [string, () => void] => {
	const [id, setId] = useState(() => generateUUID())

	return [
		id,
		() => {
			setId(generateUUID())
		},
	]
}
