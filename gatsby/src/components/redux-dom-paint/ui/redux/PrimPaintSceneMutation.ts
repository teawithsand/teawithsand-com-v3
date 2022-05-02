import { PrimPaintElement } from "@app/components/redux-dom-paint/ui/redux/PrimPaintElement"
import {
	PrimPaintLayer,
	PrimPaintLayerData,
	PrimPaintLayerMetadata,
	PrimPaintScene,
} from "@app/components/redux-dom-paint/ui/redux/PrimPaintScene"
import { generateUUID } from "@app/util/lang/uuid"
import produce from "immer"
import { WritableDraft } from "immer/dist/internal"

type PrimLayerMutation =
	| {
			type: "drop-layer"
			layerIndex?: number | undefined // if undefined, drop last layer(AKA pop from stack)
	  }
	| {
			type: "push-layer"
			beforeLayerIndex?: number | undefined
			data: PrimPaintLayerData
	  }
	| {
			type: "move-layer"
			index: number
			beforeIndex?: number | undefined // if undefined, move to the top
	  }
	| {
			type: "set-layer-metadata"
			layerIndex: number
			metadata: PrimPaintLayerMetadata
	  }

type PrimElementMutation =
	| {
			type: "push-layer-elements"
			layerIndex: number
			beforeElementIndex?: number | undefined // if undefined, push at the end
			elements: PrimPaintElement[]
	  }
	| {
			// This mutation is noop if fromElementIndex === toElementIndex
			type: "drop-layer-elements"
			layerIndex: number
			fromElementIndex?: number | undefined // if undefined, points to 0 index; inclusive index
			toElementIndex?: number | undefined // if undefined, points to last element's index; exclusive index
	  }
	| /*
	{
			// note: this mutation shouldn't be used
			// with other app components
			// it was created because
			// it was impossible to express revert mutation of
			// drop-layer-elements as push-layer-elements
			type: "push-layer-elements-targets"
			layerIndex: number
			entries: {
				beforeIndex: number
				element: PrimPaintElement
			}[]
	  }
	| {
			type: "drop-layer-elements-targets"
			layerIndex: number
			elementIndices: number[]
	  }
	| 
	*/ {
			type: "move-layer-element"
			sourceLayerIndex: number
			sourceElementIndex: number
			destinationLayerIndex: number
			beforeDestinationElementIndex?: number | undefined
	  }

type PrimPaintSceneMutation =
	| PrimLayerMutation
	| PrimElementMutation
	| {
			type: "noop" // just noop
	  }

export default PrimPaintSceneMutation

export class PaintSceneMutationApplyError extends Error {
	constructor(message: string) {
		super(message)
		this.name = "PaintSceneMutationApplyError"
	}
}

const ensureSceneHasLayer = (
	s: WritableDraft<PrimPaintScene>,
	i: number
): WritableDraft<PrimPaintLayer> => {
	// TODO(teawithsand): make sure that this function is not needed, since it's not compatible with reversing mutations

	if (i < 0 || i >= s.layers.length)
		throw new PaintSceneMutationApplyError(`Can't find layer with index ${i}`)
	return s.layers[i]
}

