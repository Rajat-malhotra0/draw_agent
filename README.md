#  Interactive AI Drawing Canvas

An intelligent drawing canvas where you can draw mathematical problems and have an AI agent (powered by Groq's **Llama 4 Scout**) solve them and draw solutions in real-time.

##  Features

-    **Interactive Drawing Canvas** - Draw freely with adjustable brush sizes and colors
-    **AI Agent Integration** - Powered by Groq's Llama 4 Scout (17B vision model)
-    **Math Problem Solving** - Draw equations and get step-by-step solutions
-    **AI Drawing** - Watch the AI draw solutions and explanations on canvas
-    **Real-time Chat** - Interact with the AI agent via text
-    **Undo/Redo** - Full history management
-    **Save/Export** - Save your work and export as images

##  Complete Documentation

All documentation is organized in the [`docs/`](docs/) folder:

| Document                                                     | Description                                       |
| ------------------------------------------------------------ | ------------------------------------------------- |
| **[docs/PROJECT_SUMMARY.md](docs/PROJECT_SUMMARY.md)**       |  Executive summary with architecture & diagrams |
| **[docs/PROJECT_PLAN.md](docs/PROJECT_PLAN.md)**             |  Detailed project specification & features      |
| **[docs/QUICKSTART.md](docs/QUICKSTART.md)**                 |  Get running in 10 minutes                      |
| **[docs/NEXT_STEPS.md](docs/NEXT_STEPS.md)**                 |  Immediate action items & weekly plan           |
| **[docs/TECH_DECISIONS.md](docs/TECH_DECISIONS.md)**         |  Technology stack explained                     |
| **[docs/DOCUMENTATION_INDEX.md](docs/DOCUMENTATION_INDEX.md)** |  Complete guide to all docs                   |
| **[docs/API.md](docs/API.md)**                               |  Complete API specification                     |
| **[docs/CODE_EXAMPLES.md](docs/CODE_EXAMPLES.md)**           |  Ready-to-use code snippets                     |

##  Quick Start

### Prerequisites

-   Node.js (v18 or higher)
-   npm or yarn
-   Groq API key ([Get one here](https://console.groq.com/))

### Installation

1. **Clone the repository**

    ```bash
    git clone <your-repo-url>
    cd draw_agent
    ```

2. **Set up the backend**

    ```bash
    cd backend
    npm install
    cp .env.example .env
    # Edit .env and add your GROQ_API_KEY
    npm run dev
    ```

3. **Set up the frontend**

    ```bash
    cd frontend
    npm install
    npm run dev
    ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

##  Documentation

-   [docs/PROJECT_PLAN.md](docs/PROJECT_PLAN.md) - Detailed project planning and architecture
-   [docs/NEXT_STEPS.md](docs/NEXT_STEPS.md) - Your immediate action plan
-   [docs/API.md](docs/API.md) - API endpoints and usage
-   [docs/CODE_EXAMPLES.md](docs/CODE_EXAMPLES.md) - Working code examples

##  Tech Stack

**Frontend:**

-   React.js + Vite
-   HTML5 Canvas API
-   Fabric.js (canvas manipulation)
-   TailwindCSS
-   Socket.io-client

**Backend:**

-   Node.js + Express.js
-   Socket.io (WebSocket)
-   Groq API
-   Sharp (image processing)

##  Usage

1. **Draw** - Use your mouse/stylus to draw a math problem on the canvas
2. **Solve** - Click the "Solve" button or type `/solve` in chat
3. **Watch** - The AI analyzes your drawing and draws the solution
4. **Interact** - Ask follow-up questions or request explanations

##  Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

##  License

MIT License - feel free to use this project for learning or commercial purposes.

##  Acknowledgments

-   Groq for providing fast AI inference
-   The open-source community for amazing libraries

##  Contact

For questions or feedback, please open an issue on GitHub.

---

**Status:**  In Development
**Version:** 0.1.0
