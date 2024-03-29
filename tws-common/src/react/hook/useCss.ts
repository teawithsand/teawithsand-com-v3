import { useLayoutEffect } from "react"
import { requireNoSSR } from "tws-common/ssr"

// Note: for now does not work due to CSP policy
export default <P extends Array<any>>(css: string, params: P) => {
	requireNoSSR()

	useLayoutEffect(() => {
		//const nonce = (document.getElementById("cspnone") as HTMLInputElement | null | undefined)?.value
		const elem = document.createElement("style")
		elem.innerText = css
		// if (nonce) {
		//     elem.nonce = nonce
		// }

		document.body.appendChild(elem)
		return () => {
			document.body.removeChild(elem)
		}
	}, params)
}