export const applyMutationOnDraft = (
	scene: WritableDraft<PrimPaintScene>,
	m: PrimPaintSceneMutation
) => {
	if (m.type === "drop-layer") {
		if (m.layerIndex === undefined && scene.layers.length === 0) {
			return // noop
		}
		const index = m.layerIndex ?? scene.layers.length - 1
		ensureSceneHasLayer(scene, index)

		if (m.layerIndex === scene.layers.length - 1) {
			scene.layers.pop()
		} else {
			scene.layers.splice(index, 1)
		}
	} else if (m.type === "push-layer") {
		const layer = {
			id: generateUUID(),
			elements: m.data.elements,
			metadata: m.data.metadata,
		}
		scene.layers.splice(m.beforeLayerIndex ?? scene.layers.length, 0, layer)
	} else if (m.type === "set-layer-metadata") {
		ensureSceneHasLayer(scene, m.layerIndex)
		scene.layers[m.layerIndex].metadata = m.metadata
	} else if (m.type === "move-layer") {
		ensureSceneHasLayer(scene, m.index)
		const beforeIndex = m.beforeIndex ?? scene.layers.length
		if (m.index === beforeIndex) {
			// noop
		} else if (m.index > beforeIndex) {
			const elements = scene.layers.splice(m.index, 1)
			scene.layers.splice(beforeIndex, 0, ...elements)
		} else if (m.index < beforeIndex) {
			const elements = scene.layers.splice(m.index, 1)
			scene.layers.splice(beforeIndex - 1, 0, ...elements)
		} else {
			throw new Error("unreachable code")
		}
	} /*
	 else if (m.type === "push-layer-elements-targets") {
		const l = ensureSceneHasLayer(scene, m.layerIndex)
		const map = new Map<number, PrimPaintElement>()

		for (const t of m.entries) {
			map.set(t.beforeIndex, t.element)
		}

		l.elements = l.elements.flatMap((entry, i) => {
			const element = map.get(i)
			if (element) {
				return [element, entry]
			} else {
				return [entry]
			}
		})
	} 
	*/ else if (m.type === "push-layer-elements") {
		const l = ensureSceneHasLayer(scene, m.layerIndex)
		l.elements.splice(
			m.beforeElementIndex ?? l.elements.length,
			0,
			...m.elements
		)
	} /*
	 else if (m.type === "drop-layer-elements-targets") {
		const l = ensureSceneHasLayer(scene, m.layerIndex)
		const idxSet = new Set(m.elementIndices)
		l.elements = l.elements.filter((_, i) => !idxSet.has(i))
	}*/ else if (m.type === "drop-layer-elements") {
		const l = ensureSceneHasLayer(scene, m.layerIndex)
		const fromIndex = m.fromElementIndex ?? 0
		const toIndex = m.toElementIndex ?? l.elements.length
		if (fromIndex > toIndex) {
			throw new PaintSceneMutationApplyError(
				`Can't drop from ${fromIndex} to ${toIndex}, from index > to index`
			)
		}
		if (fromIndex !== toIndex) {
			l.elements.splice(fromIndex, toIndex - fromIndex)
		}
	} else if (m.type === "move-layer-element") {
		const sl = ensureSceneHasLayer(scene, m.sourceLayerIndex)
		const dl = ensureSceneHasLayer(scene, m.destinationLayerIndex)
		if (m.sourceLayerIndex === m.destinationLayerIndex) {
			const beforeIndex = m.beforeDestinationElementIndex ?? dl.elements.length
			const index = m.sourceElementIndex
			const arr = sl.elements
			if (index === beforeIndex) {
				// noop
			} else if (index > beforeIndex) {
				const elements = arr.splice(index, 1)
				arr.splice(beforeIndex, 0, ...elements)
			} else if (index < beforeIndex) {
				const elements = arr.splice(index, 1)
				arr.splice(beforeIndex - 1, 0, ...elements)
			} else {
				throw new Error("unreachable code")
			}
		} else {
			// no hard cases with index correction if do are not targeting the same array

			const elementArray = sl.elements.splice(m.sourceElementIndex, 1)
			dl.elements.splice(
				m.beforeDestinationElementIndex ?? dl.elements.length,
				0,
				...elementArray
			)
		}
	} else if (m.type === "noop") {
		// noop
	} else {
		throw new Error(`Unknown mutation ${(m as unknown as any).type}`)
	}
}

export const applyMutation = (
	scene: PrimPaintScene,
	m: PrimPaintSceneMutation
) => produce(scene, draft => applyMutationOnDraft(draft, m))

