import { PlayerSource } from "tws-common/player/source/PlayerSource"
import {
	BasePlayerSourceResolver,
	BasePlayerSourceResolverExtractedData,
} from "tws-common/player/source/PlayerSourceResolver"

export type MPlayerSource = {
	type: "external-file"
	blob: File
	name: string
} & {
	id: string
} & PlayerSource

let globalInstance: MPlayerSourceResolver | null = null
export class MPlayerSourceResolver extends BasePlayerSourceResolver<MPlayerSource> {
	public static getInstance(): MPlayerSourceResolver {
		if (globalInstance === null) {
			globalInstance = new MPlayerSourceResolver()
		}
		return globalInstance
	}

	protected extractData = (
		source: MPlayerSource,
	): BasePlayerSourceResolverExtractedData => {
		if (source.type === "external-file") {
			return {
				type: "blob",
				blob: source.blob,
				id: source.id,
			}
		} else {
			throw new Error("unreachable code")
		}
	}
}
