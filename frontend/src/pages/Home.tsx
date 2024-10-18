import React from 'react';

const Home: React.FC = () => {
  const noticias = [
    {
      id: 1,
      titulo: "Nuevo Laboratorio de Química Analítica",
      contenido: "La Facultad de Química y Farmacia inaugura un moderno laboratorio equipado con tecnología de última generación para análisis químicos avanzados.",
      fecha: "2024-03-15",
      imagen: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
      id: 2,
      titulo: "Conferencia Internacional de Farmacología",
      contenido: "Destacados investigadores de todo el mundo se reunirán en nuestra universidad para discutir los últimos avances en farmacología y desarrollo de medicamentos.",
      fecha: "2024-03-20",
      imagen: "https://images.unsplash.com/photo-1585435557343-3b092031a831?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
      id: 3,
      titulo: "Programa de Intercambio Estudiantil",
      contenido: "Se abre la convocatoria para el programa de intercambio estudiantil con universidades europeas. Una oportunidad única para ampliar horizontes académicos.",
      fecha: "2024-03-25",
      imagen: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    }
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-6">Últimas Noticias</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {noticias.map((noticia) => (
          <div key={noticia.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <img src={noticia.imagen} alt={noticia.titulo} className="w-full h-48 object-cover" />
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2 text-blue-600">{noticia.titulo}</h2>
              <p className="text-gray-600 mb-4">{noticia.contenido}</p>
              <p className="text-sm text-gray-500">{new Date(noticia.fecha).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;