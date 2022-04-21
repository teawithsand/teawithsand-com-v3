import React, { useEffect, useRef } from "react"

const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#000000'
    ctx.beginPath()
    ctx.arc(50, 100, 20, 0, 2*Math.PI)
    ctx.fill()
}

export default () => {
    const canvasRef = useRef<HTMLCanvasElement>()
    useEffect(() => {
        if(canvasRef.current) {
            const canvas = canvasRef.current
            const context = canvas.getContext('2d')
            draw(context)
        }
    }, [])
    return <canvas width={200} height={200} ref={canvasRef} />
}