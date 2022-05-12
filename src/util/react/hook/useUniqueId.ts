import { useMemo } from "react"

import { generateUUID } from "@app/util/lang/uuid"

const useUniqueId = () => {
	return useMemo(() => generateUUID(), [])
}

export default useUniqueId
