import { Store } from "redux"
import { StickySubscribable } from "tws-common/lang/bus/stateSubscribe"
import { DefaultStickyEventBus } from "tws-common/lang/bus/StickyEventBus"
import { DefaultTaskAtom } from "tws-common/lang/task/TaskAtom"
import { RemoteDataRoot } from "tws-common/redux/rd/data"

/**
 * Result of loading remote data via redux.
 */
export type RemoteDataLoadResult<T> =
	| {
			type: "loading"
	  }
	| {
			type: "loaded"
			data: T
	  }
	| {
			type: "error"
			error: any
	  }

export interface ReduxRemoteDataLoader<T> {
	readonly dataBus: StickySubscribable<RemoteDataLoadResult<T>>
}

/**
 * Util, which handles:
 * 1. Getting descriptor
 * 2. Determining if it changed
 * 3. Loading data using loader
 * 4. Sending result where it's needed.
 */
export class DefaultReduxRemoteDataLoader<D, R, S>
	implements ReduxRemoteDataLoader<R>
{
	private unsubscribe: (() => void) | null
	private lastRoot: RemoteDataRoot<D> | null = null

	private readonly innerBus = new DefaultStickyEventBus<
		RemoteDataLoadResult<R>
	>({
		type: "loading",
	})

	private readonly taskAtom = new DefaultTaskAtom()

	get dataBus() {
		return this.innerBus
	}

	constructor(
		store: Store<S>,
		selector: (state: S) => RemoteDataRoot<D>,
		loader: (
			ctx: {
				readonly isValid: boolean
			},
			descriptor: D,
		) => Promise<R>,
	) {
		const release = store.subscribe(() => {
			const state = store.getState()
			const root = selector(state)
			if (this.lastRoot === null || root.id !== this.lastRoot.id) {
				const claim = this.taskAtom.claim()

				// trigger loading here
				this.innerBus.emitEvent({
					type: "loading",
				})

				loader(
					{
						get isValid() {
							return claim.isValid
						},
					},
					root.data,
				)
					.then(v => {
						if (claim.isValid) {
							this.innerBus.emitEvent({
								type: "loaded",
								data: v,
							})
						}
					})
					.catch(e => {
						if (claim.isValid) {
							this.innerBus.emitEvent({
								type: "error",
								error: e,
							})
						}
					})
			}
		})
		this.unsubscribe = () => release()
	}

	release = () => {
		if (this.unsubscribe !== null) {
			this.unsubscribe()
			this.unsubscribe = null
		}
	}
}
