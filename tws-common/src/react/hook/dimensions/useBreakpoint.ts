import { useIsSSR } from "tws-common/react/hook/isSSR"
import { isSSR, requireNoSSR } from "tws-common/ssr"

import useWindowDimensions from "./useWindowDimensions"

// TODO(teawithsand): move breakpoint definitions and boundaries to

export type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "xxl"

export const BREAKPOINT_XS: Breakpoint = "xs"
export const BREAKPOINT_SM: Breakpoint = "sm"
export const BREAKPOINT_MD: Breakpoint = "md"
export const BREAKPOINT_LG: Breakpoint = "lg"
export const BREAKPOINT_XL: Breakpoint = "xl"
export const BREAKPOINT_XXL: Breakpoint = "xxl"

export const BREAKPOINT_BOUNDARIES = {
	[BREAKPOINT_XS]: 576,
	[BREAKPOINT_SM]: 768,
	[BREAKPOINT_MD]: 992,
	[BREAKPOINT_LG]: 1200,
	[BREAKPOINT_XL]: 1440,
	// above is breakpoint_XXL
}

export const BREAKPOINTS = [
	BREAKPOINT_XS,
	BREAKPOINT_SM,
	BREAKPOINT_MD,
	BREAKPOINT_LG,
	BREAKPOINT_XL,
	BREAKPOINT_XXL,
]

export const breakpointIndex = (breakpoint: Breakpoint): number =>
	BREAKPOINTS.indexOf(breakpoint)

const resolveBreakpointIndex = (width: number): number => {
	if (width < 576) {
		return 0
	} else if (width >= 576 && width < 768) {
		return 1
	} else if (width >= 768 && width < 992) {
		return 2
	} else if (width >= 992 && width < 1200) {
		return 3
	} else if (width >= 1200 && width < 1440) {
		return 4
	} /* if (width >= 1440) */ else {
		return 5
	}
}

// Note: static SSR checks are required here
// 	since dynamic one does first render with isSSR = true, which causes
//  some hooks not to be registered(ones, which do not work on SSR)
//  and react does not like that
export const useBreakpoint = (onSSR?: Breakpoint): Breakpoint => {
	if (typeof onSSR === "undefined") requireNoSSR()

	if (isSSR() && typeof onSSR !== "undefined") return onSSR

	const { width } = useWindowDimensions()
	return BREAKPOINTS[resolveBreakpointIndex(width)]
}

export const useBreakpointIndex = (onSSR?: number): number => {
	if (typeof onSSR === "undefined") requireNoSSR()

	if (isSSR() && typeof onSSR !== "undefined") return onSSR

	const { width } = useWindowDimensions()
	return resolveBreakpointIndex(width)
}
