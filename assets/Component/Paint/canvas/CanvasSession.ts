import { latePromise } from "@app/util/lang/latePromise"
import { TaskQueue } from "@app/util/lang/taskQueue"

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

/**
 * Part of session, which is exposed to canvas.
 */
export interface CanvasSessionConsumer {
    addTask: (t: (obj: CanvasSessionClosedChecker) => Promise<void>) => void
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

/**
 * Util for Draw classes, which implements DrawResult.
 */
export default class CanvasSession implements CanvasSessionConsumer {
    private innerIsClosed = false

    private lateResolve: () => void
    private lateReject: (e: any) => void
    private lateResolvePromise: Promise<void>

    private readonly taskQueue = new TaskQueue()

    private taskDoneCounter: number = 0
    private taskCounter: number = 0

    private isFinalized: boolean = false
    constructor() {
        const [promise, resolve, reject] = latePromise<void>()
        this.lateResolve = resolve
        this.lateReject = reject
        this.lateResolvePromise = promise
    }

    /**
     * Finalizes session. After it gets called session should not be used anymore.
     * Should be called in order to make isClosed or isInfinite or donePromise work.
     */
    finalize = (): CanvasSessionResult => {
        this.isFinalized = true

        const self = this
        return {
            close: () => {
                this.innerIsClosed = true
            },
            get isClosed() {
                return self.innerIsClosed
            },
            donePromise: this.lateResolvePromise,
        }
    }

    addTask = (t: (obj: CanvasSessionClosedChecker) => Promise<void>) => {
        if (this.innerIsClosed) {
            return;
        }

        this.taskQueue.scheduleTask(async () => {
            // it's up to task to cancel any side effect
            // if session was closed
            this.taskCounter += 1
            try {
                await t(new CanvasSessionClosedChecker(() => this.innerIsClosed))
            } catch (e) {
                // Note: name check is added in order to make this code run in babel
                // where there is no good polyfill for extending builtin classes and instanceof checks fail.
                if (e instanceof ClosedCheckerClosedError || (typeof e === "object" && e?.name === 'ClosedCheckerClosedError')) {
                    return; // this exception is OK 
                }
                this.lateReject(e)
            } finally {
                this.taskDoneCounter -= 1

                if (this.isFinalized && this.taskDoneCounter === this.taskCounter) {
                    this.lateResolve()
                }
            }
        })
    }
    
}