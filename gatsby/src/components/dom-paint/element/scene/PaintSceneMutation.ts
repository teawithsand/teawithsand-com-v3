import PaintElement from "@app/components/dom-paint/element/PaintElement"
import { PaintLayerMetadata } from "@app/components/dom-paint/element/scene/PaintLayer"

type LayerMutation =
	| {
			type: "drop-layer"
			index: number
	  }
	| {
			type: "push-layer"
			beforeIndex: number
			metadata: PaintLayerMetadata
			elements: PaintElement[]
	  }
	| {
			type: "move-layer"
			index: number
			beforeIndex?: number | undefined
	  }
	| {
			type: "set-layer-metadata"
			index: number
			metadata: PaintLayerMetadata
	  }

type ElementMutation =
	| {
			type: "push-layer-elements"
			layerIndex: number
			beforeElementIndex?: number | undefined
			elements: PaintElement[]
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
			beforeDestinationElementIndex: number
	  }

type PaintSceneMutation = LayerMutation | ElementMutation

export default PaintSceneMutation
