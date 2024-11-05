import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Noticia {
  id: number;
  titulo: string;
  contenido: string;
  fecha: string;
  imagen_url: string;
}

interface Evento {
  id: number;
  titulo: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
}

const Home: React.FC = () => {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);

  useEffect(() => {
    // Llamada al backend para obtener las noticias
    axios.get('http://localhost:3000/noticias')
      .then((response) => {
        setNoticias(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener las noticias:', error);
      });

    // Llamada al backend para obtener los próximos eventos
    axios.get('http://localhost:3000/eventos/proximos')
      .then((response) => {
        setEventos(response.data.slice(0, 10)); // Solo muestra los primeros 10 eventos
      })
      .catch((error) => {
        console.error('Error al obtener los eventos:', error);
      });
  }, []);

 
  return (
    <div className="space-y-8">
      {/* Nueva tarjeta con contenido estático */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <img src="/src/assets/IMG_6144.jpg" alt="Secretaría de Estudios" className="w-full h-48 object-cover" />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4 text-blue-600">Secretaría de Estudios</h1>
          <p className="mb-4">Las Secretarías de Estudios son organismos técnicos encargados de dar apoyo administrativo a las actividades docentes que realizan las Facultades y cumple, principalmente, funciones de registro y archivo de la documentación oficial informada por las Escuelas sobre las actividades curriculares de sus estudiantes.</p>
          <p className="mb-4">Realizan, además funciones de coordinación, de información y de certificación de acuerdo con las normas y reglamentos generales de la Universidad y específicos de las Facultades en lo que se refiere a situaciones curriculares, en los estudios de pregrado, de postgrado y de los cursos de especialización.</p>
          <p className="mb-4"><strong>Dependencia:</strong> La Secretaría de Estudios dependerá del Vicedecano de la Facultad, a través de la Dirección Académica y Estudiantil de ella, y le corresponderá colaborar directamente con la o las Escuelas de la Facultad.</p>
          <p className="mb-4"><strong>Secretario de Estudios:</strong> Alejandro Bustamante Martinez.</p>
          <p className="mb-4">E-mail: <a href="mailto:alebusta@ciq.uchile.cl" className="text-blue-600 underline">alebusta@ciq.uchile.cl</a></p>

          <h2 className="text-xl font-semibold mb-4">Funciones</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Centralizar el proceso de matrícula de los estudiantes y los registros correspondientes.</li>
            <li>Registrar oficialmente las nóminas de los estudiantes para todas las actividades curriculares que sean establecidas por la Dirección de las Escuelas.</li>
            <li>Mantener y actualizar los antecedentes curriculares de los estudiantes.</li>
            <li>Mantener la nómina oficial de las actividades curriculares que se realizan durante el año académico y de los académicos que participan en ellas.</li>
            <li>Recopilar y archivar, en forma oficial, los planes de estudios, programas de asignaturas y otras actividades curriculares.</li>
            <li>Recopilar, registrar, verificar y archivar las actas con las notas finales entregadas oficialmente por las Escuelas.</li>
            <li>Mantener actualizado el registro de titulados y graduados de carreras y programas de la Facultad.</li>
            <li>Mantener las estadísticas oficiales relacionadas con la función docente.</li>
            <li>Coordinar la elaboración del catálogo de cursos que ofrece la Facultad.</li>
            <li>Certificar la condición de alumno regular, las calificaciones obtenidas, los planes y programas de estudios realizados.</li>
            <li>Preparar el expediente de los candidatos a un título o grado con la documentación curricular establecida.</li>
            <li>Entregar oportunamente la información relacionada con las disposiciones de la Universidad y de la Facultad que afecten a la docencia.</li>
          </ul>
        </div>
      </div>

      {/* Contenedor de noticias y eventos */}
      <div className="flex">
        {/* Tarjeta de eventos próximos */}
        <div className="w-1/4 bg-white rounded-lg shadow-md p-4 mr-6">
          <h2 className="text-lg font-semibold mb-4 text-blue-600">Próximos Eventos</h2>
          {eventos.length > 0 ? (
            <ul>
              {eventos.map((evento, index) => (
                <li key={index} className="mb-2">
                  <p className="text-sm font-semibold text-gray-800">{new Date(evento.fecha).toLocaleDateString()} - {evento.titulo}</p>
                  <p className="text-sm text-gray-500">Hora: {evento.hora_inicio} - {evento.hora_fin}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-600">No hay eventos próximos.</p>
          )}
        </div>

        {/* Noticias principales */}
        <div className="w-3/4 grid grid-cols-1 md:grid-cols-3 gap-6">
          {noticias.map((noticia) => (
            <div key={noticia.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <img src={noticia.imagen_url} alt={noticia.titulo} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 text-blue-600">{noticia.titulo}</h2>
                <p className="text-gray-600 mb-4">{noticia.contenido}</p>
                <p className="text-sm text-gray-500">{new Date(noticia.fecha).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
