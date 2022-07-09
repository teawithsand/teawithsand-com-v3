import { isSSR } from "tws-common/ssr"

export const downloadUrl = (url: string, filename: string) => {
	if (isSSR()) return

	const a = document.createElement("a")
	a.style.display = "none"
	a.href = url
	a.download = filename
	document.body.appendChild(a)
	a.click()
	setTimeout(() => {
		document.body.removeChild(a)
	}, 5000)
}

export const downloadObject = (
	obj: Blob | File | MediaSource,
	filename: string,
) => {
	if (isSSR()) return

	const a = document.createElement("a")
	a.style.display = "none"
	const url = URL.createObjectURL(obj)
	a.href = url
	a.download = filename
	document.body.appendChild(a)
	a.click()
	setTimeout(() => {
		document.body.removeChild(a)
		URL.revokeObjectURL(url)
	}, 5000)
}
