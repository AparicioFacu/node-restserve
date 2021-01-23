const express = require('express');
const mongoose = require('mongoose'); // require necesario para conectar la base de dato

require("./config/config");

const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded procesa peticiones
app.use(bodyParser.urlencoded({ extended: false })); // cada peticion que se haga en este acplicacion siempre van a pasar pore estas 2 lineas

// parse application/json // lo pasa a json
app.use(bodyParser.json());

app.use(require("./routes/usuario")); // se importa y se usa las rutas del usuario(usuario.js)

mongoose.connect(process.env.URLDB, { //conectadose a la base de datos mongodb "cafe"
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}, (err, res) => {
    if (err) throw err;
    console.log("Base de Datos online!")
});
app.listen(process.env.PORT, () => {
    console.log("escuchando el puerto", (process.env.PORT));
});