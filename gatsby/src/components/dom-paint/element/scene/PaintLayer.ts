import PaintElement from "@app/components/dom-paint/element/PaintElement"
import RenderHashable from "@app/components/dom-paint/element/RenderHashable"
import { generateUUID } from "@app/util/lang/uuid"

export const newEmptyPaintLayerData = (): PaintLayerData => ({
	elements: [],
	metadata: {
		isHidden: false,
		name: "layer-" + generateUUID(),
	},
})

export type PaintLayerMetadata = {
	isHidden: false
	name: string
}

export type PaintLayerData = {
	elements: PaintElement[]
	metadata: PaintLayerMetadata
}

export default class PaintLayer implements RenderHashable<PaintLayerData> {
	private innerRenderHash = generateUUID()

	private innerData: PaintLayerData

	constructor(innerData: PaintLayerData) {
		this.innerData = {
			...innerData,
			elements: [...innerData.elements],
			metadata: { ...innerData.metadata },
		}
	}

	updateData = (updater: (data: PaintLayerData) => PaintLayerData) => {
		this.innerRenderHash = generateUUID()
		this.innerData = updater(this.innerData)
	}

	get renderHash(): string {
		return this.innerRenderHash
	}

	get data(): Readonly<PaintLayerData> {
		return this.innerData
	}
}
