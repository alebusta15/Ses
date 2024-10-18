import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Horarios from './pages/Horarios';
import Pruebas from './pages/Pruebas';
import Examenes from './pages/Examenes';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/horarios" element={<Horarios />} />
            <Route path="/pruebas" element={<Pruebas />} />
            <Route path="/examenes" element={<Examenes />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;