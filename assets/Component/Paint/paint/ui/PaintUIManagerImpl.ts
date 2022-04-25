import { StickySubscribable } from "@app/util/lang/bus/stateSubscribe";
import { DefaultStickyEventBus } from "@app/util/lang/bus/StickyEventBus";
import PaintManagerMutation from "../scene/mutation/PaintManagerMutation";
import PaintSceneManager from "../scene/PaintSceneManager";
import PaintUIInput from "./PaintUIInput";
import PaintUIManager from "./PaintUIManager";
import PaintUIState from "./PaintUIState";
import ActivePaintTool from "./tool/ActivePaintTool";
import PaintTool from "./tool/PaintTool";
import PaintToolCallbacks from "./tool/PaintToolCallbacks";

export default class PaintUIManagerImpl implements PaintUIManager {
    private innerState: DefaultStickyEventBus<PaintUIState>

    private currentTool: {
        tool: PaintTool,
        active: ActivePaintTool,
        close: () => void,
    } | null = null

    private currentToolMutations: PaintManagerMutation[] = []

    constructor(public readonly paintSceneManager: PaintSceneManager, initState: PaintUIState) {
        this.innerState = new DefaultStickyEventBus<PaintUIState>(initState)
        this.innerState.addSubscriber(state => {
            const ct = this.currentTool
            if (ct) {
                ct.active.updateUIState(state)
            }
        })
    }

    public get state(): StickySubscribable<Readonly<PaintUIState>> {
        return this.innerState
    }

    handleInput = (uiInput: PaintUIInput): void => {
        console.log("inManager", { uiInput })
        const ct = this.currentTool
        if (ct) {
            const res = ct.active.processInput(uiInput)
            if (res.type === "processed") {
                // do not do further processing
                return
            }
        }

        this.innerHandleUIInput(uiInput)
    }

    setTool = (tool: PaintTool): void => {
        this.releaseTool()

        const active = tool.activate(
            this.makeToolCallbacks(),
            this.paintSceneManager.scene,
            this.state.lastEvent,
        )

        this.currentTool = {
            tool,
            active,
            close: active.close,
        }
    }

    private innerHandleUIInput = (input: PaintUIInput) => {

    }

    private releaseTool = () => {
        const t = this.currentTool
        if (t !== null)
            t.close()
        this.currentTool = null
        this.currentToolMutations = []
        this.regenerateAndApplyMutations()
    }

    private makeToolCallbacks = (): PaintToolCallbacks => ({
        discardTool: () => {
            this.releaseTool()
        },
        notifyMutationsChanged: (mutations: PaintManagerMutation[]) => {
            this.currentToolMutations = mutations
            this.regenerateAndApplyMutations()
        },
        setTool: (tool: PaintTool) => {
            this.setTool(tool)
        },
        notifyMutationsApply: () => {
            // TODO(teawithsand): applying mutations to canvas
        }
    })

    private regenerateAndApplyMutations = () => {
        // TODO(teawithsand): here add any kind of overlay mutators, which should be applied to canvas.
        const mutations = [
            ...this.currentToolMutations,
        ]

        this.paintSceneManager.applyMutations(mutations)
        this.paintSceneManager.commit()
    }

    close = () => {
        this.releaseTool()
        // aside from that, nothing to close here
    }
}