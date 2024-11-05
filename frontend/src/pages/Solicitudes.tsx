import React, { useState } from 'react';
import axios from 'axios';
import SolicitudForm from '../components/forms/SolicitudForm';

interface FormData {
  rut: string;
  nombre: string;
  carrera: string;
  asignatura: string;
  motivo: string;
  archivo?: File;
  tipo: string;
}

const Solicitudes: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<'sin-requisito' | 'tope-horario' | 'permanencia' | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    try {
      setLoading(true);
      
      // Crear FormData para enviar el archivo
      const data = new FormData();
      data.append('rut', formData.rut);
      data.append('nombre', formData.nombre);
      data.append('carrera', formData.carrera);
      data.append('asignatura', formData.asignatura);
      data.append('motivo', formData.motivo);
      data.append('tipo', formData.tipo);
      if (formData.archivo) {
        data.append('archivo', formData.archivo);
      }

      // Enviar la solicitud al servidor
      await axios.post('http://localhost:3000/solicitudes', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setShowForm(false);
      alert('Solicitud enviada correctamente');
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      alert('Error al enviar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const openForm = (type: 'sin-requisito' | 'tope-horario' | 'permanencia') => {
    setFormType(type);
    setShowForm(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Solicitudes Académicas</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Asignaturas sin requisito */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="h-48 bg-blue-100 flex items-center justify-center">
            <svg className="w-24 h-24 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-3">Asignaturas sin requisito</h3>
            <p className="text-gray-600">Formulario de solicitud para inscribir asignaturas sin requisito</p>
            <button 
              onClick={() => openForm('sin-requisito')}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              disabled={loading}
            >
              Completar solicitud
            </button>
          </div>
        </div>

        {/* Card 2: Asignaturas con tope de horario */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="h-48 bg-green-100 flex items-center justify-center">
            <svg className="w-24 h-24 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-3">Asignaturas con tope de horario</h3>
            <p className="text-gray-600">Formulario para solicitud de inscripción de asignaturas con tope de horario</p>
            <button 
              onClick={() => openForm('tope-horario')}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
              disabled={loading}
            >
              Completar solicitud
            </button>
          </div>
        </div>

        {/* Card 3: Solicitud de permanencia */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="h-48 bg-purple-100 flex items-center justify-center">
            <svg className="w-24 h-24 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-3">Solicitud de permanencia</h3>
            <p className="text-gray-600">Formulario de solicitud de permanencia, debe ser completado por estudiantes que entraran en causal de eliminación</p>
            <button 
              onClick={() => openForm('permanencia')}
              className="mt-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors"
              disabled={loading}
            >
              Completar solicitud
            </button>
          </div>
        </div>
      </div>

      {showForm && formType && (
        <SolicitudForm
          tipo={formType}
          onClose={() => setShowForm(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default Solicitudes;