import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';

interface Evento {
    id: string;
    titulo?: string;
    descripcion?: string;
    fecha?: string;
    hora_inicio?: string;
    hora_fin?: string;
    title?: string; // Para FullCalendar
    start?: string; // Para FullCalendar
    end?: string;   // Para FullCalendar
  }
  

const Calendario: React.FC = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);

  useEffect(() => {
    console.log('Ejecutando fetchEventosYExamenes');
    fetchEventosYExamenes();
  }, []);

  const fetchEventosYExamenes = async () => {
    try {
      // Obtener eventos normales
      const responseEventos = await axios.get('http://localhost:3000/eventos');
      const eventosData = responseEventos.data.map((evento: Evento) => {
        const fecha = evento.fecha?.split('T')[0];
        return {
          id: evento.id.toString(),
          title: evento.titulo || '',
          descripcion: evento.descripcion || '',
          start: `${fecha}T${evento.hora_inicio}`,
          end: `${fecha}T${evento.hora_fin}`, 
        };
      });
  
      // Obtener exámenes y procesar
      const responseExamenes = await axios.get('http://localhost:3000/examenes-eventos');
      const examenesData = responseExamenes.data.map((examen: any, index: number) => {
        const fecha = examen.fecha;
        const horaInicio = examen.hora_inicio.replace('.', ':');
        const horaFin = examen.hora_fin ? examen.hora_fin.replace('.', ':') : null;
  
        return {
          id: `examen-${index + 1}`,
          title: `${examen.titulo}`,
          descripcion: examen.descripcion || '',
          start: `${fecha}T${horaInicio}`,
          end: horaFin ? `${fecha}T${horaFin}` : null,
        };
      }).filter(Boolean);
  
      const todosLosEventos = [...eventosData, ...examenesData];
      console.log('Eventos totales para el calendario:', todosLosEventos); 
      setEventos(todosLosEventos);
    } catch (error) {
      console.error('Error al cargar eventos o exámenes:', error);
    }
  };
  
  
  

  const handleDateClick = (arg: any) => {
    console.log('Fecha seleccionada:', arg.dateStr);
  };

  const handleEventClick = (clickInfo: any) => {
    console.log('Evento seleccionado:', clickInfo.event);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">Calendario de Eventos y Exámenes</h1>
      <FullCalendar
  plugins={[dayGridPlugin, interactionPlugin]}
  initialView="dayGridMonth"
  events={eventos} // Mostrar todos los eventos
  locale="es"
  dateClick={handleDateClick}
  eventClick={handleEventClick}
  height="auto" // Ajustar la altura para que se expanda si hay muchos eventos
  expandRows={true} // Asegura que el calendario expanda el espacio si hay muchos eventos
  headerToolbar={{
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,dayGridWeek',
  }}
  dayMaxEvents={false} // Permitir que se muestren todos los eventos sin limitar
//  eventDisplay="block"  // Cambia la visualización del evento para evitar superposición
/>
    </div>
  );
};

export default Calendario;
