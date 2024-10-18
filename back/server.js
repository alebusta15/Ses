const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

// Crear una aplicación de Express
const app = express();
const port = 3000;

// Habilitar CORS para permitir solicitudes desde el frontend
app.use(cors());

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

// Ruta para obtener los horarios
app.get('/horarios', (req, res) => {
  const query = `
    SELECT h.id, a.nombre AS asignatura, s.nombre AS sala, h.dia_semana, h.modulo, h.profesor
    FROM horarios h
    JOIN asignaturas a ON h.asignatura_id = a.id
    JOIN salas s ON h.sala_id = s.id
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      res.status(500).send('Error al obtener los horarios');
      return;
    }
    res.json(results);
  });
});

// Ruta para obtener las asignaturas
app.get('/asignaturas', (req, res) => {
  const query = 'SELECT * FROM asignaturas';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      res.status(500).send('Error al obtener las asignaturas');
      return;
    }
    res.json(results);
  });
});

// Ruta para obtener las carreras
app.get('/carreras', (req, res) => {
  const query = 'SELECT * FROM carreras';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      res.status(500).send('Error al obtener las carreras');
      return;
    }
    res.json(results);
  });
});

// Ruta para obtener las salas
app.get('/salas', (req, res) => {
  const query = 'SELECT * FROM salas';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      res.status(500).send('Error al obtener las salas');
      return;
    }
    res.json(results);
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
