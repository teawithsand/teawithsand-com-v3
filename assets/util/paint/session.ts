interface ClosedChecker {
    readonly isClosed: boolean
}

/**
 * Util for Draw classes, which implements DrawResult.
 */
export class DrawSession {
    private innerIsClosed = false

    get isClosed() {
        return this.innerIsClosed
    }

    close = () => {
        this.innerIsClosed = true
    }

    addTask = (t: (obj: ClosedChecker) => Promise<void>) => {
        if(this.innerIsClosed){
            return;
        }

        // it's up to task to cancel any side effect
        // if session was closed
        t(this)
    }
}