import { useSelector } from "react-redux"

import PlayerState from "@app/components/player/redux/PlayerState"

export const usePlayerStateSelector = <T>(selector: (ps: PlayerState) => T) =>
	useSelector<PlayerState, T>(selector)
