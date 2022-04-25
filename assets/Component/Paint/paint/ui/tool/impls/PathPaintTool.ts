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

        let paths: Path2D[] = [
        ]

        let currentPath: Path2D = new Path2D

        const computeMutations = (): PaintManagerMutation[] => {
            return [
                new AppendPaintManagerMutation(
                    [
                        ...paths,
                        currentPath
                    ].map(p => ({
                        type: "path",
                        path: p,
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

        let lastPoint: Point | null = null
        let currentPathSize = 0
        return {
            callbacks,
            processInput: (i) => {
                if (i.type === "mouse") {
                    const p: Point = [i.x, i.y]

                    try {
                        if (!wasMousePressed && i.pressed) {
                            currentPath = new Path2D
                            currentPath.moveTo(p[0], p[1])

                            lastPoint = null
                            currentPathSize = 1

                            callbacks.notifyMutationsChanged(computeMutations())
                        } else if (wasMousePressed && i.pressed) {
                            const delta = lastPoint === null ? 100000 : euclideanDistance(lastPoint, p)
                            if (delta >= 4) {
                                // ignore smaller changes
                                currentPath.lineTo(p[0], p[1])
                                currentPathSize++
                                lastPoint = p

                                callbacks.notifyMutationsChanged(computeMutations())
                            }
                        } else if (wasMousePressed && !i.pressed) {
                            // always push end of path, even if delta is small
                            currentPath.lineTo(p[0], p[1])
                            if (currentPathSize > 0) {
                                paths.push(currentPath)
                            }

                            currentPath = new Path2D
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