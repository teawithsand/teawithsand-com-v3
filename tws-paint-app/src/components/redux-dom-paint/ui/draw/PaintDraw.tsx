import React, { useEffect, useMemo } from "react"
import { Provider } from "react-redux"

import PrimPaintSceneMutation from "@app/components/redux-dom-paint/defines/PrimPaintSceneMutation"
import { setInitialMutations } from "@app/components/redux-dom-paint/redux/paintActions"
import { createPaintStore } from "@app/components/redux-dom-paint/redux/redux"
import PaintDrawDisplay from "@app/components/redux-dom-paint/ui/draw/PaintDrawDisplay"

const PaintDraw = (props: { initialMutations?: PrimPaintSceneMutation[] }) => {
	const store = useMemo(() => {
		return createPaintStore()
	}, [])

	useEffect(() => {
		store.dispatch(
			setInitialMutations([
				{
					type: "push-layer",
					data: {
						elements: [],
						metadata: {
							isHidden: false,
							name: "l0",
						},
					},
				},
			]),
		)
		// store.dispatch(setInitialMutations(props.initialMutations ?? []))
	}, [props.initialMutations])

	return (
		<Provider store={store}>
			<PaintDrawDisplay />
		</Provider>
	)
}

export default PaintDraw
