const express = require('express');
const app = express();

//aqui estan todas los accesos de rutas para la app

app.use(require('./usuario')); // se importa y se usa las rutas del usuario(usuario.js)
app.use(require('./login'));
app.use(require('./categoria'));
app.use(require('./producto'));


module.exports = app;