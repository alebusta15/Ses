import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Horario {
  CURS_CODIGO: number;
  CURS_C_SEM: number;
  CURS_SECCION: number;
  RAMO_NOMBRE: string;
  PLA_NOMBRE: string;
  HOR_DIA: string;
  HOR_H_INI: string;
  HOR_H_FIN: string;
  SAL_NOMBRE: string;
  SEMESTRE: number;
}

// Mapeo de los bloques horarios
const modulosHorarios = [
  { modulo: '1', rango: '08:30 - 09:15', inicio: '08:30' },
  { modulo: '2', rango: '09:25 - 10:10', inicio: '09:25' },
  { modulo: '3', rango: '10:20 - 11:05', inicio: '10:20' },
  { modulo: '4', rango: '11:15 - 12:00', inicio: '11:15' },
  { modulo: '5', rango: '12:10 - 12:55', inicio: '12:10' },
  { modulo: 'Colación', rango: '12:55 - 14:00', inicio: '12:55' },
  { modulo: '6', rango: '14:00 - 14:45', inicio: '14:00' },
  { modulo: '7', rango: '14:55 - 15:40', inicio: '14:55' },
  { modulo: '8', rango: '15:50 - 16:35', inicio: '15:50' },
  { modulo: '9', rango: '16:45 - 17:30', inicio: '16:45' },
  { modulo: '10', rango: '17:40 - 18:25', inicio: '17:40' },
  { modulo: '11', rango: '18:35 - 19:20', inicio: '18:35' }
];

// Días de la semana
const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

const Horarios: React.FC = () => {
  const [horarios, setHorarios] = useState<Horario[][][]>([]);
  const [carrera, setCarrera] = useState<string>('');  // Carrera seleccionada
  const [semestre, setSemestre] = useState<number | string>(1);  // Semestre seleccionado

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
    const value = e.target.value === "EFE" ? 21 : e.target.value === "CFG" ? 22 : Number(e.target.value);
    setSemestre(value);
  };

  useEffect(() => {
    let ruta = '';
  
    // Determinar la ruta del backend según la carrera seleccionada
    if (carrera === 'Química') {
      ruta = 'http://localhost:3000/horarios-quimica';
    } else if (carrera === 'Ingeniería en Alimentos') {
      ruta = 'http://localhost:3000/horarios-ingenieria-alimentos';
    } else if (carrera === 'Bioquímica') {
      ruta = 'http://localhost:3000/horarios-bioquimica';
    } else if (carrera === 'Química y Farmacia') {
      ruta = 'http://localhost:3000/horarios-quimica-farmacia';
    }
  
    if (ruta) {  
      axios.get(ruta)
        .then((response) => {
          const data = response.data;
          console.log('Datos recibidos del backend:', data);  // Verificar los datos recibidos
  
          // Filtrar los datos por semestre seleccionado
          const filteredData = data.filter((horario: Horario) => horario.SEMESTRE === semestre);
          console.log('Datos filtrados por semestre:', filteredData);  // Verificar cuántos datos coinciden con el semestre
  
          const horarioSemanal: Horario[][][] = Array.from({ length: 12 }, () => Array.from({ length: 5 }, () => []));
  
          filteredData.forEach((horario: Horario) => {
            const diaIndex = dias.indexOf(horario.HOR_DIA);
            if (diaIndex !== -1) {
              const moduloIndex = modulosHorarios.findIndex(modulo => modulo.inicio === horario.HOR_H_INI);
              if (moduloIndex !== -1) {
                horarioSemanal[moduloIndex][diaIndex].push(horario);
              }
            }
          });
  
          setHorarios(horarioSemanal);
        })
        .catch((error) => {
          console.error('Error al obtener los horarios:', error);
        });
    }
  }, [carrera, semestre]);
    
  const agruparSecciones = (horarios: Horario[]) => {
    const asignaturas: { [key: string]: { [key: number]: string[] } } = {}; // {RAMO_NOMBRE: {SECCION: [SALAS]}}
  
    horarios.forEach((horario) => {
      if (!asignaturas[horario.RAMO_NOMBRE]) {
        asignaturas[horario.RAMO_NOMBRE] = {};
      }
  
      if (!asignaturas[horario.RAMO_NOMBRE][horario.CURS_SECCION]) {
        asignaturas[horario.RAMO_NOMBRE][horario.CURS_SECCION] = [];
      }
  
      // Agregar la sala a la sección si aún no está en la lista
      if (!asignaturas[horario.RAMO_NOMBRE][horario.CURS_SECCION].includes(horario.SAL_NOMBRE)) {
        asignaturas[horario.RAMO_NOMBRE][horario.CURS_SECCION].push(horario.SAL_NOMBRE);
      }
    });
  
    return asignaturas;
  };
  
  // Función para renderizar las asignaturas, secciones y salas
  const renderizarHorario = (diaHorarios: Horario[]) => {
    const asignaturasAgrupadas = agruparSecciones(diaHorarios);
  
    return Object.entries(asignaturasAgrupadas).map(([ramo, secciones], index) => (
      <div key={index}>
        {/* Mostrar el nombre de la asignatura solo una vez */}
        <div className="font-bold">{ramo}</div>
        {Object.entries(secciones).map(([seccion, salas], idx) => (
          <div key={idx}>
            {/* Mostrar la sección solo una vez, con todas sus salas correspondientes */}
            {`Sección ${seccion} - Salas: ${salas.join(', ')}`}
          </div>
        ))}
      </div>
    ));
  };
  
  return (
    <div className="p-6">
      {/* Título con Carrera y Semestre */}
      <h2 className="text-2xl font-bold text-center mb-4">
        Horario Semanal
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

      {/* Tabla de horarios */}
      <table className="min-w-full table-auto border-collapse border border-gray-400">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="border border-gray-300 px-4 py-2">Módulo</th>
            {dias.map((dia) => (
              <th key={dia} className="border border-gray-300 px-4 py-2">{dia}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {horarios.map((moduloHorarios, moduloIndex) => (
            <tr key={moduloIndex} className={`border border-gray-300 px-4 py-2 text-center odd:bg-gray-100 even:bg-gray-200`}>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {modulosHorarios[moduloIndex]?.rango}
              </td>
              {moduloIndex === 5 ? (
                Array.from({ length: dias.length }).map((_, diaIndex) => (
                  <td key={diaIndex} className="border border-gray-300 px-4 py-2 text-center">
                    Colación
                  </td>
                ))
              ) : (
                moduloHorarios.map((diaHorarios, diaIndex) => (
                  <td key={diaIndex} className="border border-gray-300 px-4 py-2 text-center">
                    {diaHorarios.length > 0 ? (
                      <>
                        {renderizarHorario(diaHorarios)}
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
