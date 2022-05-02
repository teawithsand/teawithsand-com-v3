import { setInitialMutations } from "@app/components/redux-dom-paint/ui/redux/PaintActions"
import PrimPaintSceneMutation from "@app/components/redux-dom-paint/ui/redux/PrimPaintSceneMutation"
import { createPaintStore } from "@app/components/redux-dom-paint/ui/redux/redux"
import React, { useEffect, useMemo } from "react"
import { Provider } from "react-redux"

export default (props: { initialMutations?: PrimPaintSceneMutation[] }) => {
	const store = useMemo(() => {
		return createPaintStore()
	}, [])

	useEffect(() => {
		store.dispatch(setInitialMutations(props.initialMutations ?? []))
	}, [props.initialMutations])

	return <Provider store={store}>{/*<PaintDrawDisplay />*/}</Provider>
}
