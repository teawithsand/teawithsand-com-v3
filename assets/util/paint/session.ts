import { latePromise } from "../lang/latePromise"
import { TaskQueue } from "../lang/taskQueue"
import { DrawSessionResult } from "./primitive"

interface ClosedChecker {
    isClosed: () => boolean
}

/**
 * Part of session, which is 
 */
export interface DrawSessionConsumer {
    /**
     * Marks session as infinite.
     * It means that rendering it is intended to never end.
     */
    markInfinite: () => void
    addTask: (t: (obj: ClosedChecker) => Promise<void>) => void
}

/**
 * Util for Draw classes, which implements DrawResult.
 */
export class DrawSession implements DrawSessionConsumer {
    private innerIsClosed = false

    private lateResolve: () => void
    private lateReject: (e: any) => void
    private lateResolvePromise: Promise<void>

    private readonly taskQueue = new TaskQueue()

    private taskDoneCounter: number = 0
    private taskCounter: number = 0

    private isFinalized: boolean = false
    private innerIsInfinite: boolean = false

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
    finalize = (): DrawSessionResult => {
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
            isInfinite: this.innerIsInfinite,
        }
    }

    markInfinite = () => {
        this.innerIsInfinite = true
    }

    addTask = (t: (obj: ClosedChecker) => Promise<void>) => {
        if (this.innerIsClosed) {
            return;
        }

        this.taskQueue.scheduleTask(async () => {
            // it's up to task to cancel any side effect
            // if session was closed
            this.taskCounter += 1
            try {
                await t({
                    isClosed: () => {
                        return this.innerIsClosed
                    }
                })
            } catch(e) {
                this.lateReject(e)
            } finally {
                this.taskDoneCounter += 1

                if (this.isFinalized && this.taskDoneCounter === this.taskCounter) {
                    this.lateResolve()
                }
            }
        })
    }
}