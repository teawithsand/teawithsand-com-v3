import PlayerSource from "@app/components/player/source/PlayerSource"

/**
 * Note: providers must be "pure" and immutable, once they were created.
 * 
 * They may perform some logic in order to initialize source though.
 */
export default interface PlayerSourceProvider {
	readonly length: number
	getSourceWithIndex: (i: number) => PlayerSource | null
}

export class ArrayPlayerSourceProvider implements PlayerSourceProvider {
	constructor(private readonly sources: PlayerSource[]) {
		this.sources = [...sources]
	}

	readonly length: number = this.sources.length

	getSourceWithIndex = (i: number) =>
		i < 0 || !isFinite(i) || i >= this.length ? null : this.sources[i]
}
