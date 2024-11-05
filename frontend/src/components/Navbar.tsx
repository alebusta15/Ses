import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Clock, FileText, GraduationCap, User, Calendar, FileQuestion } from 'lucide-react';
import logo from '/src/assets/logo-quimica-2x.png';  // Importamos el logo

const Navbar: React.FC = () => {
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo más grande y título */}
        <div className="flex items-center">
          <Link to="/">
            <img src={logo} alt="Logo Química" className="h-16 w-auto mr-3" /> {/* Logo más grande, ajusta h-16 según sea necesario */}
          </Link>
          <Link to="/" className="text-3xl font-bold tracking-wide">Secretaría de Estudios</Link> {/* Nuevo título con tamaño y estilo ajustado */}
        </div>

        <ul className="flex space-x-6">
          <li>
            <Link to="/" className="flex items-center"><Home className="mr-1" size={18} /> Inicio</Link>
          </li>
          <li>
            <Link to="/horarios" className="flex items-center"><Clock className="mr-1" size={18} /> Horarios</Link>
          </li>
          <li>
            <Link to="/pruebas" className="flex items-center"><FileText className="mr-1" size={18} /> Pruebas</Link>
          </li>
          <li>
            <Link to="/examenes" className="flex items-center"><GraduationCap className="mr-1" size={18} /> Exámenes</Link>
          </li>
          <li>
            <Link to="/contacto" className="flex items-center"><User className="mr-1" size={18} /> Contacto</Link>
          </li>
          <li>
            <Link to="/noticias" className="flex items-center">Gestión de Noticias</Link>  {/* Nuevo enlace */}
          </li>
          <li>
            <Link to="/solicitudes" className="flex items-center"><FileQuestion className="mr-1" size={18} /> Solicitudes</Link>
          </li>
      </ul>
       <li>
            <Link to="/calendario" className="flex items-center"><Calendar className="mr-1" size={18} /> Calendario</Link> {/* Nuevo enlace */}
          </li>
      </div>
    </nav>
  );
};

export default Navbar;
