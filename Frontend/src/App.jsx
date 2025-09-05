import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import ProductsPage from './pages/ProductsPage'
import SucursalesPage from './pages/SucursalesPage'
import CategoriasPage from './pages/CategoriesPage'
import Nav from './components/Nav'
import {BrowserRouter as Router, Routes, Route} from 'react-router'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Router>
|    <Nav />
      <Routes>
        <Route path="/" element={<ProductsPage />} />
       <Route path='/Categorias' element={<CategoriasPage />} />
        <Route path='/Sucursales' element={<SucursalesPage />} />
      </Routes>
    </Router>
    
    </>
  )
}

export default App
