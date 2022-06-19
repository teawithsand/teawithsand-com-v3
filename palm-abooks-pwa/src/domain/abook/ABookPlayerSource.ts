import { ABookActiveRecord } from "@app/domain/abook/ABookStore"

import PlayerSource, {
	LoadingPlayerSource,
	LoginPlayerSourceContent,
} from "tws-common/player/source/PlayerSource"
import PlayerSourceError from "tws-common/player/source/PlayerSourceError"

export default class ABookPlayerSource extends LoadingPlayerSource {
	public readonly id: string
	constructor(
		public readonly abookActiveRecord: ABookActiveRecord,
		public readonly sourceId: string,
	) {
		super()
		this.id = `aab:${abookActiveRecord.id}.${sourceId}`
	}

	loadTarget = async (): Promise<LoginPlayerSourceContent> => {
		const sfo = await this.abookActiveRecord.files.getFile(this.sourceId)
		if (!sfo)
			throw new PlayerSourceError(
				`Source with ${this.sourceId} was not fond on abook with id ${this.abookActiveRecord.id}`,
			)

		return {
			type: "urlObject",
			data: sfo.innerObject,
		}
	}

	equals = (b: PlayerSource): boolean => {
		return b instanceof ABookPlayerSource && b.id === this.id
	}
}
