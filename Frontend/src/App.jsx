// App.jsx
import { useState } from 'react'
import SquidGames from './components/Pages' // Agregar esta línea
import Nav from './components/Nav'
import {BrowserRouter as Router, Routes, Route} from 'react-router'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Router>
      <Nav />
      <Routes>
        <Route path='/squid-games' element={<SquidGames />} /> {/* Agregar esta línea */}
      </Routes>
    </Router>
    </>
  )
}

export default App