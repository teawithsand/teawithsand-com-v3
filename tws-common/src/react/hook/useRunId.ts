import { useCallback, useState } from "react"

/**
 * Uses unique identifier, which can be changed with method from 2nd argument.
 * It can be used to restart useEffect callbacks of react.
 */
export const useRunId = (): [number, () => void] => {
	const [id, setId] = useState(-Number.MAX_SAFE_INTEGER)
	const restart = useCallback(() => setId(id + 1), [id])
	return [id, restart]
}
