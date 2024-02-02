require("dotenv").config();
const express = require("express");

// conectar con la bbdd
const {connectDB} = require('./utils/db')
connectDB();
// const { connectDB } = require("./utils/db");
// connectDB();

const characterRoutes = require('./api/routes/character.routes');
const locationRoutes = require('./api/routes/location.routes');

const server = express(); // lo ejecutamos y guardamos en la variable app
const PORT = 3000;

// Estas son funciones propias de express que transforman la información enviada como JSON al servidor de forma que podremos obtenerla en req.body.
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

server.use('/characters', characterRoutes);
server.use('/locations', locationRoutes);
// server.use('/', router) // .use utiliza archivos o datos para rutas existentes o no ("*")

server.use("*", (req, res, next) => {
    // todas las rutas que *no* tengan respuesta entrarán por aquí
    const error = new Error('Route not found');
    error.status = 404;
    next(error) // Llamamos a la función next con un error
    // return res.status(404).json("Route not found") // Otra posibilidad
})

server.use((err, req, res, next) => { // Sé que es un controlador de errores porque tiene 4 argumentos
    return res.status(err.status || 500).json(err.message || 'Unexpected error');
}); // Lo ponemos al final del todo porque nuestro servidor irá rastreando cuál es la mejor opción de arriba a abajo


server.listen(PORT, () => {
    // Con el método .listen(puerto, callback), nuestro servidor express escuchará al puerto que le pasemos
  console.log(`Server running in http://localhost: ${PORT}`);
});