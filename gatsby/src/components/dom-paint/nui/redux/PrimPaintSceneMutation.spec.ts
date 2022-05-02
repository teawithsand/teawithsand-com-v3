import { PrimPaintElement } from "@app/components/dom-paint/nui/redux/PrimPaintElement"
import {
	initialPrimPaintScene,
	PrimPaintLayer,
	PrimPaintLayerData,
	PrimPaintScene,
} from "@app/components/dom-paint/nui/redux/PrimPaintScene"
import PrimPaintSceneMutation, {
	applyMutationOnDraft,
} from "@app/components/dom-paint/nui/redux/PrimPaintSceneMutation"
import produce from "immer"

const makeTest =
	(data: {
		initialScene?: PrimPaintScene | undefined
		targetScene: PrimPaintScene
		mutations: PrimPaintSceneMutation[]
		disableNames?: boolean
	}) =>
	() =>
		doTest(data)

const doTest = (data: {
	initialScene?: PrimPaintScene | undefined
	targetScene: PrimPaintScene
	mutations: PrimPaintSceneMutation[]
	disableNames?: boolean
}) => {
	let { initialScene, targetScene, mutations, disableNames } = data

	initialScene = initialScene ?? initialPrimPaintScene
	disableNames = disableNames ?? true

	for (const m of mutations) {
		initialScene = produce(initialScene, draft =>
			applyMutationOnDraft(draft, m)
		)
	}

	initialScene = produce(initialScene, draft => {
		for (const l of draft.layers) {
			l.id = "" // unset ids for simplicity of comparison
			if (disableNames) l.metadata.name = ""
		}
	})

	targetScene = produce(targetScene, draft => {
		for (const l of draft.layers) {
			l.id = "" // unset ids for simplicity of comparison
			if (disableNames) l.metadata.name = ""
		}
	})

	expect(initialScene).toEqual(targetScene)
}

// note: elements really only have to be different
// we do not really care about inner data
const element = (i: number): PrimPaintElement => ({
	type: "path",
	data: {
		entries: [
			{
				point: [0, 0],
				type: "M",
			},
			{
				point: [i, i],
				type: "L",
			},
		],
		fill: null,
		filters: [],
		stroke: {
			color: [0, 0, 0],
			linecap: "round",
			linejoin: "round",
			size: 10,
		},
	},
})

const layerData = (
	name: string,
	elements: PrimPaintElement[]
): PrimPaintLayerData => ({
	elements,
	metadata: {
		isHidden: false, // for sake of simplicity, this parameter won't be tested; it does not really matter for now
		name,
	},
})

const layer = (data: PrimPaintLayerData): PrimPaintLayer => ({
	id: "",
	...data,
})

const emptyLayer: PrimPaintLayer = {
	id: "",
	elements: [],
	metadata: {
		isHidden: false,
		name: "",
	},
}

const scene = (layers: PrimPaintLayer[]) => ({
	layers,
})

describe("PrimPaintScene", () => {
	describe("mutations", () => {
		it(
			"can do push layer",
			makeTest({
				initialScene: scene([
					layer(layerData("l0", [element(0)])),
					layer(layerData("l1", [element(1)])),
				]),
				targetScene: scene([
					layer(layerData("l0", [element(0)])),
					layer(layerData("l1", [element(1)])),
					layer(layerData("added", [element(2), element(3)])),
				]),
				mutations: [
					{
						type: "push-layer",
						data: layerData("added", [element(2), element(3)]),
					},
				],
			})
		)

		it(
			"can handle layer insertion",
			makeTest({
				initialScene: scene([
					layer(layerData("l0", [element(0)])),
					layer(layerData("l1", [element(1)])),
				]),
				targetScene: scene([
					layer(layerData("l0", [element(0)])),
					layer(layerData("added", [element(2), element(3)])),
					layer(layerData("l1", [element(1)])),
				]),
				mutations: [
					{
						type: "push-layer",
						data: layerData("added", [element(2), element(3)]),
						beforeIndex: 1,
					},
				],
			})
		)

		it("can handle later moving", () => {
			const srcScene = scene([
				layer(layerData("l0", [element(0)])),
				layer(layerData("l1", [element(1)])),
				layer(layerData("l2", [element(2)])),
				layer(layerData("l3", [element(3)])),
			])
			doTest({
				initialScene: srcScene,
				targetScene: scene([
					layer(layerData("l1", [element(1)])),
					layer(layerData("l2", [element(2)])),
					layer(layerData("l3", [element(3)])),
					layer(layerData("l0", [element(0)])),
				]),
				mutations: [
					{
						type: "move-layer",
						index: 0,
					},
				],
			})

			for (let i = 0; i < srcScene.layers.length; i++) {
				doTest({
					initialScene: srcScene,
					targetScene: srcScene,
					mutations: [
						{
							type: "move-layer",
							index: i,
							beforeIndex: i,
						},
					],
				})
			}

			doTest({
				initialScene: srcScene,
				targetScene: scene([
					layer(layerData("l1", [element(1)])),
					layer(layerData("l0", [element(0)])),
					layer(layerData("l2", [element(2)])),
					layer(layerData("l3", [element(3)])),
				]),
				mutations: [
					{
						type: "move-layer",
						index: 0,
						beforeIndex: 2,
					},
				],
			})

			doTest({
				initialScene: srcScene,
				targetScene: scene([
					layer(layerData("l2", [element(2)])),
					layer(layerData("l0", [element(0)])),
					layer(layerData("l1", [element(1)])),
					layer(layerData("l3", [element(3)])),
				]),
				mutations: [
					{
						type: "move-layer",
						index: 2,
						beforeIndex: 0,
					},
				],
			})
		})
        
        // TODO(teawithsand): more tests here for coverage
	})
})
