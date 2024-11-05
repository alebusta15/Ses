import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Crear una aplicación de Express
const app = express();
const port = 3000;

// Asegurarse de que existe el directorio uploads
const uploadsDir = join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Habilitar CORS y JSON parsing
app.use(cors());
app.use(express.json());

// Configurar multer para el manejo de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + file.originalname.substring(file.originalname.lastIndexOf('.')));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB límite
  }
});



// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
  host: '200.89.65.140',
  user: 'alebusta',
  password: 'songokuh6775',
  database: 'ses',
});

// Conectar a la base de datos
db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});

// Ruta para obtener las asignaturas
app.get('/asignaturas', (req, res) => {
  const query = 'SELECT DISTINCT RAMO_NOMBRE FROM RAMOS_SEMESTRES ORDER BY RAMO_NOMBRE';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener las asignaturas:', err);
      res.status(500).json({ error: 'Error al obtener las asignaturas' });
      return;
    }
    res.json(results);
  });
});

// Ruta para guardar una nueva solicitud
app.post('/solicitudes', upload.single('archivo'), (req, res) => {
  try {
    const { rut, nombre, carrera, asignatura, motivo, tipo } = req.body;
    const archivoUrl = req.file ? `/uploads/${req.file.filename}` : null;

    // Validar datos requeridos
    if (!rut || !nombre || !carrera || !asignatura || !motivo || !tipo) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const query = `
      INSERT INTO solicitudes 
      (rut, nombre, carrera, asignatura, motivo, tipo_solicitud, archivo_url) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      query,
      [rut, nombre, carrera, asignatura, motivo, tipo, archivoUrl],
      (err, results) => {
        if (err) {
          console.error('Error al guardar la solicitud:', err);
          return res.status(500).json({ error: 'Error al guardar la solicitud' });
        }
        res.status(201).json({ 
          message: 'Solicitud guardada exitosamente',
          id: results.insertId 
        });
      }
    );
  } catch (error) {
    console.error('Error en el procesamiento de la solicitud:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para obtener los horarios de la carrera de Química (ya existente)
app.get('/horarios-quimica', (req, res) => {
  const query = `
    SELECT 
      cpi.CURS_CODIGO, 
      cpi.CURS_C_SEM, 
      cpi.CURS_SECCION, 
      cpi.RAMO_NOMBRE, 
      cpi.PLA_NOMBRE, 
      cpi.HOR_DIA, 
      cpi.HOR_H_INI, 
      cpi.HOR_H_FIN, 
      cpi.SAL_NOMBRE, 
      rs.SEMESTRE
    FROM 
      CURSOS_PLANES_INFO cpi
    JOIN 
      RAMOS_SEMESTRES rs
    ON 
      cpi.\`RAMOS.RAMO_C_RAMO_ESCUELA\` = rs.RAMO_C_RAMO_ESCUELA
    WHERE 
      cpi.PLA_NOMBRE IN ('Plan de Formación Intermedia', 'Licenciatura en Quimica v3', 'Licenciatura en Quimica v4')
  `;  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      res.status(500).send('Error al obtener los horarios de Química');
      return;
    }
    res.json(results);
  });
});

