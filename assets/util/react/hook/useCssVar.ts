import { useEffect, useLayoutEffect, useMemo } from "react"

// Note: for now does not work due to CSP policy
export default <P extends Array<any>>(name: string, params: P): string => {
    return useMemo(() => getComputedStyle(document.documentElement).getPropertyValue(name), params)
}