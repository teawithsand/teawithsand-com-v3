import { Point } from "@app/Component/Paint/primitive";
import { euclideanDistance } from "@app/Component/Paint/transform";
import PaintManagerMutation from "@app/Component/Paint/paint/scene/mutation/PaintManagerMutation";
import PaintScene from "@app/Component/Paint/paint/scene/PaintScene";
import PaintUIState from "@app/Component/Paint/paint/ui/PaintUIState";
import ActivePaintTool from "../ActivePaintTool";
import PaintTool from "../PaintTool";
import PaintToolCallbacks from "../PaintToolCallbacks";
import AppendPaintManagerMutation from "../../../scene/mutation/AppendPaintManagerMutation";

export default class PathPaintTool implements PaintTool {
    activate = (callbacks: PaintToolCallbacks, scene: PaintScene, state: PaintUIState): ActivePaintTool => {
        let wasMousePressed = false

        let paths: Point[][] = [
        ]

        let currentPath: Point[] = []

        const computeMutations = (): PaintManagerMutation[] => {
            let sz = 0
            for (const p of [...paths, currentPath]) {
                sz += p.length
            }
            console.log("mutation size", sz)
            return [
                new AppendPaintManagerMutation(
                    [
                        ...paths,
                        currentPath
                    ].map(p => ({
                        type: "path",
                        points: p,
                        props: {
                            action: "stroke",
                            strokeCap: "butt",
                            strokeColor: [0, 0, 0],
                            strokeSize: 10,
                        }
                    }))
                )
            ]
        }

        console.log("done tool activation!")

        return {
            callbacks,
            processInput: (i) => {
                if (i.type === "mouse") {
                    const p: Point = [i.x, i.y]

                    try {
                        if (!wasMousePressed && i.pressed) {
                            currentPath = [
                                [i.x, i.y]
                            ]

                            callbacks.notifyMutationsChanged(computeMutations())
                        } else if (wasMousePressed && i.pressed) {
                            const delta = euclideanDistance(currentPath[currentPath.length - 1], p)
                            if (delta >= 4) {
                                // ignore smaller changes
                                currentPath.push(p)

                                callbacks.notifyMutationsChanged(computeMutations())
                            }
                        } else if (wasMousePressed && !i.pressed) {
                            // always push end of path, even if delta is small
                            currentPath.push(p)
                            if (currentPath.length > 0) {
                                paths.push(currentPath)
                            }
                            currentPath = []

                            callbacks.notifyMutationsChanged(computeMutations())
                        }
                        return {
                            type: "processed",
                        }
                    } finally {
                        wasMousePressed = i.pressed
                    }
                }

                return {
                    type: "ignored",
                }
            },
            updateUIState: (s) => {
                state = s
            },
            close: () => {
                // nothing to release
            },
        }
    }
}