// Nueva ruta para obtener los horarios de la carrera de Ingeniería en Alimentos
app.get('/horarios-ingenieria-alimentos', (req, res) => {
  const query = `
    SELECT 
      cpi.CURS_CODIGO, 
      cpi.CURS_C_SEM, 
      cpi.CURS_SECCION, 
      cpi.RAMO_NOMBRE, 
      cpi.PLA_NOMBRE, 
      cpi.HOR_DIA, 
      cpi.HOR_H_INI, 
      cpi.HOR_H_FIN, 
      cpi.SAL_NOMBRE, 
      rs.SEMESTRE
    FROM 
      CURSOS_PLANES_INFO cpi
    JOIN 
      RAMOS_SEMESTRES rs
    ON 
      cpi.\`RAMOS.RAMO_C_RAMO_ESCUELA\` = rs.RAMO_C_RAMO_ESCUELA
    WHERE 
      cpi.PLA_NOMBRE IN (
      'Plan de Formación Intermedia',
      'Licenciatura en Ciencias de los Alimentos v3',
      'Licenciatura en Ciencias de los Alimentos v4',
      'Ingenieria en Alimentos v3'
    )
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      res.status(500).send('Error al obtener los horarios de Ingeniería en Alimentos');
      return;
    }
    res.json(results);
  });
});

// Ruta para obtener horarios de la carrera de Bioquímica
app.get('/horarios-bioquimica', (req, res) => {
  const query = `
    SELECT 
      cpi.CURS_CODIGO, 
      cpi.CURS_C_SEM, 
      cpi.CURS_SECCION, 
      cpi.RAMO_NOMBRE, 
      cpi.PLA_NOMBRE, 
      cpi.HOR_DIA, 
      cpi.HOR_H_INI, 
      cpi.HOR_H_FIN, 
      cpi.SAL_NOMBRE, 
      rs.SEMESTRE
    FROM 
      CURSOS_PLANES_INFO cpi
    JOIN 
      RAMOS_SEMESTRES rs
    ON 
      cpi.\`RAMOS.RAMO_C_RAMO_ESCUELA\` = rs.RAMO_C_RAMO_ESCUELA
    WHERE 
      cpi.PLA_NOMBRE IN (
      'Plan de Formación Intermedia',
      'Licenciatura en Bioquímica v3',
      'Licenciatura en Bioquímica v4'
      'Bioquímica v3'
    )
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      res.status(500).send('Error al obtener los horarios de Bioquímica');
      return;
    }
    res.json(results);
  });
});

// Ruta para obtener horarios de la carrera de Química y Farmacia
app.get('/horarios-quimica-farmacia', (req, res) => {
  const query = `
    SELECT 
      cpi.CURS_CODIGO, 
      cpi.CURS_C_SEM, 
      cpi.CURS_SECCION, 
      cpi.RAMO_NOMBRE, 
      cpi.PLA_NOMBRE, 
      cpi.HOR_DIA, 
      cpi.HOR_H_INI, 
      cpi.HOR_H_FIN, 
      cpi.SAL_NOMBRE, 
      rs.SEMESTRE
    FROM 
      CURSOS_PLANES_INFO cpi
    JOIN 
      RAMOS_SEMESTRES rs
    ON 
      cpi.\`RAMOS.RAMO_C_RAMO_ESCUELA\` = rs.RAMO_C_RAMO_ESCUELA
    WHERE 
      cpi.PLA_NOMBRE IN (
      'Plan de Formación Intermedia',
      'Licenciatura en Farmacia v3',
      'Licenciatura en Farmacia v4'
      'Quimica y Farmacia v3'
    )
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      res.status(500).send('Error al obtener los horarios de Química y Farmacia');
      return;
    }
    res.json(results);
  });
});

// Ruta para obtener todas las pruebas
app.get('/pruebas', (req, res) => {
  const query = `
    SELECT *
    FROM pruebas
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      res.status(500).send('Error al obtener las pruebas');
      return;
    }
    res.json(results);
  });
});

