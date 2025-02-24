import React from 'react'
import ReactDOM from 'react-dom/client'
import Map from './routes/Map.tsx'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'

const router = createBrowserRouter([
  {
    path:"/",
    element: <App/>
  },
  {
    path: "map",
    element: <Map/>
  }

])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
