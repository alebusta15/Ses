import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface DatabaseStatusProps {
  onClose: () => void;
}

const DatabaseStatus: React.FC<DatabaseStatusProps> = ({ onClose }) => {
  const [status, setStatus] = useState<'checking' | 'success' | 'error'>('checking');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await axios.get('http://localhost:3000/test-db-connection');
        setStatus('success');
        setMessage(response.data.message);
      } catch (error) {
        setStatus('error');
        setMessage('Error al conectar con la base de datos');
      }
    };

    checkConnection();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Estado de la Conexión a la Base de Datos</h2>
        {status === 'checking' && <p>Verificando conexión...</p>}
        {status === 'success' && (
          <p className="text-green-600">
            <span className="mr-2">✅</span>
            {message}
          </p>
        )}
        {status === 'error' && (
          <p className="text-red-600">
            <span className="mr-2">❌</span>
            {message}
          </p>
        )}
        <button
          onClick={onClose}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default DatabaseStatus;