app.get('/examenes', (req, res) => {
  const query = `
    SELECT semana, asignatura, nivel, f, b, q, i, dia, inicio, termino, sala
    FROM examenes
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      res.status(500).send('Error al obtener los exámenes');
      return;
    }
    res.json(results);
  });
});

// Crear noticia (Create)
app.post('/noticias', (req, res) => {
  const { titulo, contenido, fecha, imagen_url } = req.body;
  const query = 'INSERT INTO noticias (titulo, contenido, fecha, imagen_url) VALUES (?, ?, ?, ?)';
  
  db.query(query, [titulo, contenido, fecha, imagen_url], (err, result) => {
    if (err) {
      console.error('Error al crear la noticia:', err);
      res.status(500).send('Error al crear la noticia');
      return;
    }
    res.status(201).send('Noticia creada exitosamente');
  });
});

// Leer todas las noticias (Read)
app.get('/noticias', (req, res) => {
  const query = 'SELECT * FROM noticias ORDER BY fecha DESC';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener las noticias:', err);
      res.status(500).send('Error al obtener las noticias');
      return;
    }
    res.json(results);
  });
});

// Actualizar noticia (Update)
app.put('/noticias/:id', (req, res) => {
  const { id } = req.params;
  const { titulo, contenido, fecha, imagen_url } = req.body;
  const query = 'UPDATE noticias SET titulo = ?, contenido = ?, fecha = ?, imagen_url = ? WHERE id = ?';
  
  db.query(query, [titulo, contenido, fecha, imagen_url, id], (err, result) => {
    if (err) {
      console.error('Error al actualizar la noticia:', err);
      res.status(500).send('Error al actualizar la noticia');
      return;
    }
    res.send('Noticia actualizada exitosamente');
  });
});

// Eliminar noticia (Delete)
app.delete('/noticias/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM noticias WHERE id = ?';
  
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar la noticia:', err);
      res.status(500).send('Error al eliminar la noticia');
      return;
    }
    res.send('Noticia eliminada exitosamente');
  });
});

// Ruta para obtener eventos
app.get('/eventos', (req, res) => {
  const query = 'SELECT * FROM eventos ORDER BY fecha, hora_inicio';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener los eventos:', err);
      res.status(500).send('Error al obtener los eventos');
      return;
    }
    res.json(results);
  });
});

// Crear un evento
app.post('/eventos', (req, res) => {
  const { titulo, descripcion, fecha, hora_inicio, hora_fin } = req.body;

  const query = 'INSERT INTO eventos (titulo, descripcion, fecha, hora_inicio, hora_fin) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [titulo, descripcion, fecha, hora_inicio, hora_fin], (err, result) => {
    if (err) {
      console.error('Error al insertar evento:', err);
      return res.status(500).json({ error: 'Error al crear el evento' });
    }
    res.status(201).json({ id: result.insertId });
  });
});

// Modificar un evento
app.put('/eventos/:id', (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, fecha, hora_inicio, hora_fin } = req.body;

  const query = 'UPDATE eventos SET titulo = ?, descripcion = ?, fecha = ?, hora_inicio = ?, hora_fin = ? WHERE id = ?';
  db.query(query, [titulo, descripcion, fecha, hora_inicio, hora_fin, id], (err) => {
    if (err) {
      console.error('Error al actualizar evento:', err);
      return res.status(500).json({ error: 'Error al actualizar el evento' });
    }
    res.status(200).json({ message: 'Evento actualizado correctamente' });
  });
});

// Eliminar un evento
app.delete('/eventos/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM eventos WHERE id = ?';
  db.query(query, [id], (err) => {
    if (err) {
      console.error('Error al eliminar evento:', err);
      return res.status(500).json({ error: 'Error al eliminar el evento' });
    }
    res.status(200).json({ message: 'Evento eliminado correctamente' });
  });
});

// Nueva ruta para obtener los próximos 10 eventos a partir de la fecha actual
app.get('/eventos/proximos', (req, res) => {
  const query = `
    SELECT id, titulo, descripcion, fecha, hora_inicio, hora_fin
    FROM eventos
    WHERE fecha >= CURDATE()
    ORDER BY fecha, hora_inicio
    LIMIT 10
  `;

  db.query(query, (error, results) => {
    if (error) {
      console.error('Error al obtener los próximos eventos:', error);
      return res.status(500).json({ error: 'Error al obtener los eventos' });
    }
    res.status(200).json(results);
  });
});

// Nueva ruta para obtener eventos combinados de ambas tablas
app.get('/eventos/combinados', (req, res) => {
  const queryEventos = `
    SELECT id, titulo, descripcion, fecha, hora_inicio, hora_fin
    FROM eventos
    WHERE fecha >= CURDATE()
  `;

  const queryExamenes = `
    SELECT Semana AS id, Asignatura AS titulo, Dia AS fecha, Inicio AS hora_inicio, Termino AS termino, Sala AS descripcion
    FROM examenes
    WHERE Dia >= CURDATE()
  `;

  db.query(queryEventos, (error1, resultsEventos) => {
    if (error1) {
      console.error('Error al obtener los eventos:', error1);
      return res.status(500).json({ error: 'Error al obtener eventos' });
    }

    db.query(queryExamenes, (error2, resultsExamenes) => {
      if (error2) {
        console.error('Error al obtener los exámenes:', error2);
        return res.status(500).json({ error: 'Error al obtener exámenes' });
      }

      // Transformar los datos de examenes para que coincidan con el formato de eventos
      const eventosExamenes = resultsExamenes.map((examen) => {
        if (!examen.fecha || !examen.hora_inicio) {
          console.error(`Fecha o hora inválida para el examen: ${JSON.stringify(examen)}`);
          return null;
        }

        return {
          id: examen.id.toString(), // Semana como ID
          titulo: `${examen.titulo} - ${examen.termino}`, // Asignatura + Termino como título
          fecha: examen.fecha, // Día como fecha
          hora_inicio: examen.hora_inicio, // Texto de inicio directamente
          descripcion: `Sala: ${examen.descripcion}`, // Sala en descripción
        };
      }).filter(Boolean); // Filtrar valores nulos

      // Combina eventos de ambas fuentes
      const eventosCombinados = [...resultsEventos, ...eventosExamenes];

      // Ordena cronológicamente
      eventosCombinados.sort((a, b) => new Date(`${a.fecha}T${a.hora_inicio}`) - new Date(`${b.fecha}T${b.hora_inicio}`));

      res.status(200).json(eventosCombinados);
    });
  });
});

// Nueva ruta para obtener los exámenes en formato de eventos
app.get('/examenes-eventos', (req, res) => {
  const query = 'SELECT semana AS id, asignatura, dia, inicio, termino, sala FROM examenes';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener los exámenes:', err);
      res.status(500).send('Error al obtener los exámenes');
      return;
    }

    // Transformar los resultados para que coincidan con la estructura de los eventos
    const examenesData = results.map((examen) => {
      // Ajustar el formato de la hora de inicio y fin
      let [horaInicio, horaFin] = examen.inicio.includes('-') 
          ? examen.inicio.split('-') 
          : [examen.inicio, null];

      // Formatear la hora para asegurarse de que esté en HH:MM
      const formatearHora = (hora) => {
        let [hours, minutes] = hora.includes('.') ? hora.replace('.', ':').split(':') : hora.split(':');
        hours = hours.padStart(2, '0');
        minutes = minutes ? minutes.padEnd(2, '0') : '00';
        return `${hours}:${minutes}`;
      };

      horaInicio = formatearHora(horaInicio);
      if (horaFin) horaFin = formatearHora(horaFin);

      return {
        id: `Semana-${examen.id}`,  // Prefijo para diferenciar exámenes de eventos normales
        titulo: `${examen.asignatura} - ${examen.termino}`, // Título del evento
        descripcion: `Sala: ${examen.sala}`, // Descripción
        fecha: examen.dia, // Fecha del examen
        hora_inicio: horaInicio, // Hora de inicio formateada
        hora_fin: horaFin || null, // Hora de fin, si existe
      };
    });

    res.json(examenesData);
  });
});




// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
