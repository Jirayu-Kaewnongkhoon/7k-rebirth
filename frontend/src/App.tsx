import './App.css'

import { RouterProvider } from 'react-router'
import { HelmetProvider } from 'react-helmet-async'

import { router } from './routes/appRoute'

function App() {
  return (
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  )
}

export default App
