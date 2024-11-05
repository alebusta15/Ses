import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Examen {
  semana: number;
  asignatura: string;
  nivel: number;
  f: string;
  b: string;
  q: string;
  i: string;
  dia: string;
  inicio: string;
  termino: string;
  sala: string;
}

const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const Examenes: React.FC = () => {
  const [examenes, setExamenes] = useState<Examen[]>([]);
  const [examenesFiltrados, setExamenesFiltrados] = useState<Examen[]>([]);
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
    // Obtener todos los exámenes del backend
    axios.get('http://localhost:3000/examenes')
      .then((response) => {
        setExamenes(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener los exámenes:', error);
      });
  }, []);

  // Filtrar y ordenar los exámenes según la carrera, semestre y orden seleccionados
  useEffect(() => {
    if (carrera && semestre) {
      const filtroCarrera = (examen: Examen) => {
        if (carrera === 'Química') return examen.q === 'Q';
        if (carrera === 'Bioquímica') return examen.b === 'B';
        if (carrera === 'Ingeniería en Alimentos') return examen.i === 'I';
        if (carrera === 'Química y Farmacia') return examen.f === 'F';
        return false;
      };

      const examenesFiltrados = examenes
        .filter(examen => filtroCarrera(examen) && examen.nivel === semestre)
        .sort((a, b) => {
          let comparacion = 0;
          if (orden === 'semana') {
            comparacion = a.semana - b.semana;  // Ordenar por semana
            if (comparacion === 0) {
              comparacion = new Date(a.dia).getTime() - new Date(b.dia).getTime();  // Ordenar por día si las semanas son iguales
            }
          } else if (orden === 'asignatura') {
            comparacion = a.asignatura.localeCompare(b.asignatura);  // Ordenar por asignatura
          }

          return ascendente ? comparacion : -comparacion;  // Si es descendente, invertir la comparación
        });

      setExamenesFiltrados(examenesFiltrados);
    }
  }, [carrera, semestre, examenes, orden, ascendente]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center mb-4">
        Exámenes Semestrales
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

      {/* Tabla de exámenes */}
      <table className="min-w-full table-auto border-collapse border border-gray-400">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="border border-gray-300 px-4 py-2 cursor-pointer" onClick={() => handleOrdenChange('semana')}>
              Semana {orden === 'semana' ? (ascendente ? '⬆' : '⬇') : ''}
            </th>
            <th className="border border-gray-300 px-4 py-2 cursor-pointer" onClick={() => handleOrdenChange('asignatura')}>
              Asignatura {orden === 'asignatura' ? (ascendente ? '⬆' : '⬇') : ''}
            </th>
            <th className="border border-gray-300 px-4 py-2">Fecha</th>
            <th className="border border-gray-300 px-4 py-2">Hora Inicio</th>
            <th className="border border-gray-300 px-4 py-2">Tipo de Examen</th>
            <th className="border border-gray-300 px-4 py-2">Sala</th>
          </tr>
        </thead>
        <tbody>
          {examenesFiltrados.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-4">No hay exámenes disponibles</td>
            </tr>
          ) : (
            examenesFiltrados.map((examen, index) => (
              <tr key={index} className={`border border-gray-300 px-4 py-2 text-center odd:bg-gray-100 even:bg-gray-200`}>
                <td className="border border-gray-300 px-4 py-2 text-center">{examen.semana}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{examen.asignatura}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{examen.dia}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{examen.inicio}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{examen.termino}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{examen.sala}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Examenes;
