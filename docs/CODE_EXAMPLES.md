# 💻 Code Examples & Implementation Snippets

Complete code examples for building the AI Drawing Canvas with Groq integration.

---

## 🤖 Groq API Integration

### Using Llama 4 Scout Vision Model

Based on your code snippet, here's the complete implementation:

```javascript
import { Groq } from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

async function analyzeMathProblem(imageBase64) {
    const chatCompletion = await groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: "Analyze this mathematical problem. Solve it step by step and explain your reasoning. Format your response so it can be drawn on a canvas.",
                    },
                    {
                        type: "image_url",
                        image_url: {
                            url: `data:image/png;base64,${imageBase64}`,
                        },
                    },
                ],
            },
        ],
        model: "meta-llama/llama-4-scout-17b-16e-instruct", // Vision-capable model
        temperature: 1,
        max_completion_tokens: 1024,
        top_p: 1,
        stream: false,
        stop: null,
    });

    return chatCompletion.choices[0].message.content;
}

// Usage
const base64Image = canvasToBase64();
const solution = await analyzeMathProblem(base64Image);
console.log(solution);
```

### Alternative: Using URL Instead of Base64

```javascript
async function analyzeFromURL(imageUrl) {
    const chatCompletion = await groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: "What mathematical problem is shown in this image? Solve it.",
                    },
                    {
                        type: "image_url",
                        image_url: {
                            url: imageUrl, // Direct URL
                        },
                    },
                ],
            },
        ],
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        temperature: 0.3, // Lower temperature for more accurate math
        max_completion_tokens: 2000,
    });

    return chatCompletion.choices[0].message.content;
}
```

### Streaming Responses for Real-time Display

```javascript
async function solveMathProblemStreaming(imageBase64, onChunk) {
    const stream = await groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: "Solve this math problem step by step.",
                    },
                    {
                        type: "image_url",
                        image_url: {
                            url: `data:image/png;base64,${imageBase64}`,
                        },
                    },
                ],
            },
        ],
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        stream: true,
        temperature: 0.5,
    });

    for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        onChunk(content); // Call callback with each chunk
    }
}

// Usage
await solveMathProblemStreaming(imageBase64, (chunk) => {
    // Update UI with each chunk
    appendToDisplay(chunk);
});
```

---

## 🎨 Canvas Drawing Implementation

### Basic HTML5 Canvas Setup

```javascript
// DrawingCanvas.js
class DrawingCanvas {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.isDrawing = false;
        this.strokes = [];
        this.currentStroke = [];

        this.setupCanvas();
        this.attachEventListeners();
    }

    setupCanvas() {
        // Make canvas responsive
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;

        // Set default drawing properties
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";
        this.ctx.strokeStyle = "#000000";
    }

    attachEventListeners() {
        // Mouse events
        this.canvas.addEventListener("mousedown", (e) => this.startDrawing(e));
        this.canvas.addEventListener("mousemove", (e) => this.draw(e));
        this.canvas.addEventListener("mouseup", () => this.stopDrawing());
        this.canvas.addEventListener("mouseout", () => this.stopDrawing());

        // Touch events for mobile
        this.canvas.addEventListener("touchstart", (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.startDrawing(touch);
        });

        this.canvas.addEventListener("touchmove", (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.draw(touch);
        });

        this.canvas.addEventListener("touchend", (e) => {
            e.preventDefault();
            this.stopDrawing();
        });
    }

    getCoordinates(event) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
    }

    startDrawing(event) {
        this.isDrawing = true;
        const coords = this.getCoordinates(event);
        this.currentStroke = [coords];
        this.ctx.beginPath();
        this.ctx.moveTo(coords.x, coords.y);
    }

    draw(event) {
        if (!this.isDrawing) return;

        const coords = this.getCoordinates(event);
        this.currentStroke.push(coords);

        this.ctx.lineTo(coords.x, coords.y);
        this.ctx.stroke();
    }

    stopDrawing() {
        if (this.isDrawing) {
            this.strokes.push({
                points: [...this.currentStroke],
                color: this.ctx.strokeStyle,
                width: this.ctx.lineWidth,
            });
            this.currentStroke = [];
        }
        this.isDrawing = false;
        this.ctx.beginPath();
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.strokes = [];
    }

    undo() {
        if (this.strokes.length > 0) {
            this.strokes.pop();
            this.redraw();
        }
    }

    redraw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.strokes.forEach((stroke) => {
            this.ctx.strokeStyle = stroke.color;
            this.ctx.lineWidth = stroke.width;
            this.ctx.beginPath();
            stroke.points.forEach((point, index) => {
                if (index === 0) {
                    this.ctx.moveTo(point.x, point.y);
                } else {
                    this.ctx.lineTo(point.x, point.y);
                }
            });
            this.ctx.stroke();
        });
    }

    toBase64() {
        return this.canvas.toDataURL("image/png").split(",")[1];
    }

    toBlob(callback) {
        this.canvas.toBlob(callback, "image/png");
    }
}

// Usage
const drawingCanvas = new DrawingCanvas("myCanvas");
```

