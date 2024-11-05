import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';  // Importa el Footer
import NoticiasCrud from './components/NoticiasCrud';  // Asegúrate de que esta ruta sea correcta
import Home from './pages/Home';
import Horarios from './pages/Horarios';
import Pruebas from './pages/Pruebas';
import Examenes from './pages/Examenes';
import Contacto from './pages/Contacto';  // Importar la página de contacto
import Calendario from './pages/Calendario';  // Importamos el nuevo componente
import Solicitudes from './pages/Solicitudes';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/noticias" element={<NoticiasCrud />} />  {/* Ruta a la página del CRUD de noticias */}
            <Route path="/horarios" element={<Horarios />} />
            <Route path="/pruebas" element={<Pruebas />} />
            <Route path="/examenes" element={<Examenes />} />
            <Route path="/contacto" element={<Contacto />} />  {/* Ruta para la página de contacto */}
            <Route path="/calendario" element={<Calendario />} />  {/* Ruta para el calendario */}
            <Route path="/solicitudes" element={<Solicitudes />} />
            </Routes>
        </div>
        <Footer />  {/* Footer */}
      </div>
    </Router>
  );
}

export default App;