import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Horario {
  id: number;
  asignatura: string;
  sala: string;
  dia_semana: string;
  modulo: number;
  profesor: string;
}

// Lista de módulos con sus horarios correspondientes
const modulosHorarios = [
  '1 (08:30 - 09:15)',
  '2 (09:25 - 10:10)',
  '3 (10:20 - 11:05)',
  '4 (11:15 - 12:00)',
  '5 (12:10 - 12:55)',
  'Colación (12:55 - 14:00)',  // Módulo de colación
  '6 (14:00 - 14:45)',
  '7 (14:55 - 15:40)',
  '8 (15:50 - 16:35)',
  '9 (16:45 - 17:30)',
  '10 (17:40 - 18:25)',
  '11 (18:35 - 19:20)'
];

const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

const Horarios: React.FC = () => {
  const [horarios, setHorarios] = useState<Horario[][][]>([]); // Matriz para almacenar arrays de horarios

  useEffect(() => {
    axios.get('http://localhost:3000/horarios')
      .then((response) => {
        const data = response.data;
        const horarioSemanal: Horario[][][] = Array.from({ length: 11 }, () => Array.from({ length: 5 }, () => [])); // Inicializar con arrays vacíos

        data.forEach((horario: Horario) => {
          const diaIndex = dias.indexOf(horario.dia_semana);
          if (diaIndex !== -1 && horario.modulo >= 1 && horario.modulo <= 11) {
            horarioSemanal[horario.modulo - 1][diaIndex].push(horario); // Agregar horario al array correspondiente
          }
        });

        setHorarios(horarioSemanal);
      })
      .catch((error) => {
        console.error('Error fetching the horarios:', error);
      });
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center mb-4">Horario Semanal</h2>
      <table className="min-w-full table-auto border-collapse border border-gray-400">
        <thead>
          <tr className="bg-blue-600 text-white"> {/* Color del encabezado igual al de la barra de navegación */}
            <th className="border border-gray-300 px-4 py-2">Módulo</th>
            {dias.map((dia) => (
              <th key={dia} className="border border-gray-300 px-4 py-2">{dia}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {horarios.map((moduloHorarios, moduloIndex) => (
            <tr
              key={moduloIndex}
              className={`border border-gray-300 px-4 py-2 text-center odd:bg-gray-100 even:bg-gray-200`} // Alterna tonos de gris
            >
              {/* Mostrar el módulo con el horario asignado */}
              <td className="border border-gray-300 px-4 py-2 text-center">
                {modulosHorarios[moduloIndex]}
              </td>
              {/* Si es el módulo de colación (index 5), poner "Colación" para todos los días */}
              {moduloIndex === 5 ? (
                dias.map((dia, diaIndex) => (
                  <td key={diaIndex} className="border border-gray-300 px-4 py-2 text-center">
                    Colación
                  </td>
                ))
              ) : (
                moduloHorarios.map((diaHorarios, diaIndex) => (
                  <td key={diaIndex} className="border border-gray-300 px-4 py-2 text-center">
                    {diaHorarios.length > 0 ? (
                      <>
                        {/* Mostrar la asignatura una sola vez */}
                        <div className="font-bold">{diaHorarios[0].asignatura}</div>
                        {diaHorarios.map((horario, i) => (
                          <div key={i} className="mb-2">
                            {/* Mostrar Sección y Sala en la misma línea */}
                            <div>{`Sección ${i + 1} - ${horario.sala}`}</div>
                            <div>{horario.profesor}</div>
                          </div>
                        ))}
                      </>
                    ) : (
                      <div>-</div>
                    )}
                  </td>
                ))
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Horarios;
