import { NewPlayerSource } from "tws-common/player/newsource/NewPlayerSource"

export type NewPlayerSourceResolver<T extends NewPlayerSource> = {
	/**
	 * Resolves player source into URL, which should be released once it's not needed.
	 */
	resolveSourceToURL(source: T): [string, () => void]
}
