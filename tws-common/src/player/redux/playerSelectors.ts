import { useSelector } from "react-redux"

import PlayerState from "tws-common/player/redux/PlayerState"

export const usePlayerStateSelector = <T>(selector: (ps: PlayerState) => T) =>
	useSelector<PlayerState, T>(selector)
