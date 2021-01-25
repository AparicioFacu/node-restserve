const express = require('express');
const mongoose = require('mongoose'); // require necesario para conectar la base de dato
const path = require("path"); // se utiliza el path para vincular la carpeta public con el server.js

require("./config/config");

const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded procesa peticiones (middleware)
app.use(bodyParser.urlencoded({ extended: false })); // cada peticion que se haga en este acplicacion siempre van a pasar pore estas 2 lineas

// parse application/json // lo pasa a json(middleware)
app.use(bodyParser.json());

//Habilitar la carpeta Public
const direccion = path.resolve(__dirname, "../public"); //es la direccion de la carpeta public(para eso se usa el path)
app.use(express.static(direccion));


//Configuracion global de ruas(acceso a las rutas)
app.use(require("./routes/index"));

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