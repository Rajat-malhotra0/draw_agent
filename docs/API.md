# 📡 API Specification

Complete API documentation for the AI Drawing Canvas backend.

---

## 🌐 Base URL

**Development:** `http://localhost:3000/api`
**Production:** `https://your-domain.com/api`

---

## 🔐 Authentication

Currently no authentication required (to be added in Phase 4).

### Future Headers

```http
Authorization: Bearer <jwt_token>
```

---

## 📋 Endpoints

### Canvas Operations

#### 1. Save Canvas State

**Endpoint:** `POST /api/canvas/save`

**Description:** Save current canvas state to server

**Request Body:**

```json
{
  "canvasData": {
    "objects": [...],
    "background": "#ffffff",
    "width": 800,
    "height": 600
  },
  "sessionId": "optional_session_id",
  "metadata": {
    "title": "My Math Problem",
    "description": "Solving quadratic equation"
  }
}
```

**Response:**

```json
{
    "success": true,
    "canvasId": "canvas_abc123",
    "savedAt": "2025-10-31T10:30:00Z"
}
```

**Status Codes:**

-   `201` - Canvas saved successfully
-   `400` - Invalid canvas data
-   `500` - Server error

---

#### 2. Load Canvas State

**Endpoint:** `GET /api/canvas/:canvasId`

**Description:** Retrieve saved canvas state

**Response:**

```json
{
  "success": true,
  "canvas": {
    "canvasId": "canvas_abc123",
    "canvasData": { ... },
    "metadata": { ... },
    "createdAt": "2025-10-31T10:30:00Z"
  }
}
```

**Status Codes:**

-   `200` - Canvas retrieved successfully
-   `404` - Canvas not found
-   `500` - Server error

---

#### 3. Export Canvas

**Endpoint:** `POST /api/canvas/export`

**Description:** Export canvas as image or PDF

**Request Body:**

```json
{
  "canvasData": { ... },
  "format": "png",
  "quality": 0.9
}
```

**Response:**

```json
{
    "success": true,
    "imageUrl": "https://storage.../canvas_abc123.png",
    "downloadUrl": "https://api.../download/canvas_abc123"
}
```

**Supported Formats:** `png`, `jpeg`, `pdf`

---

### AI Operations

#### 4. Analyze Drawing

**Endpoint:** `POST /api/ai/analyze`

**Description:** Analyze drawing and extract mathematical content

**Request Body:**

```json
{
    "image": "data:image/png;base64,iVBORw0KG...",
    "options": {
        "includeOCR": true,
        "detectShapes": false
    }
}
```

**Response:**

```json
{
    "success": true,
    "analysis": {
        "text": "2x + 5 = 15",
        "confidence": 0.95,
        "detectedElements": [
            {
                "type": "equation",
                "content": "2x + 5 = 15",
                "bbox": [10, 20, 200, 50]
            }
        ]
    },
    "processingTime": 1.2
}
```

---

#### 5. Solve Math Problem

**Endpoint:** `POST /api/ai/solve`

**Description:** Solve mathematical problem from drawing or text

**Request Body:**

```json
{
    "image": "data:image/png;base64,iVBORw0KG...",
    "text": "2x + 5 = 15",
    "options": {
        "stepByStep": true,
        "includeDiagram": true,
        "explanationLevel": "detailed"
    }
}
```

**Response:**

```json
{
  "success": true,
  "solution": {
    "problem": "2x + 5 = 15",
    "answer": "x = 5",
    "steps": [
      {
        "step": 1,
        "action": "Subtract 5 from both sides",
        "equation": "2x = 10",
        "explanation": "To isolate the term with x..."
      },
      {
        "step": 2,
        "action": "Divide both sides by 2",
        "equation": "x = 5",
        "explanation": "Final answer"
      }
    ],
    "visualization": {
      "type": "number_line",
      "data": {...}
    }
  },
  "drawingInstructions": [
    {
      "type": "text",
      "content": "Step 1: 2x + 5 = 15",
      "position": { "x": 50, "y": 100 },
      "style": { "fontSize": 18, "color": "#000" }
    },
    {
      "type": "arrow",
      "from": { "x": 50, "y": 120 },
      "to": { "x": 50, "y": 150 },
      "style": { "color": "#0066cc", "width": 2 }
    }
  ],
  "processingTime": 2.5
}
```

**Status Codes:**

-   `200` - Problem solved successfully
-   `400` - Invalid input (no math detected)
-   `422` - Unsupported problem type
-   `500` - Server error

---

#### 6. Explain Solution

**Endpoint:** `POST /api/ai/explain`

**Description:** Get detailed explanation of a solution

**Request Body:**

```json
{
    "problem": "2x + 5 = 15",
    "solution": "x = 5",
    "explanationStyle": "eli5"
}
```

**Response:**

```json
{
  "success": true,
  "explanation": {
    "summary": "We need to find what number x equals...",
    "detailed": "Step-by-step breakdown...",
    "concepts": ["linear equations", "inverse operations"],
    "relatedProblems": [...]
  }
}
```

---

#### 7. Get Solution History

**Endpoint:** `GET /api/ai/history?limit=10&offset=0`

**Description:** Retrieve user's solution history

**Query Parameters:**

-   `limit`: Number of results (default: 10)
-   `offset`: Pagination offset (default: 0)
-   `filter`: Filter by problem type

**Response:**

```json
{
    "success": true,
    "history": [
        {
            "id": "solution_123",
            "problem": "2x + 5 = 15",
            "answer": "x = 5",
            "timestamp": "2025-10-31T10:30:00Z"
        }
    ],
    "total": 25,
    "hasMore": true
}
```

---

### Health & Status

#### 8. Health Check

