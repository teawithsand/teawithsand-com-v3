import { PrimPaintElement } from "@app/components/dom-paint/nui/redux/PrimPaintElement"
import {
	PrimPaintLayer,
	PrimPaintLayerData,
	PrimPaintLayerMetadata,
	PrimPaintScene,
} from "@app/components/dom-paint/nui/redux/PrimPaintScene"
import { generateUUID } from "@app/util/lang/uuid"
import produce from "immer"
import { WritableDraft } from "immer/dist/internal"

type PrimLayerMutation =
	| {
			type: "drop-layer"
			index: number
	  }
	| {
			type: "push-layer"
			beforeIndex?: number | undefined
			data: PrimPaintLayerData,
	  }
	| {
			type: "move-layer"
			index: number
			beforeIndex?: number | undefined // if undefined, move to the top
	  }
	| {
			type: "set-layer-metadata"
			index: number
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
			type: "drop-layer-elements"
			layerIndex: number
			elementIndices: number[]
	  }
	| {
			type: "move-layer-element"
			sourceLayerIndex: number
			sourceElementIndex: number
			destinationLayerIndex: number
			beforeDestinationElementIndex?: number | undefined
	  }

type PrimPaintSceneMutation = PrimLayerMutation | PrimElementMutation

export default PrimPaintSceneMutation

const ensureSceneHasLayer = (
	s: WritableDraft<PrimPaintScene>,
	i: number
): WritableDraft<PrimPaintLayer> => {
	const id = generateUUID()
	while (i >= s.layers.length) {
		s.layers.push({
			id: id,
			elements: [],
			metadata: {
				isHidden: false,
				name: `layer-${id}`,
			},
		})
	}

	return s.layers[i]
}

export const revertMutationOnDraft = (
	scene: WritableDraft<PrimPaintScene>,
	mutation: PrimPaintSceneMutation
) => {
	throw new Error("NIY")
}

export const revertMutation = (
	scene: PrimPaintScene,
	mutation: PrimPaintSceneMutation
) => produce(scene, draft => revertMutationOnDraft(draft, mutation))

export const applyMutationOnDraft = (
	scene: WritableDraft<PrimPaintScene>,
	m: PrimPaintSceneMutation
) => {
	if (m.type === "drop-layer") {
		ensureSceneHasLayer(scene, m.index)
		if (m.index === scene.layers.length - 1) {
			scene.layers.pop()
		} else {
			delete scene.layers[m.index]
		}
	} else if (m.type === "push-layer") {
		const layer = {
			id: generateUUID(),
			elements: m.data.elements,
			metadata: m.data.metadata,
		}
		scene.layers.splice(m.beforeIndex ?? scene.layers.length, 0, layer)
	} else if (m.type === "set-layer-metadata") {
		ensureSceneHasLayer(scene, m.index)
		scene.layers[m.index].metadata = m.metadata
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
	} else if (m.type === "push-layer-elements") {
		const l = ensureSceneHasLayer(scene, m.layerIndex)
		l.elements.splice(
			m.beforeElementIndex ?? l.elements.length,
			0,
			...m.elements
		)
	} else if (m.type === "drop-layer-elements") {
		const l = ensureSceneHasLayer(scene, m.layerIndex)
		const idxSet = new Set(m.elementIndices)
		l.elements = l.elements.filter((_, i) => !idxSet.has(i))
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
			// no hard cases with index correction if do not wea are not targeting the same array

			const elementArray = sl.elements.splice(m.sourceElementIndex, 1)
			dl.elements.splice(
				m.beforeDestinationElementIndex ?? dl.elements.length,
				0,
				...elementArray
			)
		}
	}
}

export const applyMutation = (
	scene: PrimPaintScene,
	m: PrimPaintSceneMutation
) => produce(scene, draft => applyMutationOnDraft(draft, m))