### React Implementation with Hooks

```jsx
// components/Canvas/DrawingCanvas.jsx
import React, { useRef, useState, useEffect } from "react";

const DrawingCanvas = ({ onSolve }) => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [context, setContext] = useState(null);
    const [strokes, setStrokes] = useState([]);
    const [currentStroke, setCurrentStroke] = useState([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        // Set canvas size
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        // Set drawing properties
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = "#000000";

        setContext(ctx);
    }, []);

    const startDrawing = (e) => {
        const coords = getCoordinates(e);
        setIsDrawing(true);
        setCurrentStroke([coords]);
        context.beginPath();
        context.moveTo(coords.x, coords.y);
    };

    const draw = (e) => {
        if (!isDrawing) return;

        const coords = getCoordinates(e);
        setCurrentStroke((prev) => [...prev, coords]);

        context.lineTo(coords.x, coords.y);
        context.stroke();
    };

    const stopDrawing = () => {
        if (isDrawing && currentStroke.length > 0) {
            setStrokes((prev) => [
                ...prev,
                {
                    points: currentStroke,
                    color: context.strokeStyle,
                    width: context.lineWidth,
                },
            ]);
            setCurrentStroke([]);
        }
        setIsDrawing(false);
        context.beginPath();
    };

    const getCoordinates = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const clientX = e.clientX || e.touches?.[0]?.clientX;
        const clientY = e.clientY || e.touches?.[0]?.clientY;
        return {
            x: clientX - rect.left,
            y: clientY - rect.top,
        };
    };

    const clearCanvas = () => {
        context.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
        );
        setStrokes([]);
    };

    const undo = () => {
        if (strokes.length > 0) {
            const newStrokes = strokes.slice(0, -1);
            setStrokes(newStrokes);
            redraw(newStrokes);
        }
    };

    const redraw = (strokesToDraw) => {
        const canvas = canvasRef.current;
        context.clearRect(0, 0, canvas.width, canvas.height);

        strokesToDraw.forEach((stroke) => {
            context.strokeStyle = stroke.color;
            context.lineWidth = stroke.width;
            context.beginPath();
            stroke.points.forEach((point, index) => {
                if (index === 0) {
                    context.moveTo(point.x, point.y);
                } else {
                    context.lineTo(point.x, point.y);
                }
            });
            context.stroke();
        });
    };

    const handleSolve = async () => {
        const base64 = canvasRef.current.toDataURL("image/png").split(",")[1];
        await onSolve(base64);
    };

    return (
        <div className="canvas-container">
            <canvas
                ref={canvasRef}
                className="drawing-canvas"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseOut={stopDrawing}
                onTouchStart={(e) => {
                    e.preventDefault();
                    startDrawing(e);
                }}
                onTouchMove={(e) => {
                    e.preventDefault();
                    draw(e);
                }}
                onTouchEnd={(e) => {
                    e.preventDefault();
                    stopDrawing();
                }}
                style={{
                    border: "2px solid #000",
                    cursor: "crosshair",
                    touchAction: "none",
                }}
            />
            <div className="canvas-controls">
                <button onClick={clearCanvas}>Clear</button>
                <button onClick={undo}>Undo</button>
                <button onClick={handleSolve}>Solve</button>
            </div>
        </div>
    );
};

export default DrawingCanvas;
```

---

## 🖥️ Backend API Implementation

### Express.js Server Setup

