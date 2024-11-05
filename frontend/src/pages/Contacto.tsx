import React from 'react';

const Contacto: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Contacto</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold">Secretario de Estudios:</h3>
          <p>Alejandro Bustamante Martínez</p>
          <p>Teléfono: 229781611</p>
          <p>Email: <a href="mailto:alebusta@ciq.uchile.cl" className="text-blue-500 underline">alebusta@ciq.uchile.cl</a></p>
        </div>

        <div>
          <h3 className="text-xl font-semibold">Asistente:</h3>
          <p>Edith Fernandois Acuña</p>
          <p>Teléfono: 229181694</p>
          <p>Email: <a href="mailto:edith@ciq.uchile.cl" className="text-blue-500 underline">edith@ciq.uchile.cl</a></p>
          <p>Atención: Estudiantes de Postgrado, Certificados, Inscripciones</p>
        </div>

        <div>
          <h3 className="text-xl font-semibold">Asistente:</h3>
          <p>Claudia Martínez Oporto</p>
          <p>Teléfono: 229781621</p>
          <p>Email: <a href="mailto:claudia.martinez@ciq.uchile.cl" className="text-blue-500 underline">claudia.martinez@ciq.uchile.cl</a></p>
          <p>Atención: Estudiantes de Química y Farmacia e Ingeniería en Alimentos, Certificados, Expedientes</p>
        </div>

        <div>
          <h3 className="text-xl font-semibold">Asistente:</h3>
          <p>Scarlette Martínez</p>
          <p>Teléfono: 229781694</p>
          <p>Email: <a href="mailto:scarlette.martinez@ciq.uchile.cl" className="text-blue-500 underline">scarlette.martinez@ciq.uchile.cl</a></p>
          <p>Atención: Estudiantes de Bioquímica y Química, Certificados, Expedientes, Prestaciones de Servicio</p>
        </div>
      </div>
    </div>
  );
};

export default Contacto;
