import React from 'react';

const newsData = [
  {
    title: "Nuevo Laboratorio de Química Analítica",
    date: "14/3/2024",
    description:
      "La Facultad de Química y Farmacia inaugura un moderno laboratorio equipado con tecnología de última generación para análisis químicos avanzados.",
    image: "/lab.jpg",
  },
  {
    title: "Conferencia Internacional de Farmacología",
    date: "19/3/2024",
    description:
      "Destacados investigadores de todo el mundo se reunirán en nuestra universidad para discutir los últimos avances en farmacología y desarrollo de medicamentos.",
    image: "/conference.jpg",
  },
  {
    title: "Programa de Intercambio Estudiantil",
    date: "24/3/2024",
    description:
      "Se abre la convocatoria para el programa de intercambio estudiantil con universidades europeas. Una oportunidad única para ampliar horizontes académicos.",
    image: "/exchange.jpg",
  },
];

const App: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <header className="bg-blue-600 text-white p-4 text-center">
        <h1 className="text-2xl font-bold">QuimiFarma</h1>
      </header>

      <main className="mt-6">
        <h2 className="text-3xl font-bold text-center mb-6">Últimas Noticias</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {newsData.map((news, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img src={news.image} alt={news.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{news.title}</h3>
                <p className="text-sm text-gray-500">{news.date}</p>
                <p className="mt-2 text-gray-700">{news.description}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default App;

