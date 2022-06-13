export const useGetParams = (): URLSearchParams =>
	new URLSearchParams(window.location.search)

export const useGetParamsObject = (): {
	[key: string]: string
} => Object.fromEntries(useGetParams())
