#  Quick Start Guide

Get your AI Drawing Canvas up and running in 10 minutes!

## Step 1: Get Your Groq API Key

1. Visit [Groq Console](https://console.groq.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy and save it securely

## Step 2: Project Structure Setup

We'll create two main parts: **frontend** and **backend**

### Option A: Minimal Setup (Fastest)

Start with a single HTML file for the frontend and a simple Node.js server.

### Option B: Full Setup (Recommended)

Follow the complete project structure from the PROJECT_PLAN.md

## Step 3: Backend Setup (15 minutes)

### Install Dependencies

```powershell
cd backend
npm init -y
npm install express cors dotenv groq-sdk multer sharp socket.io
npm install -D nodemon
```

### Create `.env` File

```env
GROQ_API_KEY=your_actual_groq_api_key_here
PORT=3000
NODE_ENV=development
```

### Basic Server Structure

Create these files:

-   `server.js` - Main server file
-   `routes/ai.routes.js` - AI endpoints
-   `services/groqService.js` - Groq API integration
-   `config/config.js` - Configuration

### Start the Backend

```powershell
npm run dev
```

## Step 4: Frontend Setup (15 minutes)

### Create React App with Vite

```powershell
cd frontend
npm create vite@latest . -- --template react
npm install
npm install fabric socket.io-client axios
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Key Files to Create

-   `src/components/Canvas/DrawingCanvas.jsx` - Main canvas component
-   `src/components/Canvas/CanvasToolbar.jsx` - Drawing tools
-   `src/components/AI/ChatPanel.jsx` - AI interaction
-   `src/hooks/useCanvas.js` - Canvas logic
-   `src/services/api.js` - API calls

### Start the Frontend

```powershell
npm run dev
```

## Step 5: First Test

1. Open `http://localhost:5173`
2. Draw a simple equation like "2 + 2"
3. Click "Solve" button
4. Watch the AI respond!

##  Minimal Working Example

If you want to test the concept quickly, here's a single-file approach:

### Create `test-canvas.html`

```html
<!DOCTYPE html>
<html>
    <head>
        <title>AI Canvas Test</title>
        <style>
            canvas {
                border: 2px solid #000;
                cursor: crosshair;
            }
            button {
                margin: 10px;
                padding: 10px;
            }
        </style>
    </head>
    <body>
        <div>
            <button onclick="clearCanvas()">Clear</button>
            <button onclick="solveWithAI()">Solve with AI</button>
        </div>
        <canvas id="canvas" width="800" height="600"></canvas>

        <script>
            const canvas = document.getElementById("canvas");
            const ctx = canvas.getContext("2d");
            let isDrawing = false;

            canvas.addEventListener("mousedown", () => (isDrawing = true));
            canvas.addEventListener("mouseup", () => (isDrawing = false));
            canvas.addEventListener("mousemove", draw);

            function draw(e) {
                if (!isDrawing) return;
                ctx.lineWidth = 3;
                ctx.lineCap = "round";
                ctx.lineTo(
                    e.clientX - canvas.offsetLeft,
                    e.clientY - canvas.offsetTop
                );
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(
                    e.clientX - canvas.offsetLeft,
                    e.clientY - canvas.offsetTop
                );
            }

            function clearCanvas() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.beginPath();
            }

            async function solveWithAI() {
                const imageData = canvas.toDataURL("image/png");
                // Send to backend API
                const response = await fetch(
                    "http://localhost:3000/api/ai/solve",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ image: imageData }),
                    }
                );
                const result = await response.json();
                alert("AI Solution: " + result.solution);
            }
        </script>
    </body>
</html>
```

### Create `test-server.js`

```javascript
const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");

const app = express();
const groq = new Groq({ apiKey: "your_groq_api_key" });

app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.post("/api/ai/solve", async (req, res) => {
    try {
        const { image } = req.body;

        const response = await groq.chat.completions.create({
            model: "llama-3.2-90b-vision-preview",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "Solve this math problem step by step.",
                        },
                        { type: "image_url", image_url: { url: image } },
                    ],
                },
            ],
            temperature: 0.3,
            max_tokens: 1000,
        });

        res.json({ solution: response.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));
```

Run the test:

```powershell
node test-server.js
# Open test-canvas.html in browser
```

##  Troubleshooting

### CORS Issues

Add to backend server.js:

```javascript
app.use(cors({ origin: "http://localhost:5173" }));
```

### Canvas Not Drawing

Check if mouse events are properly bound and `isDrawing` state is managed.

### Groq API Errors

-   Verify API key is correct
-   Check API rate limits
-   Ensure image is properly base64 encoded

### WebSocket Connection Failed

-   Ensure Socket.io versions match on client and server
-   Check if port 3000 is not blocked by firewall

##  Next Steps

1.  Get basic drawing working
2.  Test Groq API integration
3.  Read the full [PROJECT_PLAN.md](./PROJECT_PLAN.md)
4.  Build out the full architecture
5.  Add advanced drawing features
6.  Implement AI drawing capabilities
7.  Deploy your application

##  Tips

-   Start simple and iterate
-   Test each component independently
-   Use console.log liberally during development
-   Check browser console for frontend errors
-   Check terminal for backend errors
-   Use Postman to test API endpoints

##  Need Help?

-   Check the [PROJECT_PLAN.md](./PROJECT_PLAN.md) for detailed architecture
-   Review Groq API documentation
-   Open an issue on GitHub
-   Join our community (if applicable)

---

**Happy Coding!** 
