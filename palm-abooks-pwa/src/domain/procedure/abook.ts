import { ABookID } from "@app/domain/abook/ABookStore"
import { Procedure } from "@app/domain/procedure/context"
import { setWTPPlaylist } from "@app/domain/wtp/actions"
import { WTPPlaylistMetadataType } from "@app/domain/wtp/playlist"

export const playAbookProcedure: Procedure<ABookID> = async (ctx, id) => {
	ctx.dispatch(
		setWTPPlaylist({
			type: WTPPlaylistMetadataType.ABOOK,
			abookId: id,
		}),
	)
}