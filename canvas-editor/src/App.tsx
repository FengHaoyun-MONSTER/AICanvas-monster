import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PortalLayout } from './components/layout/PortalLayout';
import { Home } from './pages/Home';
import { CanvasEditor } from './pages/CanvasEditor';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PortalLayout />}>
          <Route path="/" element={<Home />} />
        </Route>
        
        {/* Canvas is completely independent of the Portal Layout */}
        <Route path="/canvas" element={<CanvasEditor />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
