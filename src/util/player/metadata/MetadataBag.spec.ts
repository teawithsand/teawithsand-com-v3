import {
	MetadataLoadingResult,
	MetadataLoadingResultType,
} from "@app/util/player/metadata/Metadata"
import MetadataBag from "@app/util/player/metadata/MetadataBag"

describe("MetadataBag", () => {
	it.each([
		[
			[
				{
					type: MetadataLoadingResultType.OK,
					metadata: {
						duration: 10,
					},
				},
			],
			0,
			10,
		],
		[
			[
				{
					type: MetadataLoadingResultType.OK,
					metadata: {
						duration: 10,
					},
				},
				{
					type: MetadataLoadingResultType.OK,
					metadata: {
						duration: null,
					},
				},
			],
			10,
			null,
		],
		[
			[
				{
					type: MetadataLoadingResultType.OK,
					metadata: {
						duration: 10,
					},
				},
				{
					type: MetadataLoadingResultType.OK,
					metadata: {
						duration: null,
					},
				},
				{
					type: MetadataLoadingResultType.OK,
					metadata: {
						duration: 10,
					},
				},
				{
					type: MetadataLoadingResultType.OK,
					metadata: {
						duration: 10,
					},
				},
				{
					type: MetadataLoadingResultType.OK,
					metadata: {
						duration: 10,
					},
				},
			],
			null,
			null,
		],
	] as MetadataLoadingResult[][][])(
		"can store and read file",
		(results, exclusiveExpectedResult, inclusiveExpectedResult) => {
			const bag = new MetadataBag(results)
			expect(bag.getDurationToIndex(results.length - 1)).toEqual(
				exclusiveExpectedResult,
			)
			expect(bag.getDurationToIndex(results.length - 1, true)).toEqual(
				inclusiveExpectedResult,
			)
		},
	)
})
