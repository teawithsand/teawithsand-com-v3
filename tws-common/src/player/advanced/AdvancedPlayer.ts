import { StickySubscribable } from "tws-common/lang/bus/stateSubscribe"
import AdvancedPlayerState from "tws-common/player/advanced/AdvancedPlayerState"
import PlayerSource from "tws-common/player/source/PlayerSource"

export type Playlist = PlayerSource[]

/**
 * Player, which is capable of managing playlist.
 * It also uses PlayerSource(s), which may require freeing them.
 */
export default interface AdvancedPlayer {
	readonly eventBus: StickySubscribable<AdvancedPlayerState>
	readonly playlist: Playlist

	setIsPlayingWhenReady(isPlayingWhenReady: boolean): void
	setRate(rate: number): void
	setVolume(volume: number): void

	/**
	 * Triggers reload.
	 * It's useful when error occurred and user wants to retry.
	 */
	reload(): void

	/**
	 * Causes playback to pause and reload current playback when entry, which is played right now gets changed.
	 *
	 * Setting empty playlist releases resources.
	 * Calling this method also triggers metadata loading of all entries provided.
	 */
	setPlaylist(playlist: Playlist): void

	/**
	 * Performs seek in scope of current file.
	 */
	localSeek(to: number): void

	/**
	 * Sets index of file to play and position, which will be played.
	 * Causes media reload if index is equal to current entry and player is in error state.
	 */
	seek(index: number, to: number): void
}
