import { Context, ReactNode, useContext, useState } from "react"
import { latePromise } from "tws-common/lang/latePromise"

export type DialogRenderProps<T> = {
	resolve: (data: T) => void
	reject: (e: any) => void
}

export type DialogRender<T> = (renderProps: DialogRenderProps<T>) => ReactNode

export type DialogManager = {
	showDialog<T>(render: DialogRender<T>): Promise<T>
}

export type DialogManagerContext = Context<DialogManager>

export const useDialogManager = (ctx: DialogManagerContext): DialogManager =>
	useContext(ctx)

export const useProvideDialogManager = (): [
	DialogManager,
	(() => ReactNode) | null,
] => {
	const [finalRenderStack, setFinalRenderStack] = useState<
		(() => ReactNode)[]
	>([])

	return [
		{
			showDialog: <T>(innerRender: DialogRender<T>) => {
				const [promise, resolve, reject] = latePromise<T>()

				let resolved = false

				setFinalRenderStack([
					...finalRenderStack,
					() =>
						innerRender({
							reject: e => {
								if (!resolved) {
									// displayed one (AKA the one, which can be resolved is always first one)
									const newStack = [...finalRenderStack]
									newStack.shift()

									resolved = true
									setFinalRenderStack(newStack)
									reject(e)
								}
							},
							resolve: (data: T) => {
								if (!resolved) {
									// displayed one (AKA the one, which can be resolved is always first one)
									const newStack = [...finalRenderStack]
									newStack.shift()

									resolved = true
									setFinalRenderStack(newStack)
									resolve(data)
								}
							},
						}),
				])

				return promise
			},
		},
		finalRenderStack.length > 0 ? finalRenderStack[0] : null,
	]
}
