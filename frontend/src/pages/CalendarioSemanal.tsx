import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Evento {
  id?: number;
  titulo: string;
  descripcion?: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
}

const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const CalendarioSemanal: React.FC = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [formData, setFormData] = useState<Evento>({ titulo: '', descripcion: '', fecha: '', hora_inicio: '', hora_fin: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // Cargar eventos al cargar el componente
  useEffect(() => {
    fetchEventos();
  }, []);

  const fetchEventos = async () => {
    try {
      const response = await axios.get('http://localhost:3000/eventos');
      if (Array.isArray(response.data)) {
        setEventos(response.data);
      } else {
        console.error('La respuesta no es un array');
      }
    } catch (error) {
      console.error('Error al cargar eventos:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && editId !== null) {
        await axios.put(`http://localhost:3000/eventos/${editId}`, formData);
      } else {
        await axios.post('http://localhost:3000/eventos', formData);
      }
      fetchEventos();
      setFormData({ titulo: '', descripcion: '', fecha: '', hora_inicio: '', hora_fin: '' });
      setIsEditing(false);
      setEditId(null);
    } catch (error) {
      console.error('Error al guardar el evento:', error);
    }
  };

  const handleEdit = (evento: Evento) => {
    setFormData(evento);
    setIsEditing(true);
    setEditId(evento.id || null);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/eventos/${id}`);
      fetchEventos();
    } catch (error) {
      console.error('Error al eliminar el evento:', error);
    }
  };

  const agruparEventosPorDia = (dia: string) => {
    return eventos.filter(evento => new Date(evento.fecha).toLocaleDateString('es-ES', { weekday: 'long' }) === dia.toLowerCase());
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4 text-center">Calendario de Eventos</h1>

      {/* Formulario para agregar y editar eventos */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4 bg-white shadow-md rounded-lg p-4">
        <h2 className="text-xl font-semibold">{isEditing ? 'Editar Evento' : 'Agregar Evento'}</h2>
        <input type="text" name="titulo" value={formData.titulo} onChange={handleInputChange} placeholder="Título" required className="w-full p-2 border border-gray-300 rounded" />
        <textarea name="descripcion" value={formData.descripcion} onChange={handleInputChange} placeholder="Descripción" className="w-full p-2 border border-gray-300 rounded" />
        <input type="date" name="fecha" value={formData.fecha} onChange={handleInputChange} required className="w-full p-2 border border-gray-300 rounded" />
        <input type="time" name="hora_inicio" value={formData.hora_inicio} onChange={handleInputChange} required className="w-full p-2 border border-gray-300 rounded" />
        <input type="time" name="hora_fin" value={formData.hora_fin} onChange={handleInputChange} required className="w-full p-2 border border-gray-300 rounded" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{isEditing ? 'Actualizar Evento' : 'Crear Evento'}</button>
      </form>

      {/* Visualización del calendario semanal */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {diasSemana.map((dia, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded-lg shadow">
            <h2 className="font-bold mb-2 text-center">{dia}</h2>
            {agruparEventosPorDia(dia).map(evento => (
              <div key={evento.id} className="bg-white p-3 rounded-lg shadow mb-3 hover:shadow-lg transition duration-300">
                <h3 className="font-semibold text-blue-600">{evento.titulo}</h3>
                <p className="text-gray-600">{evento.hora_inicio} - {evento.hora_fin}</p>
                <p className="text-gray-500 text-sm">{evento.descripcion}</p>
                <div className="flex justify-end space-x-2 mt-2">
                  <button onClick={() => handleEdit(evento)} className="text-blue-500 hover:text-blue-700">Editar</button>
                  <button onClick={() => handleDelete(evento.id!)} className="text-red-500 hover:text-red-700">Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarioSemanal;
