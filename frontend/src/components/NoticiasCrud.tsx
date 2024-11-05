import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit, Trash2, PlusCircle } from 'lucide-react';  // Importamos iconos para edición, eliminación y agregar

interface Noticia {
  id?: number;
  titulo: string;
  contenido: string;
  fecha: string;
  imagen_url: string;
}

const NoticiasCrud: React.FC = () => {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [formData, setFormData] = useState<Noticia>({
    titulo: '',
    contenido: '',
    fecha: '',
    imagen_url: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false); // Controlar la visibilidad del formulario

  // Obtener noticias al cargar el componente
  useEffect(() => {
    fetchNoticias();
  }, []);

  const fetchNoticias = async () => {
    try {
      const response = await axios.get('http://localhost:3000/noticias');
      setNoticias(response.data);
    } catch (error) {
      console.error('Error al obtener las noticias:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();  // Evita que el formulario haga un refresh de la página
  
    try {
      if (isEditing && editId !== null) {
        await axios.put(`http://localhost:3000/noticias/${editId}`, formData);
        console.log('Noticia actualizada:', formData);  // Debug para actualización
      } else {
        await axios.post('http://localhost:3000/noticias', formData);
        console.log('Noticia creada:', formData);  // Debug para creación
      }
  
      fetchNoticias();  // Refresca la lista de noticias
      setFormData({ titulo: '', contenido: '', fecha: '', imagen_url: '' });  // Limpia el formulario
      setIsEditing(false);
      setEditId(null);
      setShowForm(false);  // Oculta el formulario
    } catch (error) {
      console.error('Error al guardar la noticia:', error);
    }
  };
  
  const handleEdit = (noticia: Noticia) => {
    setIsEditing(true);
    setEditId(noticia.id || null);
    setFormData({ ...noticia });
    setShowForm(true); // Mostrar el formulario cuando se edita una noticia
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/noticias/${id}`);
      fetchNoticias();
    } catch (error) {
      console.error('Error al eliminar la noticia:', error);
    }
  };

  const handleAddNew = () => {
    setIsEditing(false);
    setFormData({ titulo: '', contenido: '', fecha: '', imagen_url: '' });
    setShowForm(true);  // Mostrar el formulario para crear una nueva noticia
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Gestión de Noticias</h1>

      {/* Botón para agregar una nueva noticia */}
      <button
        className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md mb-4"
        onClick={handleAddNew}
      >
        <PlusCircle className="mr-2" size={20} /> Nueva Noticia
      </button>

      {/* Mostrar el formulario para crear o editar una noticia */}
      {showForm && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{isEditing ? 'Editar Noticia' : 'Crear Noticia'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleInputChange}
              placeholder="Título"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <textarea
              name="contenido"
              value={formData.contenido}
              onChange={handleInputChange}
              placeholder="Contenido"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <input
              type="text"
              name="imagen_url"
              value={formData.imagen_url}
              onChange={handleInputChange}
              placeholder="URL de la imagen"
              className="w-full p-2 border border-gray-300 rounded"
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
              {isEditing ? 'Actualizar Noticia' : 'Crear Noticia'}
            </button>
          </form>
        </div>
      )}

      {/* Lista de noticias en formato de tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {noticias.map((noticia) => (
          <div key={noticia.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <img src={noticia.imagen_url} alt={noticia.titulo} className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-blue-600">{noticia.titulo}</h3>
              <p className="text-gray-600 mb-4">{noticia.contenido}</p>
              <p className="text-sm text-gray-500 mb-2">{new Date(noticia.fecha).toLocaleDateString()}</p>

              {/* Iconos de edición y eliminación */}
              <div className="flex space-x-2">
                <button onClick={() => handleEdit(noticia)} className="text-blue-600 hover:text-blue-800">
                  <Edit size={20} />
                </button>
                <button onClick={() => handleDelete(noticia.id!)} className="text-red-600 hover:text-red-800">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoticiasCrud;
