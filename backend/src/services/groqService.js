import Groq from "groq-sdk";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Get current directory and load .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "..", "..", ".env") });

// Initialize Groq client only if API key is available
let groq = null;

if (process.env.GROQ_API_KEY) {
    groq = new Groq({
        apiKey: process.env.GROQ_API_KEY,
    });
    console.log("✅ Groq client initialized");
} else {
    console.warn(
        "⚠️  GROQ_API_KEY not set. Groq features will be unavailable."
    );
}

/**
 * Analyze and solve a math problem from an image with tool calling
 * @param {string} imageBase64 - Base64 encoded image
 * @param {Object} options - Options for solving
 * @returns {Promise<Object>} - Solution object
 */
export async function solveMathProblem(imageBase64, options = {}) {
    if (!groq) {
        throw new Error(
            "Groq API client not initialized. Please set GROQ_API_KEY environment variable."
        );
    }

    try {
        // Prepare the image URL
        const imageUrl = imageBase64.startsWith("data:")
            ? imageBase64
            : `data:image/png;base64,${imageBase64}`;

        // Construct the prompt with tool instruction
        const prompt = options.stepByStep
            ? "Analyze this mathematical problem. Solve it step by step and explain your reasoning clearly. Format your response with clear step numbers. If you need to draw or annotate the solution, use the draw_on_canvas tool."
            : "Solve this mathematical problem and provide the answer. If you need to draw or annotate, use the draw_on_canvas tool.";

        console.log("Calling Groq API...");

        const tools = [
            {
                type: "function",
                function: {
                    name: "draw_on_canvas",
                    description:
                        "Draw lines, shapes, or text on the canvas to visualize or annotate the solution",
                    parameters: {
                        type: "object",
                        properties: {
                            action: {
                                type: "string",
                                enum: ["line", "text", "clear"],
                                description: "The drawing action to perform",
                            },
                            data: {
                                type: "object",
                                description: "Drawing data based on action",
                                properties: {
                                    from: {
                                        type: "object",
                                        properties: {
                                            x: { type: "number" },
                                            y: { type: "number" },
                                        },
                                    },
                                    to: {
                                        type: "object",
                                        properties: {
                                            x: { type: "number" },
                                            y: { type: "number" },
                                        },
                                    },
                                    text: { type: "string" },
                                    x: { type: "number" },
                                    y: { type: "number" },
                                    color: { type: "string" },
                                    width: { type: "number" },
                                    size: { type: "number" },
                                },
                            },
                        },
                        required: ["action", "data"],
                    },
                },
            },
        ];

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: prompt,
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: imageUrl,
                            },
                        },
                    ],
                },
            ],
            model: "meta-llama/llama-4-scout-17b-16e-instruct",
            temperature: options.temperature || 0.3,
            max_completion_tokens: options.maxTokens || 2000,
            top_p: 1,
            stream: false,
            tools: tools,
            tool_choice: "auto",
        });

        const solution = chatCompletion.choices[0].message.content;
        const toolCalls = chatCompletion.choices[0].message.tool_calls;

        console.log("Groq API response received");

        return {
            success: true,
            solution: {
                answer: solution,
                steps: parseSteps(solution),
                model: "llama-4-scout-17b-16e-instruct",
                tokensUsed: chatCompletion.usage?.total_tokens || 0,
                toolCalls: toolCalls || [],
            },
        };
    } catch (error) {
        console.error("Groq API error:", error.message);
        throw new Error(`Failed to solve problem: ${error.message}`);
    }
}

/**
 * Parse solution text into steps
 * @param {string} solution - The solution text
 * @returns {Array} - Array of step objects
 */
function parseSteps(solution) {
    const lines = solution.split("\n").filter((line) => line.trim());
    const steps = [];

    lines.forEach((line, index) => {
        // Look for step indicators like "Step 1:", "1.", etc.
        const stepMatch = line.match(/^(?:Step\s+)?(\d+)[.:\-\)]\s*(.+)/i);

        if (stepMatch) {
            steps.push({
                step: parseInt(stepMatch[1]),
                content: stepMatch[2].trim(),
                fullText: line.trim(),
            });
        } else if (steps.length > 0) {
            // Continuation of previous step
            steps[steps.length - 1].content += " " + line.trim();
            steps[steps.length - 1].fullText += "\n" + line.trim();
        } else {
            // First line without step number
            steps.push({
                step: index + 1,
                content: line.trim(),
                fullText: line.trim(),
            });
        }
    });

    return steps;
}

/**
 * Test the Groq API connection
 * @returns {Promise<Object>} - Connection test result
 */
export async function testConnection() {
    if (!groq) {
        return {
            success: false,
            error: "Groq API client not initialized",
        };
    }

    try {
        const response = await groq.chat.completions.create({
            messages: [{ role: "user", content: 'Say "Hello from Groq!"' }],
            model: "llama-3.1-8b-instant",
            max_completion_tokens: 50,
        });

        return {
            success: true,
            message: response.choices[0].message.content,
            model: "llama-3.1-8b-instant",
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
        };
    }
}

export default {
    solveMathProblem,
    testConnection,
};
