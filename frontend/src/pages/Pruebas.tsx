import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Prueba {
  semana: number;
  asignatura: string;
  caracter: string;
  nivel: number;
  f: string;
  b: string;
  q: string;
  i: string;
  dia: number;
  inicio: string;
  termino: string;
  sala: string;
}

const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const Pruebas: React.FC = () => {
  const [pruebas, setPruebas] = useState<Prueba[]>([]);
  const [pruebasFiltradas, setPruebasFiltradas] = useState<Prueba[]>([]);
  const [carrera, setCarrera] = useState<string>('');  // Carrera seleccionada
  const [semestre, setSemestre] = useState<number | string>(1);  // Semestre seleccionado
  const [orden, setOrden] = useState<string>('semana');  // Estado para manejar la columna de ordenación
  const [ascendente, setAscendente] = useState<boolean>(true);  // Estado para manejar la dirección de la ordenación

  // Opciones de carreras
  const opcionesCarreras = [
    'Química',
    'Ingeniería en Alimentos',
    'Bioquímica',
    'Química y Farmacia'
  ];

  // Manejar el cambio de carrera
  const handleCarreraChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCarrera(e.target.value);
  };

  // Manejar el cambio de semestre
  const handleSemestreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSemestre(Number(e.target.value));
  };

  // Cambiar la ordenación
  const handleOrdenChange = (columna: string) => {
    if (orden === columna) {
      // Si ya está ordenado por la misma columna, cambiamos la dirección
      setAscendente(!ascendente);
    } else {
      // Cambiar la columna de ordenación y establecer como ascendente
      setOrden(columna);
      setAscendente(true);
    }
  };

  useEffect(() => {
    // Obtener todas las pruebas del backend
    axios.get('http://localhost:3000/pruebas')
      .then((response) => {
        setPruebas(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener las pruebas:', error);
      });
  }, []);

  // Filtrar y ordenar las pruebas según la carrera, semestre y orden seleccionados
  useEffect(() => {
    if (carrera && semestre) {
      const filtroCarrera = (prueba: Prueba) => {
        if (carrera === 'Química') return prueba.q === 'Q';
        if (carrera === 'Bioquímica') return prueba.b === 'B';
        if (carrera === 'Ingeniería en Alimentos') return prueba.i === 'I';
        if (carrera === 'Química y Farmacia') return prueba.f === 'F';
        return false;
      };

      const pruebasFiltradas = pruebas
        .filter(prueba => filtroCarrera(prueba) && prueba.nivel === semestre)
        .sort((a, b) => {
          let comparacion = 0;
          if (orden === 'semana') {
            comparacion = a.semana - b.semana;  // Ordenar por semana
            if (comparacion === 0) {
              comparacion = a.dia - b.dia;  // Ordenar por día si las semanas son iguales
            }
          } else if (orden === 'asignatura') {
            comparacion = a.asignatura.localeCompare(b.asignatura);  // Ordenar por asignatura
          }

          return ascendente ? comparacion : -comparacion;  // Si es descendente, invertir la comparación
        });

      setPruebasFiltradas(pruebasFiltradas);
    }
  }, [carrera, semestre, pruebas, orden, ascendente]);

  return (
    <div className="p-6">
      {/* Título que incluye la carrera y semestre */}
      <h2 className="text-2xl font-bold text-center mb-4">
        Pruebas Semestrales
        {carrera && (
          <>
            {' - '}
            <span>{carrera}</span>
          </>
        )}
        {semestre && (
          <>
            {' - Semestre '}
            <span>{semestre === 21 ? 'EFE' : semestre === 22 ? 'CFG' : semestre}</span>
          </>
        )}
      </h2>

      {/* Contenedor con flexbox para alinear en una línea */}
      <div className="flex space-x-4 mb-4">
        {/* Selector de carrera */}
        <div>
          <label htmlFor="carrera" className="block mb-2">Seleccionar Carrera:</label>
          <select id="carrera" value={carrera} onChange={handleCarreraChange} className="p-2 border border-gray-400 rounded">
            <option value="">-- Seleccionar Carrera --</option>
            {opcionesCarreras.map((opcion) => (
              <option key={opcion} value={opcion}>{opcion}</option>
            ))}
          </select>
        </div>

        {/* Selector de semestre */}
        <div>
          <label htmlFor="semestre" className="block mb-2">Seleccionar Semestre:</label>
          <select id="semestre" value={semestre} onChange={handleSemestreChange} className="p-2 border border-gray-400 rounded">
            {[...Array(10).keys()].map(i => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
            <option value="EFE">EFE</option>
            <option value="CFG">CFG</option>
          </select>
        </div>
      </div>

      {/* Tabla de pruebas */}
      <table className="min-w-full table-auto border-collapse border border-gray-400">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="border border-gray-300 px-4 py-2 cursor-pointer" onClick={() => handleOrdenChange('semana')}>
              Semana {orden === 'semana' ? (ascendente ? '⬆' : '⬇') : ''}
            </th>
            <th className="border border-gray-300 px-4 py-2 cursor-pointer" onClick={() => handleOrdenChange('asignatura')}>
              Asignatura {orden === 'asignatura' ? (ascendente ? '⬆' : '⬇') : ''}
            </th>
            <th className="border border-gray-300 px-4 py-2">Día</th>
            <th className="border border-gray-300 px-4 py-2">Hora Inicio</th>
            <th className="border border-gray-300 px-4 py-2">Hora Termino</th>
            <th className="border border-gray-300 px-4 py-2">Sala</th>
          </tr>
        </thead>
        <tbody>
          {pruebasFiltradas.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-4">No hay pruebas disponibles</td>
            </tr>
          ) : (
            pruebasFiltradas.map((prueba, index) => (
              <tr key={index} className={`border border-gray-300 px-4 py-2 text-center odd:bg-gray-100 even:bg-gray-200`}>
                <td className="border border-gray-300 px-4 py-2 text-center">{prueba.semana}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{prueba.asignatura}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{diasSemana[prueba.dia - 1]}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{prueba.inicio}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{prueba.termino}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{prueba.sala}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Pruebas;
