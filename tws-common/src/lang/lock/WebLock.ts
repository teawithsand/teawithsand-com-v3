/**
 * Better api for WebLocks, with potential of polyfill implementation.
 *
 * // TODO(teawithsand): make it implement lock interface
 */
export default class WebLock {
	constructor(private readonly key: string) {}

	claim = async (
		opts:
			| {
					exclusive?: boolean
					ifAvailable?: false
					opWhenAcquired: () => Promise<void>
					opWhenNotAcquired?: undefined
			  }
			| {
					exclusive?: boolean
					ifAvailable: true
					opWhenAcquired: () => Promise<void>
					opWhenNotAcquired: () => Promise<void>
			  },
	): Promise<void> => {
		const { exclusive, ifAvailable, opWhenAcquired, opWhenNotAcquired } =
			opts
		await navigator.locks.request(
			this.key,
			{
				mode: exclusive ? "exclusive" : "shared",
				ifAvailable: ifAvailable ?? false,
			},
			async lock => {
				if (lock === null && ifAvailable) {
					await opWhenNotAcquired()
				} else {
					await opWhenAcquired()
				}
			},
		)
	}
}
