import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { Server } from "socket.io";
import aiRoutes from "./routes/ai.routes.js";
import canvasRoutes from "./routes/canvas.routes.js";

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from backend/.env
dotenv.config({ path: join(__dirname, "..", ".env") });

const app = new Hono();
const PORT = process.env.PORT || 3000;

// CORS middleware
app.use(
    "/*",
    cors({
        origin: process.env.CORS_ORIGIN || "http://localhost:5173",
        credentials: true,
    })
);

// Health check endpoint
app.get("/api/health", (c) => {
    return c.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        version: "1.0.0",
        groqConfigured: !!process.env.GROQ_API_KEY,
    });
});

// API routes
app.route("/api/ai", aiRoutes);
app.route("/api/canvas", canvasRoutes);

// 404 handler
app.notFound((c) => {
    return c.json(
        {
            success: false,
            error: { message: "Route not found" },
        },
        404
    );
});

// Error handling
app.onError((err, c) => {
    console.error("Error:", err);
    return c.json(
        {
            success: false,
            error: {
                message: err.message || "Internal server error",
                ...(process.env.NODE_ENV === "development" && {
                    stack: err.stack,
                }),
            },
        },
        500
    );
});

// Start server
console.log(`Server starting on port ${PORT}`);
console.log(`Health check: http://localhost:${PORT}/api/health`);
console.log(
    `Groq API Key: ${process.env.GROQ_API_KEY ? "Configured" : "Missing"}`
);

const server = serve({
    fetch: app.fetch,
    port: PORT,
});

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN || "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});

// Socket.IO connection handling
io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("draw", (data) => {
        // Broadcast drawing data to all other clients
        socket.broadcast.emit("draw", data);
    });

    socket.on("clear", () => {
        // Broadcast clear event to all clients
        socket.broadcast.emit("clear");
    });

    socket.on("llm-draw", (data) => {
        // LLM drawing commands
        io.emit("llm-draw", data);
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

export { io };
export default app;
