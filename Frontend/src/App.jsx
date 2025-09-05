import React from 'react'
import SquidGames from './components/Pages.jsx'
import {BrowserRouter as Router, Routes, Route} from 'react-router'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<SquidGames />} />
      </Routes>
    </Router>
  )
}

export default App