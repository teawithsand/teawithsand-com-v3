import { StickySubscribable } from "tws-common/lang/bus/stateSubscribe"
import { DefaultStickyEventBus } from "tws-common/lang/bus/StickyEventBus"
import SingularTaskManager from "tws-common/lang/task/SingularTaskManager"
import { Playlist } from "tws-common/player/advanced/AdvancedPlayer"
import {
	MetadataLoadingResult,
	MetadataLoadingResultType,
} from "tws-common/player/metadata/Metadata"
import MetadataBag from "tws-common/player/metadata/MetadataBag"
import DefaultMetadataLoader from "tws-common/player/metadata/DefaultMetadataLoader"
import { obtainPlayerSourceURL } from "tws-common/player/source/PlayerSource"

// TODO(teawithsand): add caching, so metadata is not loaded each time we use it
// We can do something simple like serializing whole LRU into single JS object and then store it in IDB or localstorage
//  it should do ok
export default class APMetadataLoaderTaskHelper {
	private readonly taskManager = new SingularTaskManager()
	private readonly loader = new DefaultMetadataLoader()
	private readonly innerEventBus = new DefaultStickyEventBus<MetadataBag>(
		new MetadataBag([]),
	)

	private metadataLoadingResults: (MetadataLoadingResult | null)[] = []

	get metadataBagBus(): StickySubscribable<MetadataBag> {
		return this.innerEventBus
	}

	private computeAndSendBag = () => {
		this.innerEventBus.emitEvent(
			new MetadataBag(this.metadataLoadingResults),
		)
	}

	setPlaylist = (playlist: Playlist) => {
		this.metadataLoadingResults = []
		for (const _ of playlist) {
			this.metadataLoadingResults.push(null)
		}
		this.taskManager.cancel()

		this.computeAndSendBag()

		this.taskManager.submitTask(async ctx => {
			let i = 0
			for (const source of playlist) {
				if (ctx.isCanceled) {
					return
				}
				try {
					const [url, close] = obtainPlayerSourceURL(source)

					try {
						const metadata = await this.loader.loadMetadata(url)
						if (ctx.isCanceled) {
							return
						}
						this.metadataLoadingResults[i] = {
							type: MetadataLoadingResultType.OK,
							metadata,
						}
						this.computeAndSendBag()
					} catch (e) {
						if (ctx.isCanceled) {
							return
						}
						this.metadataLoadingResults[i] = {
							type: MetadataLoadingResultType.ERROR,
							error: e,
						}
						this.computeAndSendBag()
					} finally {
						close()
					}
				} finally {
					i++
				}
			}
		})
	}
}