export const inverseMutation = (
	scene: PrimPaintScene,
	m: PrimPaintSceneMutation
): PrimPaintSceneMutation => {
	if (m.type === "push-layer") {
		return {
			type: "drop-layer",
			layerIndex: m.beforeLayerIndex,
		}
	} else if (m.type === "drop-layer") {
		const index = m.layerIndex ?? scene.layers.length - 1

		return {
			type: "push-layer",
			data: scene.layers[index], // layer is valid layer data, although it can be shrunk for gc
			beforeLayerIndex: index,
		}
	} else if (m.type === "move-layer") {
		const index = m.index
		const beforeIndex = m.beforeIndex ?? scene.layers.length

		if (index === beforeIndex) {
			return { type: "noop" }
		} else if (index > beforeIndex) {
			return {
				type: "move-layer",
				beforeIndex: index + 1,
				index: beforeIndex,
			}
		} else {
			return {
				type: "move-layer",
				beforeIndex: index,
				index: beforeIndex - 1,
			}
		}
	} else if (m.type === "push-layer-elements") {
		/*
		let elementIndices = []
		const { beforeElementIndex } = m
		if (beforeElementIndex === undefined) {
			const offset =
				scene.layers[m.layerIndex].elements.length - m.elements.length
			elementIndices = [...Array(m.elements.length).keys()].map(v => v + offset)
		} else {
			elementIndices = [...Array(m.elements.length).keys()].map(
				v => v + beforeElementIndex
			)
		}*/

		const srcIndex =
			m.beforeElementIndex ?? scene.layers[m.layerIndex].elements.length
		const dstIndex = srcIndex + m.elements.length

		return {
			type: "drop-layer-elements",
			layerIndex: m.layerIndex,
			fromElementIndex: srcIndex,
			toElementIndex: dstIndex,
		}
	} else if (m.type === "drop-layer-elements") {
		const l = scene.layers[m.layerIndex]
		return {
			type: "push-layer-elements",
			layerIndex: m.layerIndex,
			elements: l.elements.slice(
				m.fromElementIndex ?? 0,
				m.toElementIndex ?? l.elements.length
			),
			beforeElementIndex: m.fromElementIndex ?? 0,
		}
	} else if (m.type === "move-layer-element") {
		if (m.sourceLayerIndex === m.destinationLayerIndex) {
			const index = m.sourceElementIndex
			const beforeIndex = m.beforeDestinationElementIndex ?? scene.layers[m.sourceLayerIndex].elements.length
	
			if (index === beforeIndex) {
				return { type: "noop" }
			} else if (index > beforeIndex) {
				return {
					type: "move-layer-element",
					destinationLayerIndex: m.sourceLayerIndex,
					sourceLayerIndex: m.destinationLayerIndex,

					beforeDestinationElementIndex: index + 1,
					sourceElementIndex: beforeIndex,
				}
			} else {
				return {
					type: "move-layer-element",
					destinationLayerIndex: m.sourceLayerIndex,
					sourceLayerIndex: m.destinationLayerIndex,
					beforeDestinationElementIndex: index,
					sourceElementIndex: beforeIndex - 1,
				}
			}
		} else {
			return {
				type: "move-layer-element",
				destinationLayerIndex: m.sourceLayerIndex,
				sourceLayerIndex: m.destinationLayerIndex,
				sourceElementIndex:
					m.beforeDestinationElementIndex ??
					scene.layers[m.destinationLayerIndex].elements.length,
				beforeDestinationElementIndex: m.sourceElementIndex,
			}
		}
	} else if (m.type === "set-layer-metadata") {
		return {
			type: "set-layer-metadata",
			layerIndex: m.layerIndex,
			metadata: scene.layers[m.layerIndex].metadata,
		}
	} else if (m.type === "noop") {
		return {
			type: "noop",
		}
	} else {
		throw new Error(`undefined mutation type ${(m as unknown as any).type}`)
	}
}
