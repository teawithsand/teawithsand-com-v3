export type ToolActivationResult<P> = {
    initialProps: P,
    activeTool: ActiveTool
}
export default interface ActiveTool {
    /**
     * Releases all tool's resources.
     */
    close(): void
}
