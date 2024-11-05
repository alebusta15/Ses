import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RutInput from './RutInput';
import NameInput from './NameInput';

interface SolicitudFormProps {
  tipo: 'sin-requisito' | 'tope-horario' | 'permanencia';
  onClose: () => void;
  onSubmit: (formData: any) => void;
}

interface FormData {
  rut: string;
  nombre: string;
  carrera: string;
  asignatura: string;
  motivo: string;
  archivo?: File;
  tipo: string;
}

interface Asignatura {
  RAMO_NOMBRE: string;
}

const carreras = [
  'Bioquímica',
  'Ingeniería en Alimentos',
  'Química',
  'Química y Farmacia'
];

const SolicitudForm: React.FC<SolicitudFormProps> = ({ tipo, onClose }) => {
  const [formData, setFormData] = useState<FormData>({
    rut: '',
    nombre: '',
    carrera: '',
    asignatura: '',
    motivo: '',
    tipo: tipo
  });
  const [isRutValid, setIsRutValid] = useState(false);
  const [archivo, setArchivo] = useState<File | null>(null);
  const [asignaturas, setAsignaturas] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    const fetchAsignaturas = async () => {
      try {
        const response = await axios.get<Asignatura[]>('http://localhost:3000/asignaturas');
        const nombresAsignaturas = response.data.map(asig => asig.RAMO_NOMBRE);
        setAsignaturas(nombresAsignaturas);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar las asignaturas:', err);
        setError('Error al cargar las asignaturas');
        setLoading(false);
      }
    };

    fetchAsignaturas();
  }, []);

  const getTitulo = () => {
    switch (tipo) {
      case 'sin-requisito':
        return 'Solicitud de Asignatura sin Requisito';
      case 'tope-horario':
        return 'Solicitud de Asignatura con Tope de Horario';
      case 'permanencia':
        return 'Solicitud de Permanencia';
    }
  };

  const validateForm = () => {
    if (!isRutValid) {
      alert('Por favor, ingrese un RUT válido');
      return false;
    }
    if (!formData.nombre.trim()) {
      alert('Por favor, ingrese su nombre completo');
      return false;
    }
    if (!formData.carrera) {
      alert('Por favor, seleccione una carrera');
      return false;
    }
    if (!formData.asignatura) {
      alert('Por favor, seleccione una asignatura');
      return false;
    }
    if (!formData.motivo.trim()) {
      alert('Por favor, ingrese el motivo de la solicitud');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setSubmitLoading(true);
      const data = new FormData();
      data.append('rut', formData.rut);
      data.append('nombre', formData.nombre);
      data.append('carrera', formData.carrera);
      data.append('asignatura', formData.asignatura);
      data.append('motivo', formData.motivo);
      data.append('tipo', formData.tipo);
      
      if (archivo) {
        data.append('archivo', archivo);
      }

      await axios.post('http://localhost:3000/solicitudes', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Solicitud enviada correctamente');
      onClose();
    } catch (error: any) {
      console.error('Error al enviar la solicitud:', error);
      alert(error.response?.data?.error || 'Error al enviar la solicitud');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('El archivo es demasiado grande. Máximo 5MB.');
        e.target.value = '';
        return;
      }
      if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
        setArchivo(file);
      } else {
        alert('Por favor, seleccione un archivo PDF o imagen');
        e.target.value = '';
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">{getTitulo()}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <RutInput
            value={formData.rut}
            onChange={(value, isValid) => {
              setFormData({ ...formData, rut: value });
              setIsRutValid(isValid);
            }}
          />

          <NameInput
            value={formData.nombre}
            onChange={(value) => setFormData({ ...formData, nombre: value })}
          />

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Carrera
            </label>
            <select
              value={formData.carrera}
              onChange={(e) => setFormData({ ...formData, carrera: e.target.value })}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Seleccione una carrera</option>
              {carreras.map((carrera) => (
                <option key={carrera} value={carrera}>
                  {carrera}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Asignatura
            </label>
            <select
              value={formData.asignatura}
              onChange={(e) => setFormData({ ...formData, asignatura: e.target.value })}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              disabled={loading}
              required
            >
              <option value="">Seleccione una asignatura</option>
              {asignaturas.map((asignatura) => (
                <option key={asignatura} value={asignatura}>
                  {asignatura}
                </option>
              ))}
            </select>
            {loading && <p className="text-sm text-gray-500 mt-1">Cargando asignaturas...</p>}
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Motivo de la solicitud
            </label>
            <textarea
              value={formData.motivo}
              onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows={4}
              placeholder="Explique los motivos de su solicitud"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Documentación de respaldo
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,image/*"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <p className="text-xs text-gray-500 mt-1">
              Formatos permitidos: PDF e imágenes (máx. 5MB)
            </p>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
              disabled={submitLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              disabled={!isRutValid || submitLoading}
            >
              {submitLoading ? 'Enviando...' : 'Enviar solicitud'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SolicitudForm;