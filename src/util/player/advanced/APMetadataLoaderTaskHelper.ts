import { StickySubscribable } from "@app/util/lang/bus/stateSubscribe";
import { DefaultStickyEventBus } from "@app/util/lang/bus/StickyEventBus";
import SingularTaskManager from "@app/util/lang/task/SingularTaskManager";
import { Playlist } from "@app/util/player/advanced/AdvancedPlayer";
import { MetadataLoadingResult, MetadataLoadingResultType } from "@app/util/player/metadata/Metadata";
import MetadataBag from "@app/util/player/metadata/MetadataBag";
import MetadataTool from "@app/util/player/metadata/MetadataTool";
import { URLPlayerSource } from "@app/util/player/source/PlayerSource";

// TODO(teawithsand): add caching, so metadata is not loaded each time we use it
// We can do something simple like serializing whole LRU into single JS object and then store it in IDB or localstorage
//  it should do ok
export default class APMetadataLoaderTaskHelper {
	private readonly taskManager = new SingularTaskManager()
	private readonly loader = new MetadataTool()
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
			for (const v of playlist) {
				if (ctx.isCanceled) {
					return
				}
				try {
					if (!(v instanceof URLPlayerSource)) {
						// for now not supported; ignore it
						continue
					}

					const { url } = v

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
					}
				} finally {
					i++
				}
			}
		})
	}
}