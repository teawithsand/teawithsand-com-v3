import { useMemo } from "react"
import { generateUUID } from "tws-common/lang/uuid"

const useUniqueId = () => {
	return useMemo(() => generateUUID(), [])
}

export default useUniqueId
