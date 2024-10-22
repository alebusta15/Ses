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

// Nueva ruta para obtener los registros de la carrera de Química
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
      res.status(500).send('Error al obtener los horarios de la carrera de Química');
      return;
    }
    res.json(results);
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
