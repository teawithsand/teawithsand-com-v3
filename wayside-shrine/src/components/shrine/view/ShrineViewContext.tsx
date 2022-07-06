import React from "react"

export type ShrineViewContextData = {
	isSmall: boolean
}

export const ShrineViewContext = React.createContext<ShrineViewContextData>({
    isSmall: false
})
