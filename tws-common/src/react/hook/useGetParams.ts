import { requireNoSSR } from "tws-common/ssr"

export const useGetParams = (): URLSearchParams => {
	requireNoSSR()
	return new URLSearchParams(window.location.search)
}

export const useGetParamsObject = (): {
	[key: string]: string
} => Object.fromEntries(useGetParams())
