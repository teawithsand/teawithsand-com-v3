import { MPlaylistMetadata } from "@app/domain/bfr/playlist"
import { MPlayerSource } from "@app/domain/bfr/source"

import { BFRState } from "tws-common/player/bfr/state"

export type MBFRState = BFRState<MPlaylistMetadata, MPlayerSource>
