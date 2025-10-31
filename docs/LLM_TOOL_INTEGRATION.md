# LLM Tool Integration

## Overview

The Draw Agent canvas has been transformed into an interactive tool that allows LLMs to:

1. Analyze math problems drawn on the canvas
2. Solve problems step-by-step
3. Draw solutions/annotations back onto the canvas

## Architecture

### Backend (Hono + Socket.IO)

-   **Server**: `backend/src/server.js`

    -   WebSocket server for real-time communication
    -   REST API endpoints for LLM tool calls

-   **Canvas Routes**: `/api/canvas/*`

    -   `POST /api/canvas/draw` - LLM sends drawing commands
    -   `GET /api/canvas/state` - Get current canvas state
    -   `POST /api/canvas/image` - Store canvas image

-   **AI Routes**: `/api/ai/*`
    -   `POST /api/ai/solve` - Solve math problems with tool calling enabled
    -   `GET /api/ai/test` - Test Groq API connection

### Frontend (React + Socket.IO)

-   **Canvas Component**: Real-time drawing canvas
    -   User can draw math problems
    -   Receives and renders LLM drawing commands via WebSocket
    -   Displays solutions in overlay modal

## LLM Tool: draw_on_canvas

The LLM (Groq's Llama 4 Scout) has access to a tool function:

```javascript
{
  name: "draw_on_canvas",
  description: "Draw lines, shapes, or text on the canvas to visualize or annotate the solution",
  parameters: {
    action: "line" | "text" | "clear",
    data: {
      // For line action:
      from: { x: number, y: number },
      to: { x: number, y: number },
      color: string,
      width: number,

      // For text action:
      text: string,
      x: number,
      y: number,
      color: string,
      size: number
    }
  }
}
```

## Usage Flow

1. **User draws** a math problem on the canvas
2. **User clicks "Solve"** button
3. **Frontend sends** canvas image to `/api/ai/solve`
4. **Groq AI analyzes** the image with vision model
5. **AI can call** `draw_on_canvas` tool to annotate
6. **Backend broadcasts** drawing commands via WebSocket
7. **Frontend renders** AI annotations in real-time
8. **Solution displays** in modal overlay

## Example LLM Tool Calls

### Draw a line

```json
{
    "action": "line",
    "data": {
        "from": { "x": 100, "y": 200 },
        "to": { "x": 300, "y": 200 },
        "color": "#FF6B6B",
        "width": 3
    }
}
```

### Draw text

```json
{
    "action": "text",
    "data": {
        "text": "= 42",
        "x": 350,
        "y": 205,
        "color": "#4CAF50",
        "size": 24
    }
}
```

## API Endpoints for External LLMs

### Solve a Problem

```bash
POST http://localhost:3000/api/ai/solve
Content-Type: application/json

{
  "image": "data:image/png;base64,...",
  "options": {
    "stepByStep": true
  }
}
```

### Send Drawing Command

```bash
POST http://localhost:3000/api/canvas/draw
Content-Type: application/json

{
  "action": "line",
  "data": {
    "from": { "x": 100, "y": 100 },
    "to": { "x": 200, "y": 200 },
    "color": "#1E90FF",
    "width": 2
  }
}
```

### Get Canvas State

```bash
GET http://localhost:3000/api/canvas/state
```

## WebSocket Events

### Client  Server

-   `draw` - User drawing data
-   `clear` - Clear canvas request

### Server  Client

-   `llm-draw` - LLM drawing commands
-   `clear` - Clear canvas broadcast

## Features

 Real-time LLM drawing on canvas
 Vision model (Llama 4 Scout) analyzes drawings
 Tool calling for annotations
 WebSocket for instant updates
 SVG icons (no emojis)
 Modal solution display
 Multi-user collaboration ready

## Testing

1. Open http://localhost:5173
2. Draw a math problem (e.g., "2 + 2 = ?")
3. Click "Solve"
4. Watch AI analyze and potentially annotate
5. See solution in modal

## Next Steps

-   Add more drawing tools (shapes, colors)
-   Implement undo/redo with LLM awareness
-   Add session management
-   Store canvas history
-   Support multiple canvases
-   Add voice input for problems
