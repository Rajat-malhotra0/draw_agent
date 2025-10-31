import { Hono } from "hono";
import { solveMathProblem, testConnection } from "../services/groqService.js";

const app = new Hono();

/**
 * POST /api/ai/solve
 * Solve a math problem from an image
 */
app.post("/solve", async (c) => {
    try {
        const body = await c.req.json();
        const { image, options = {} } = body;

        // Validate input
        if (!image) {
            return c.json(
                {
                    success: false,
                    error: { message: "No image provided" },
                },
                400
            );
        }

        // Check if Groq API key is configured
        if (!process.env.GROQ_API_KEY) {
            return c.json(
                {
                    success: false,
                    error: {
                        message:
                            "Groq API key not configured. Please set GROQ_API_KEY in .env file.",
                    },
                },
                500
            );
        }

        console.log("Received solve request");

        // Call Groq service
        const result = await solveMathProblem(image, options);

        // Draw the solution on canvas when solution is found
        if (result.success) {
            const { io } = await import("../server.js");
            const answer = result.solution.answer;

            console.log("Full AI response:", answer);

            // Extract the final answer more intelligently
            let finalAnswer = null;

            // Try multiple patterns to extract the answer
            const patterns = [
                /(?:final answer|answer|result|solution)(?:\s+is)?[:\s=]+([^.\n]+)/i,
                /therefore[,:]?\s*([^.\n]+)/i,
                /=\s*([^.\n=]+?)(?:\.|$)/i,
                /^([^.\n]+)$/m, // Last line as fallback
            ];

            for (const pattern of patterns) {
                const match = answer.match(pattern);
                if (match && match[1]) {
                    finalAnswer = match[1].trim();
                    // Clean up common artifacts
                    finalAnswer = finalAnswer
                        .replace(/\*\*/g, "") // Remove markdown bold
                        .replace(/^\*+|\*+$/g, "") // Remove leading/trailing asterisks
                        .replace(/^[-–—]\s*/, "") // Remove leading dashes
                        .replace(/\$/g, "") // Remove dollar signs
                        .trim();
                    if (finalAnswer.length > 0 && finalAnswer.length < 50) {
                        break;
                    }
                }
            }

            // If still no answer, take last meaningful line
            if (!finalAnswer || finalAnswer.length === 0) {
                const lines = answer
                    .split("\n")
                    .filter((l) => l.trim().length > 0);
                finalAnswer = lines[lines.length - 1].trim();
            }

            console.log("Extracted answer:", finalAnswer);

            // Draw a bigger, nicer checkmark in green
            setTimeout(() => {
                io.emit("llm-draw", {
                    action: "line",
                    data: {
                        from: { x: 50, y: 100 },
                        to: { x: 75, y: 130 },
                        color: "#4CAF50",
                        width: 5,
                    },
                });
            }, 300);

            setTimeout(() => {
                io.emit("llm-draw", {
                    action: "line",
                    data: {
                        from: { x: 75, y: 130 },
                        to: { x: 120, y: 70 },
                        color: "#4CAF50",
                        width: 5,
                    },
                });
            }, 500);

            // Draw "Answer:" label
            setTimeout(() => {
                io.emit("llm-draw", {
                    action: "text",
                    data: {
                        text: "Answer:",
                        x: 150,
                        y: 100,
                        color: "#666666",
                        size: 20,
                    },
                });
            }, 700);

            // Draw the actual answer in larger, bold blue text
            setTimeout(() => {
                io.emit("llm-draw", {
                    action: "text",
                    data: {
                        text: finalAnswer,
                        x: 250,
                        y: 100,
                        color: "#1E90FF",
                        size: 28,
                    },
                });
            }, 900);

            // If there are actual tool calls from LLM, execute them too
            if (
                result.solution.toolCalls &&
                result.solution.toolCalls.length > 0
            ) {
                for (const toolCall of result.solution.toolCalls) {
                    if (toolCall.function.name === "draw_on_canvas") {
                        try {
                            const args = JSON.parse(
                                toolCall.function.arguments
                            );
                            console.log("Executing LLM tool call:", args);
                            io.emit("llm-draw", args);
                            await new Promise((resolve) =>
                                setTimeout(resolve, 100)
                            );
                        } catch (parseError) {
                            console.error(
                                "Error parsing tool call arguments:",
                                parseError
                            );
                        }
                    }
                }
            }
        }

        return c.json(result);
    } catch (error) {
        console.error("Error in /solve:", error);
        return c.json(
            {
                success: false,
                error: { message: error.message },
            },
            500
        );
    }
});

/**
 * GET /api/ai/test
 * Test the Groq API connection
 */
app.get("/test", async (c) => {
    try {
        console.log("🧪 Testing Groq API connection...");

        if (!process.env.GROQ_API_KEY) {
            return c.json(
                {
                    success: false,
                    error: { message: "Groq API key not configured" },
                },
                500
            );
        }

        const result = await testConnection();
        return c.json(result);
    } catch (error) {
        console.error("Error in /test:", error);
        return c.json(
            {
                success: false,
                error: { message: error.message },
            },
            500
        );
    }
});

/**
 * POST /api/ai/analyze
 * Analyze an image without solving (for testing)
 */
app.post("/analyze", async (c) => {
    try {
        const body = await c.req.json();
        const { image } = body;

        if (!image) {
            return c.json(
                {
                    success: false,
                    error: { message: "No image provided" },
                },
                400
            );
        }

        console.log("🔍 Received analyze request");

        return c.json({
            success: true,
            message: "Image received successfully",
            imageSize: image.length,
            format: image.substring(0, 30) + "...",
        });
    } catch (error) {
        console.error("Error in /analyze:", error);
        return c.json(
            {
                success: false,
                error: { message: error.message },
            },
            500
        );
    }
});

export default app;
