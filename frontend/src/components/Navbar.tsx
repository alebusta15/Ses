import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Clock, FileText, GraduationCap, Database } from 'lucide-react';
import DatabaseStatus from './DatabaseStatus';

const Navbar: React.FC = () => {
  const [showDbStatus, setShowDbStatus] = useState(false);

  const checkDatabaseConnection = async () => {
    setShowDbStatus(true);
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">QuimiFarma</Link>
        <ul className="flex space-x-4">
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
            <button onClick={checkDatabaseConnection} className="flex items-center">
              <Database className="mr-1" size={18} /> Verificar BD
            </button>
          </li>
        </ul>
      </div>
      {showDbStatus && <DatabaseStatus onClose={() => setShowDbStatus(false)} />}
    </nav>
  );
};

export default Navbar;