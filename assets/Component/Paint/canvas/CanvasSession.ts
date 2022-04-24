/**
 * Error, which is thrown when 
 */
export class ClosedCheckerClosedError extends Error {
    constructor() {
        super("throwIfClosed was called while ClosedChecker was closed")
        this.name = 'ClosedCheckerClosedError'
    }
}

/**
 * Util, which helps checking if some parent object was closed.
 * Used exclusively by DrawSession for now.
 */
export class CanvasSessionClosedChecker {
    constructor(private readonly inner: () => boolean) {
    }

    isClosed = this.inner
    throwIfClosed = () => {
        if (this.inner()) {
            throw new ClosedCheckerClosedError()
        }
    }
}

export interface CanvasSessionResult {
    /**
    * Makes sure that all pending resources are stopped.
    * Should be called after draw becomes obsolete because canvas is destroyed or another draw call is about to be called.
    * Call to this function does not undo changes made to draw target.
    */
    close(): void

    /**
     * True, if session was already closed.
     */
    readonly isClosed: boolean

    /**
     * Promise resolved once draw session is done.
     * Also resolved when session gets closed and all processes are finished.
     * For infinite sessions, resolved when session gets closed.
     */
    readonly donePromise: Promise<void>
}