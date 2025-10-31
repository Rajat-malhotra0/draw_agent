import { useRef, useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import "./Canvas.css";

let socket = null;

function Canvas({ tool, color, strokeWidth, isProcessing, setIsProcessing }) {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [context, setContext] = useState(null);
    const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - 50;

        const ctx = canvas.getContext("2d");
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        setContext(ctx);

        // Initialize Socket.IO connection
        socket = io("http://localhost:3000");

        socket.on("connect", () => {
            console.log("Connected to server");
        });

        socket.on("llm-draw", (data) => {
            handleLLMDraw(ctx, data);
        });

        socket.on("clear", () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        });

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight - 50;
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            if (socket) socket.disconnect();
        };
    }, []);

    const handleLLMDraw = (ctx, { action, data }) => {
        switch (action) {
            case "line":
                ctx.beginPath();
                ctx.moveTo(data.from.x, data.from.y);
                ctx.lineTo(data.to.x, data.to.y);
                ctx.strokeStyle = data.color || "#FF6B6B";
                ctx.lineWidth = data.width || 2;
                ctx.stroke();
                break;
            case "text":
                ctx.font = `${data.size || 16}px Arial`;
                ctx.fillStyle = data.color || "#000000";
                ctx.fillText(data.text, data.x, data.y);
                break;
            case "clear":
                ctx.clearRect(
                    0,
                    0,
                    canvasRef.current.width,
                    canvasRef.current.height
                );
                break;
        }
    };

    const startDrawing = (e) => {
        if (tool !== "pen" && tool !== "eraser") return;

        setIsDrawing(true);
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setLastPos({ x, y });
    };

    const draw = (e) => {
        if (!isDrawing || !context) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        context.beginPath();
        context.moveTo(lastPos.x, lastPos.y);
        context.lineTo(x, y);
        context.strokeStyle = tool === "eraser" ? "#fafafa" : color;
        context.lineWidth = tool === "eraser" ? strokeWidth * 3 : strokeWidth;
        context.stroke();

        setLastPos({ x, y });
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        if (!context) return;
        context.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
        );
    };

    const solveCanvas = async () => {
        if (!canvasRef.current || isProcessing) return;

        setIsProcessing(true);
        try {
            const imageData = canvasRef.current.toDataURL("image/png");

            const response = await axios.post("/api/ai/solve", {
                image: imageData,
                options: { stepByStep: true },
            });

            if (response.data.success) {
                const { answer, toolCalls } = response.data.solution;

                console.log(
                    "Solution received, tool calls:",
                    toolCalls?.length || 0
                );

                // Show solution
                showSolution(answer);
            } else {
                alert("Error solving problem");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to solve: " + error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const showSolution = (answer) => {
        // Create a better solution display
        const solutionDiv = document.createElement("div");
        solutionDiv.className = "solution-overlay";
        solutionDiv.innerHTML = `
            <div class="solution-box">
                <h3>Solution</h3>
                <div class="solution-content">${answer.replace(
                    /\n/g,
                    "<br/>"
                )}</div>
                <button onclick="this.parentElement.parentElement.remove()">Close</button>
            </div>
        `;
        document.body.appendChild(solutionDiv);
    };

    return (
        <div className="canvas-wrapper">
            <canvas
                ref={canvasRef}
                className="drawing-canvas"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
            />

            <div className="canvas-actions">
                <button className="action-btn clear-btn" onClick={clearCanvas}>
                    Clear
                </button>
                <button
                    className="action-btn solve-btn"
                    onClick={solveCanvas}
                    disabled={isProcessing}
                >
                    {isProcessing ? "Solving..." : "Solve"}
                </button>
            </div>
        </div>
    );
}

export default Canvas;