```javascript
// backend/src/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Groq } from "groq-sdk";
import multer from "multer";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Groq client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Configure multer for file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Health check
app.get("/api/health", (req, res) => {
    res.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        version: "1.0.0",
    });
});

// Solve math problem from image
app.post("/api/ai/solve", async (req, res) => {
    try {
        const { image, options = {} } = req.body;

        if (!image) {
            return res.status(400).json({
                success: false,
                error: "No image provided",
            });
        }

        const prompt = options.stepByStep
            ? "Solve this mathematical problem step by step. Show all your work and explain each step clearly."
            : "Solve this mathematical problem.";

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: prompt },
                        {
                            type: "image_url",
                            image_url: {
                                url: image.startsWith("data:")
                                    ? image
                                    : `data:image/png;base64,${image}`,
                            },
                        },
                    ],
                },
            ],
            model: "meta-llama/llama-4-scout-17b-16e-instruct",
            temperature: 0.3,
            max_completion_tokens: 2000,
        });

        const solution = chatCompletion.choices[0].message.content;

        res.json({
            success: true,
            solution: {
                answer: solution,
                steps: parseSteps(solution),
                drawingInstructions: generateDrawingInstructions(solution),
            },
        });
    } catch (error) {
        console.error("Error solving problem:", error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

// Parse solution into steps
function parseSteps(solution) {
    const lines = solution.split("\n").filter((line) => line.trim());
    return lines.map((line, index) => ({
        step: index + 1,
        content: line,
        action: extractAction(line),
    }));
}

// Extract action from step
function extractAction(line) {
    // Simple heuristic - improve with better parsing
    if (line.toLowerCase().includes("add") || line.includes("+")) {
        return "addition";
    } else if (line.toLowerCase().includes("subtract") || line.includes("-")) {
        return "subtraction";
    } else if (
        line.toLowerCase().includes("multiply") ||
        line.includes("×") ||
        line.includes("*")
    ) {
        return "multiplication";
    } else if (
        line.toLowerCase().includes("divide") ||
        line.includes("÷") ||
        line.includes("/")
    ) {
        return "division";
    }
    return "explanation";
}

// Generate drawing instructions for AI
function generateDrawingInstructions(solution) {
    const steps = parseSteps(solution);
    const instructions = [];

    let y = 100;
    steps.forEach((step, index) => {
        instructions.push({
            type: "text",
            content: step.content,
            position: { x: 50, y: y },
            style: {
                fontSize: 16,
                color: "#0066cc",
                font: "Arial",
            },
        });

        if (index < steps.length - 1) {
            instructions.push({
                type: "arrow",
                from: { x: 30, y: y + 10 },
                to: { x: 30, y: y + 40 },
                style: {
                    color: "#0066cc",
                    width: 2,
                },
            });
        }

        y += 50;
    });

    return instructions;
}

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
});
```

### API Service (Frontend)

```javascript
// frontend/src/services/api.js
import axios from "axios";

const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Add any auth tokens here if needed
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const message = error.response?.data?.error || error.message;
        console.error("API Error:", message);
        throw new Error(message);
    }
);

export const solveMathProblem = async (imageBase64, options = {}) => {
    return api.post("/ai/solve", {
        image: imageBase64,
        options,
    });
};

export const analyzeDrawing = async (imageBase64) => {
    return api.post("/ai/analyze", { image: imageBase64 });
};

export const saveCanvas = async (canvasData, metadata) => {
    return api.post("/canvas/save", { canvasData, metadata });
};

export const loadCanvas = async (canvasId) => {
    return api.get(`/canvas/${canvasId}`);
};

export default api;
```

---

## 🔌 WebSocket Integration

### Socket.io Server Setup

```javascript
// backend/src/websocket/socketHandler.js
import { Server } from "socket.io";

export function setupWebSocket(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: process.env.CORS_ORIGIN || "http://localhost:5173",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log("Client connected:", socket.id);

        // Handle drawing events
        socket.on("drawing:stroke", (data) => {
            socket.broadcast.emit("drawing:update", {
                userId: socket.id,
                ...data,
            });
        });

        // Handle AI requests
        socket.on("ai:request", async (data) => {
            try {
                socket.emit("ai:thinking", { status: "analyzing" });

                // Process with Groq API
                const result = await processAIRequest(data);

                socket.emit("ai:response", result);

                // Animate AI drawing
                if (result.drawingInstructions) {
                    await animateAIDrawing(socket, result.drawingInstructions);
                }
            } catch (error) {
                socket.emit("ai:error", { message: error.message });
            }
        });

        // Handle chat messages
        socket.on("chat:message", (data) => {
            io.emit("chat:message", {
                sender: socket.id,
                ...data,
                timestamp: new Date().toISOString(),
            });
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
            io.emit("user:left", { userId: socket.id });
        });
    });

    return io;
}

async function animateAIDrawing(socket, instructions) {
    socket.emit("ai:drawing:start");

    for (const instruction of instructions) {
        await new Promise((resolve) => setTimeout(resolve, 300)); // Delay for animation
        socket.emit("ai:drawing:stroke", instruction);
    }

    socket.emit("ai:drawing:complete");
}
```

### Socket.io Client (React)

