//REQUIRES
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
mongoose.set('useCreateIndex', true);

//INICIALIZAR VARIABLES
var app = express();

//MIDDLEAWARES
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//CONEXION A LA BASE DE DATOS
mongoose.connect('mongodb://localhost:27017/hospitalDB', { useNewUrlParser: true });

//IMPORTAR RUTAS
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');

//RUTAS
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);

//ESCUCHAR PETICIONES
app.listen(3000, () => {
    console.log("servidor corriendo en la url localhost:3000");
});