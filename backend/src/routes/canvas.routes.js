import { Hono } from "hono";

const app = new Hono();

// Store canvas state (in production, use Redis or similar)
let canvasState = {
    strokes: [],
    currentImage: null,
};

/**
 * POST /api/canvas/draw
 * LLM can send drawing commands
 */
app.post("/draw", async (c) => {
    try {
        const { action, data } = await c.req.json();

        switch (action) {
            case "line":
                // Draw a line: { from: {x, y}, to: {x, y}, color, width }
                canvasState.strokes.push({ type: "line", ...data });
                break;
            case "text":
                // Draw text: { x, y, text, color, size }
                canvasState.strokes.push({ type: "text", ...data });
                break;
            case "clear":
                // Clear canvas
                canvasState.strokes = [];
                break;
            default:
                return c.json({ success: false, error: "Unknown action" }, 400);
        }

        // Broadcast to connected clients via socket
        const { io } = await import("../server.js");
        io.emit("llm-draw", { action, data });

        return c.json({
            success: true,
            message: "Drawing command executed",
            strokeCount: canvasState.strokes.length,
        });
    } catch (error) {
        console.error("Error in /draw:", error);
        return c.json(
            {
                success: false,
                error: error.message,
            },
            500
        );
    }
});

/**
 * GET /api/canvas/state
 * Get current canvas state
 */
app.get("/state", async (c) => {
    return c.json({
        success: true,
        state: canvasState,
    });
});

/**
 * POST /api/canvas/image
 * Store current canvas image
 */
app.post("/image", async (c) => {
    try {
        const { image } = await c.req.json();
        canvasState.currentImage = image;

        return c.json({
            success: true,
            message: "Canvas image stored",
        });
    } catch (error) {
        return c.json(
            {
                success: false,
                error: error.message,
            },
            500
        );
    }
});

export default app;