```javascript
// frontend/src/hooks/useWebSocket.js
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export const useWebSocket = (url) => {
    const socketRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const [aiStatus, setAiStatus] = useState(null);

    useEffect(() => {
        socketRef.current = io(url);

        socketRef.current.on("connect", () => {
            console.log("Connected to WebSocket");
            setIsConnected(true);
        });

        socketRef.current.on("disconnect", () => {
            console.log("Disconnected from WebSocket");
            setIsConnected(false);
        });

        socketRef.current.on("ai:thinking", (data) => {
            setAiStatus(data.status);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, [url]);

    const emitDrawingStroke = (strokeData) => {
        socketRef.current.emit("drawing:stroke", strokeData);
    };

    const requestAISolution = (data) => {
        socketRef.current.emit("ai:request", data);
    };

    const sendChatMessage = (message) => {
        socketRef.current.emit("chat:message", { message });
    };

    const onAIResponse = (callback) => {
        socketRef.current.on("ai:response", callback);
    };

    const onAIDrawing = (callback) => {
        socketRef.current.on("ai:drawing:stroke", callback);
    };

    return {
        isConnected,
        aiStatus,
        emitDrawingStroke,
        requestAISolution,
        sendChatMessage,
        onAIResponse,
        onAIDrawing,
    };
};
```

---

## 🎯 Complete React App Example

```jsx
// frontend/src/App.jsx
import React, { useState } from "react";
import DrawingCanvas from "./components/Canvas/DrawingCanvas";
import ChatPanel from "./components/AI/ChatPanel";
import { solveMathProblem } from "./services/api";
import "./App.css";

function App() {
    const [solution, setSolution] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSolve = async (imageBase64) => {
        setLoading(true);
        setError(null);

        try {
            const result = await solveMathProblem(imageBase64, {
                stepByStep: true,
                includeDiagram: true,
            });

            setSolution(result.solution);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app">
            <header className="app-header">
                <h1>AI Math Canvas</h1>
                <p>Draw a math problem and let AI solve it!</p>
            </header>

            <main className="app-main">
                <div className="canvas-section">
                    <DrawingCanvas onSolve={handleSolve} />
                    {loading && (
                        <div className="loading">AI is thinking...</div>
                    )}
                    {error && <div className="error">{error}</div>}
                </div>

                <div className="solution-section">
                    {solution && (
                        <div className="solution-display">
                            <h2>Solution:</h2>
                            <div className="solution-content">
                                {solution.answer}
                            </div>
                            {solution.steps && (
                                <div className="solution-steps">
                                    <h3>Steps:</h3>
                                    {solution.steps.map((step, index) => (
                                        <div key={index} className="step">
                                            <strong>Step {step.step}:</strong>{" "}
                                            {step.content}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <ChatPanel />
            </main>
        </div>
    );
}

export default App;
```

---

## 📦 Package.json Files

### Backend package.json

```json
{
    "name": "draw-agent-backend",
    "version": "1.0.0",
    "type": "module",
    "description": "AI Drawing Canvas Backend with Groq",
    "main": "src/server.js",
    "scripts": {
        "dev": "nodemon src/server.js",
        "start": "node src/server.js",
        "test": "jest"
    },
    "dependencies": {
        "express": "^4.18.2",
        "cors": "^2.8.5",
        "dotenv": "^16.3.1",
        "groq-sdk": "^0.7.0",
        "socket.io": "^4.7.2",
        "multer": "^1.4.5-lts.1",
        "sharp": "^0.33.0"
    },
    "devDependencies": {
        "nodemon": "^3.0.1"
    }
}
```

### Frontend package.json

```json
{
    "name": "draw-agent-frontend",
    "version": "1.0.0",
    "type": "module",
    "scripts": {
        "dev": "vite",
        "build": "vite build",
        "preview": "vite preview"
    },
    "dependencies": {
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "axios": "^1.6.2",
        "socket.io-client": "^4.7.2",
        "fabric": "^5.3.0"
    },
    "devDependencies": {
        "@types/react": "^18.2.43",
        "@types/react-dom": "^18.2.17",
        "@vitejs/plugin-react": "^4.2.1",
        "vite": "^5.0.8",
        "tailwindcss": "^3.3.6",
        "postcss": "^8.4.32",
        "autoprefixer": "^10.4.16"
    }
}
```

---

## 🔐 Environment Variables

### Backend .env.example

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Groq API
GROQ_API_KEY=your_groq_api_key_here

# CORS
CORS_ORIGIN=http://localhost:5173

# Optional: OCR Service
GOOGLE_VISION_API_KEY=your_google_vision_key
```

### Frontend .env.example

```env
# API Configuration
VITE_API_URL=http://localhost:3000/api
VITE_WS_URL=http://localhost:3000
```

---

**Ready to start coding!** 🚀 Use these examples as a foundation for your project.
