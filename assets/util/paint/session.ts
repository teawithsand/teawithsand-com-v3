import { latePromise } from "../latePromise"
import { DrawResult } from "./primitive"

interface ClosedChecker {
    readonly isClosed: boolean
}

export interface DrawSessionConsumer {
    readonly isInfinite: boolean
    addTask: (t: (obj: ClosedChecker) => Promise<void>) => void
}

/**
 * Util for Draw classes, which implements DrawResult.
 */
export class DrawSession implements ClosedChecker, DrawSessionConsumer {
    private innerIsClosed = false
    private lateResolve: () => void
    private lateResolvePromise: Promise<void>

    private taskDoneCounter: number = 0
    private taskCounter: number = 0

    private isFinalized: boolean = false

    constructor(public readonly isInfinite: boolean) {
        const [promise, resolve, reject] = latePromise<void>()
        this.lateResolve = resolve
    }

    /**
     * Should be called in order to make isClosed or isInfinite or donePromise work.
     */
    finalize = (): DrawResult => {
        this.isFinalized = true

        return {
            donePromise: this.lateResolvePromise,
            close: () => {
                this.innerIsClosed = true
            },
            isInfinite: this.isInfinite,
        }
    }

    get isClosed() {
        return this.innerIsClosed
    }

    addTask = (t: (obj: ClosedChecker) => Promise<void>) => {
        if (this.innerIsClosed) {
            return;
        }

        // it's up to task to cancel any side effect
        // if session was closed
        this.taskCounter += 1
        t(this).finally(() => {
            this.taskDoneCounter += 1

            if (this.isFinalized && this.taskDoneCounter === this.taskCounter) {
                this.lateResolve()
            }
        })
    }

}