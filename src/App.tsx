import React from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { PageView } from './pages/PageView'
import { Home } from './pages/Home'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/page/:id" element={<PageView />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App
