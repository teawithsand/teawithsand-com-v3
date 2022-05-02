import PaintSceneMutation from "@app/components/dom-paint/element/scene/PaintSceneMutation"
import PaintDrawDisplay from "@app/components/dom-paint/nui/draw/PaintDrawDisplay"
import {
	createPaintStore,
	setInitialMutations,
} from "@app/components/dom-paint/nui/redux/redux"
import React, { useEffect, useMemo } from "react"
import { Provider } from "react-redux"

export default (props: { initialMutations?: PaintSceneMutation[] }) => {
	const store = useMemo(() => {
		return createPaintStore()
	}, [])

	useEffect(() => {
		store.dispatch(setInitialMutations(props.initialMutations ?? []))
	}, [props.initialMutations])

	return (
		<Provider store={store}>
			<PaintDrawDisplay />
		</Provider>
	)
}