**Endpoint:** `GET /api/health`

**Description:** Check if API is running

**Response:**

```json
{
    "status": "healthy",
    "timestamp": "2025-10-31T10:30:00Z",
    "services": {
        "groq": "connected",
        "database": "connected",
        "redis": "connected"
    },
    "version": "1.0.0"
}
```

---

## 🔌 WebSocket Events

### Connection

```javascript
const socket = io("http://localhost:3000");

socket.on("connect", () => {
    console.log("Connected:", socket.id);
});
```

### Events Reference

#### Client → Server

##### 1. `drawing:start`

Emitted when user starts drawing

```javascript
socket.emit("drawing:start", {
    sessionId: "session_123",
    tool: "pen",
    color: "#000000",
});
```

##### 2. `drawing:stroke`

Emitted during drawing (throttled)

```javascript
socket.emit("drawing:stroke", {
    sessionId: "session_123",
    points: [
        { x: 10, y: 20, pressure: 0.5 },
        { x: 11, y: 21, pressure: 0.6 },
    ],
    tool: "pen",
    color: "#000000",
    width: 3,
});
```

##### 3. `drawing:end`

Emitted when drawing stroke ends

```javascript
socket.emit("drawing:end", {
    sessionId: "session_123",
});
```

##### 4. `ai:request`

Request AI to solve problem

```javascript
socket.emit('ai:request', {
  sessionId: 'session_123',
  action: 'solve',
  data: { ... }
});
```

##### 5. `chat:message`

Send chat message

```javascript
socket.emit('chat:message', {
  sessionId: 'session_123',
  message: 'Can you explain this step?',
  context: { ... }
});
```

#### Server → Client

##### 1. `drawing:update`

Broadcast drawing to other users

```javascript
socket.on("drawing:update", (data) => {
    // data: { userId, stroke, ... }
    renderStroke(data.stroke);
});
```

##### 2. `ai:thinking`

AI is processing

```javascript
socket.on("ai:thinking", (data) => {
    // data: { status: 'analyzing' | 'solving' | 'drawing' }
    showLoadingState(data.status);
});
```

##### 3. `ai:response`

AI response ready

```javascript
socket.on("ai:response", (data) => {
    // data: { solution, drawingInstructions, ... }
    displaySolution(data.solution);
});
```

##### 4. `ai:drawing:start`

AI starts drawing

```javascript
socket.on("ai:drawing:start", () => {
    console.log("AI is drawing...");
});
```

##### 5. `ai:drawing:stroke`

AI drawing stroke (animated)

```javascript
socket.on("ai:drawing:stroke", (data) => {
    // data: { type, content, position, style }
    animateAIDrawing(data);
});
```

##### 6. `ai:drawing:complete`

AI finished drawing

```javascript
socket.on("ai:drawing:complete", () => {
    console.log("AI drawing complete");
});
```

##### 7. `chat:message`

Chat message received

```javascript
socket.on("chat:message", (data) => {
    // data: { sender, message, timestamp }
    displayMessage(data);
});
```

##### 8. `user:joined` / `user:left`

User presence updates

```javascript
socket.on("user:joined", (data) => {
    // data: { userId, username }
    updateUserList(data);
});
```

---

## 🔒 Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": { ... }
  }
}
```

### Error Codes

| Code                  | Description              | HTTP Status |
| --------------------- | ------------------------ | ----------- |
| `INVALID_INPUT`       | Invalid request data     | 400         |
| `UNAUTHORIZED`        | Authentication required  | 401         |
| `FORBIDDEN`           | Insufficient permissions | 403         |
| `NOT_FOUND`           | Resource not found       | 404         |
| `RATE_LIMIT_EXCEEDED` | Too many requests        | 429         |
| `AI_ERROR`            | Groq API error           | 502         |
| `SERVER_ERROR`        | Internal server error    | 500         |

### Example Error

```json
{
    "success": false,
    "error": {
        "code": "RATE_LIMIT_EXCEEDED",
        "message": "You've exceeded the rate limit. Please try again in 60 seconds.",
        "details": {
            "retryAfter": 60,
            "limit": 10,
            "window": "1m"
        }
    }
}
```

---

## 📊 Rate Limiting

### Limits

-   **Anonymous users:** 10 requests/minute
-   **Authenticated users:** 60 requests/minute
-   **WebSocket connections:** 100 messages/minute

### Headers

```http
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 7
X-RateLimit-Reset: 1698753600
```

---

## 🧪 Example API Usage

### JavaScript (Fetch)

```javascript
const solveDrawing = async (imageData) => {
    try {
        const response = await fetch("http://localhost:3000/api/ai/solve", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                image: imageData,
                options: {
                    stepByStep: true,
                    includeDiagram: true,
                },
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.solution;
    } catch (error) {
        console.error("Error solving drawing:", error);
        throw error;
    }
};
```

### JavaScript (Axios)

```javascript
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api",
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Solve drawing
const solution = await api.post("/ai/solve", {
    image: imageData,
    options: { stepByStep: true },
});

console.log(solution.data.solution);
```

### cURL

```bash
curl -X POST http://localhost:3000/api/ai/solve \
  -H "Content-Type: application/json" \
  -d '{
    "text": "2x + 5 = 15",
    "options": {
      "stepByStep": true
    }
  }'
```

---

## 🔄 API Versioning

Currently using URL versioning:

-   `/api/v1/...` (current)
-   `/api/v2/...` (future)

---

## 📚 Additional Resources

-   [Groq API Docs](https://console.groq.com/docs)
-   [Socket.io Docs](https://socket.io/docs/v4/)
-   [Express.js Guide](https://expressjs.com/en/guide/routing.html)

---

**Last Updated:** October 31, 2025
