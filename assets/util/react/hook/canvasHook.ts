import { useEffect, useRef } from "react"

export const useCanvasAnimation = (draw: (ctx: CanvasRenderingContext2D, frame: number) => void) => {

    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (canvas !== null) {
            const context = canvas.getContext('2d')
            if (context === null) {
                return () => { }
            }
            
            let frameCount = 0
            let animationFrameId: any

            const render = () => {
                frameCount++
                draw(context, frameCount)
                animationFrameId = window.requestAnimationFrame(render)
            }
            render()

            return () => {
                window.cancelAnimationFrame(animationFrameId)
            }
        } else {
            return () => { }
        }
    }, [draw])

    return canvasRef
}