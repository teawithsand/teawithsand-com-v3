import { PrimPaintElement } from "@app/components/redux-dom-paint/ui/redux/PrimPaintElement"
import {
	initialPrimPaintScene,
	PrimPaintLayer,
	PrimPaintLayerData,
	PrimPaintScene,
} from "@app/components/redux-dom-paint/ui/redux/PrimPaintScene"
import PrimPaintSceneMutation, {
	applyMutationOnDraft,
	inverseMutation,
} from "@app/components/redux-dom-paint/ui/redux/PrimPaintSceneMutation"
import produce from "immer"

const doMutationTest = (data: {
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

	expect(targetScene).toEqual(initialScene)
}

const doInverseTest = (data: {
	initialScene?: PrimPaintScene | undefined
	mutations: PrimPaintSceneMutation[]
}) => {
	let { initialScene, mutations } = data

	const scenes: PrimPaintScene[] = []

	initialScene = initialScene ?? initialPrimPaintScene

	let i = 0
	for (const m of mutations) {
		try {
			let scene
			if (i === 0) {
				scene = initialScene
			} else {
				scene = scenes[i - 1]
			}
			const newScene = produce(scene, draft => applyMutationOnDraft(draft, m))
			scenes.push(newScene)
		} finally {
			i++
		}
	}

	for (let i = scenes.length - 1; i >= 0; i--) {
		const mutatedScene = scenes[i]
		const m = mutations[i]

		let originalScene

		if (i === 0) {
			originalScene = initialScene
		} else {
			originalScene = scenes[i - 1]
		}

		const inv = inverseMutation(originalScene, m)
		let invertedScene = produce(mutatedScene, draft =>
			applyMutationOnDraft(draft, inv)
		)

		invertedScene = produce(invertedScene, draft => {
			for (const l of draft.layers) {
				l.id = "" // unset ids for simplicity of comparison
			}
		})

		originalScene = produce(originalScene, draft => {
			for (const l of draft.layers) {
				l.id = "" // unset ids for simplicity of comparison
			}
		})

		expect(originalScene).toEqual(invertedScene)
	}
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

const srcScene4 = scene([
	layer(layerData("l0", [element(0)])),
	layer(layerData("l1", [element(1)])),
	layer(layerData("l2", [element(2)])),
	layer(layerData("l3", [element(3)])),
])

describe("PrimPaintScene", () => {
	describe("mutations", () => {
		it("can do push layer", () => {
			doMutationTest({
				initialScene: scene([]),
				targetScene: scene([
					layer(layerData("added", [element(2), element(3)])),
				]),
				mutations: [
					{
						type: "push-layer",
						data: layerData("added", [element(2), element(3)]),
					},
				],
			})
			doMutationTest({
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

			doMutationTest({
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
						beforeLayerIndex: 1,
					},
				],
			})
		})

		it("can do drop layer", () => {
			const srcScene = srcScene4
			doMutationTest({
				initialScene: srcScene,
				targetScene: scene([
					layer(layerData("l0", [element(0)])),
					layer(layerData("l1", [element(1)])),
					layer(layerData("l2", [element(2)])),
				]),
				mutations: [
					{
						type: "drop-layer",
					},
				],
			})

			for (let i = 0; i < srcScene.layers.length; i++) {
				doMutationTest({
					initialScene: srcScene,
					targetScene: scene(srcScene.layers.filter((v, j) => j !== i)),
					mutations: [
						{
							type: "drop-layer",
							layerIndex: i,
						},
					],
				})
			}
		})

		it("can do move", () => {
			const srcScene = scene([
				layer(layerData("l0", [element(0)])),
				layer(layerData("l1", [element(1)])),
				layer(layerData("l2", [element(2)])),
				layer(layerData("l3", [element(3)])),
			])

			doMutationTest({
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
				doMutationTest({
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

			doMutationTest({
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

			doMutationTest({
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

			doMutationTest({
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

			doMutationTest({
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
						beforeIndex: 4,
					},
				],
			})
		})

		it("can do drop layer elements", () => {
			let i = 0
			const initialScene = scene([
				layer(
					layerData("l1", [
						element(i++),
						element(i++),
						element(i++),
						element(i++),
						element(i++),
						element(i++),
					])
				),
			])

			doMutationTest({
				initialScene,
				targetScene: scene([layer(layerData("l1", []))]),
				mutations: [
					{
						type: "drop-layer-elements",
						layerIndex: 0,
						toElementIndex: initialScene.layers[0].elements.length,
					},
				],
			})
			doMutationTest({
				initialScene,
				targetScene: scene([layer(layerData("l1", []))]),
				mutations: [
					{
						type: "drop-layer-elements",
						layerIndex: 0,
						fromElementIndex: 0,
					},
				],
			})
			doMutationTest({
				initialScene,
				targetScene: scene([layer(layerData("l1", []))]),
				mutations: [
					{
						type: "drop-layer-elements",
						layerIndex: 0,
					},
				],
			})
			doMutationTest({
				initialScene,
				targetScene: scene([layer(layerData("l1", []))]),
				mutations: [
					{
						type: "drop-layer-elements",
						layerIndex: 0,
						fromElementIndex: 0,
						toElementIndex: initialScene.layers[0].elements.length,
					},
				],
			})
		})

		// TODO(teawithsand): more tests here for coverage
	})

	describe("inverse mutations", () => {
		it("can inverse push layer", () => {
			const srcScene = srcScene4
			doInverseTest({
				initialScene: srcScene,
				mutations: [
					{
						type: "push-layer",
						data: layerData("pushed", [element(20)]),
					},
				],
			})

			for (let i = 0; i < srcScene.layers.length; i++) {
				doInverseTest({
					initialScene: srcScene,
					mutations: [
						{
							type: "push-layer",
							data: layerData("pushed", [element(20)]),
							beforeLayerIndex: i,
						},
					],
				})
			}
		})

		it("can inverse drop layer", () => {
			const srcScene = srcScene4

			doInverseTest({
				initialScene: srcScene,
				mutations: [
					{
						type: "drop-layer",
					},
				],
			})

			for (let i = 0; i < srcScene.layers.length; i++) {
				doInverseTest({
					initialScene: srcScene,
					mutations: [
						{
							type: "drop-layer",
							layerIndex: i,
						},
					],
				})
			}
		})

		it("can inverse move layer", () => {
			const srcScene = srcScene4

			for (let i = 0; i < srcScene.layers.length; i++) {
				doInverseTest({
					initialScene: srcScene,
					mutations: [
						{
							type: "move-layer",
							index: i,
						},
					],
				})
			}

			for (let i = 0; i < srcScene.layers.length; i++) {
				for (let j = 0; j < srcScene.layers.length; j++) {
					doInverseTest({
						initialScene: srcScene,
						mutations: [
							{
								type: "move-layer",
								index: i,
								beforeIndex: j,
							},
						],
					})
				}
			}
		})

		it("can inverse push layer elements", () => {
			const srcScene = srcScene4

			doInverseTest({
				initialScene: srcScene,
				mutations: [
					{
						type: "push-layer-elements",
						layerIndex: 0,
						elements: [element(5), element(6)],
					},
				],
			})

			doInverseTest({
				initialScene: srcScene,
				mutations: [
					{
						type: "push-layer-elements",
						layerIndex: 0,
						elements: [],
					},
				],
			})
		})

		it("can inverse drop layer elements", () => {
			let i = 0
			const srcScene = scene([
				layer(
					layerData("l0", [
						element(i++),
						element(i++),
						element(i++),
						element(i++),
						element(i++),
					])
				),
			])

			const elements = [
				...Array(srcScene.layers[0].elements.length).keys(),
				undefined,
			]
			for (const i of elements) {
				for (const j of elements) {
					if (typeof i === "number" && typeof j === "number" && i > j) {
						continue
					}
					doInverseTest({
						initialScene: srcScene,
						mutations: [
							{
								type: "drop-layer-elements",
								layerIndex: 0,
								fromElementIndex: i,
								toElementIndex: j,
							},
						],
					})
				}
			}
		})

		it("can inverse move layer element", () => {
			let i = 0
			const srcScene = scene([
				layer(
					layerData("l0", [
						element(i++),
						element(i++),
						element(i++),
						element(i++),
						element(i++),
					])
				),
				layer(
					layerData("l0", [
						element(i++),
						element(i++),
						element(i++),
						element(i++),
						element(i++),
					])
				),
			])

			const elements = [
				...Array(srcScene.layers[0].elements.length).keys(),
			]

			// inter-layer move
			for (const i of elements) {
				for (const j of [...elements, undefined]) {
					if (typeof i === "number" && typeof j === "number") {
						continue
					}
					doInverseTest({
						initialScene: srcScene,
						mutations: [
							{
								type: "move-layer-element",
								sourceLayerIndex: 0,
								destinationLayerIndex: 1,
								sourceElementIndex: i,
								beforeDestinationElementIndex: j,
							},
						],
					})
				}
			}

			// same-layer move
			for (const i of elements) {
				for (const j of [...elements, undefined]) {
					if (typeof i === "number" && typeof j === "number") {
						continue
					}
					doInverseTest({
						initialScene: srcScene,
						mutations: [
							{
								type: "move-layer-element",
								sourceLayerIndex: 0,
								destinationLayerIndex: 0,
								sourceElementIndex: i,
								beforeDestinationElementIndex: j,
							},
						],
					})
				}
			}
		})
	})
})
