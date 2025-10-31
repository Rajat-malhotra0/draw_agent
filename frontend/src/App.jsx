import { useState } from 'react'
import { RouterProvider, createRouter, createRootRoute, createRoute } from '@tanstack/react-router'
import Canvas from './components/Canvas'
import Toolbar from './components/Toolbar'
import TopBar from './components/TopBar'
import ColorPicker from './components/ColorPicker'
import './App.css'

function DrawPage() {
  const [tool, setTool] = useState('pen')
  const [color, setColor] = useState('#1E90FF')
  const [strokeWidth, setStrokeWidth] = useState(3)
  const [isProcessing, setIsProcessing] = useState(false)

  return (
    <div className="app">
      <TopBar />
      <div className="canvas-container">
        <Canvas 
          tool={tool}
          color={color}
          strokeWidth={strokeWidth}
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
        />
        <ColorPicker 
          color={color}
          setColor={setColor}
          strokeWidth={strokeWidth}
          setStrokeWidth={setStrokeWidth}
        />
        <Toolbar 
          tool={tool}
          setTool={setTool}
        />
      </div>
    </div>
  )
}

// Create routes
const rootRoute = createRootRoute({
  component: DrawPage
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DrawPage
})

const routeTree = rootRoute.addChildren([indexRoute])

const router = createRouter({ routeTree })

function App() {
  return <RouterProvider router={router} />
}

export default App
