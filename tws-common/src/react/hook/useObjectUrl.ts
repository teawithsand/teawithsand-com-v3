import { useEffect, useRef } from "react"
import { requireNoSSR } from "tws-common/ssr"

/**
 * Hook, which returns reference to ref, which contains object URL for specified data.
 * URL is revoked, once src is changed or component is unmounted.
 */
export default (
	src: Blob | MediaSource,
): {
	readonly current: string | null
} => {
	requireNoSSR()
	const ref = useRef<string | null>(null)

	useEffect(() => {
		const url = URL.createObjectURL(src)
		ref.current = url
		return () => {
			URL.revokeObjectURL(url)
		}
	}, [src])

	return ref
}
