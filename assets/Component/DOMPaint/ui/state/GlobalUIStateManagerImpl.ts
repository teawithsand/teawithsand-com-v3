import GlobalUIState, { globalUIStateEventSourcingAdapter } from "@app/Component/DOMPaint/ui/state/GlobalUIState";
import GlobalUIStateManager from "@app/Component/DOMPaint/ui/state/GlobalUIStateManager";
import GlobalUIStateMutator from "@app/Component/DOMPaint/ui/state/GlobalUIStateMutator";
import { StickySubscribable } from "@app/util/lang/bus/stateSubscribe";
import { NoHistoryEventSourcing, NoHistoryInMemoryEventSourcing } from "@app/util/lang/eventSourcing";

export default class GlobalUIStateManagerImpl implements GlobalUIStateManager {
    private readonly innerState: NoHistoryEventSourcing<GlobalUIState, GlobalUIStateMutator>
    constructor(initialState: GlobalUIState) {
        this.innerState = new NoHistoryInMemoryEventSourcing(
            globalUIStateEventSourcingAdapter,
            initialState)
    }

    get state(): StickySubscribable<GlobalUIState> {
        return this.innerState.aggregate
    }

    mutateUIState = (mutation: GlobalUIStateMutator): void => {
        this.innerState.applyEvent(mutation)
    }
}