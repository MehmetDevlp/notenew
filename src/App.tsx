import React from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { PageView } from './pages/PageView'
import { Home } from './pages/Home'
import { PropertyCellTest } from './components/database/PropertyCellTest'
import { DatabasePage } from './pages/DatabasePage'

function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Test route - Layout DIŞINDA */}
        <Route path="/test-cells" element={<PropertyCellTest />} />

        {/* Diğer route'lar - Layout içinde */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/page/:id" element={<PageView />} />
          <Route path="/database/:id" element={<DatabasePage />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App