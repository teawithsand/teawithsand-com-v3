import { PlayerError } from "tws-common/player/PlayerError"

/**
 * For arbitrary errors that BFRPlayer may create.
 */
export class BFRPlayerError extends PlayerError {}

export class MediaBFRPlayerError extends BFRPlayerError {
	constructor(msg: string, cause: MediaError) {
		super(msg, cause)
	}
}
