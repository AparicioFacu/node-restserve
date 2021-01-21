const express = require('express');
require("./config/config")
const app = express();
const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded procesa peticiones
app.use(bodyParser.urlencoded({ extended: false })) // cada peticion que se haga en este acplicacion siempre van a pasar pore estas 2 lineas

// parse application/json // lo pasa a json
app.use(bodyParser.json())

app.get('/usuarios', (req, res) => {
    res.json('get Usuario');
})
app.post('/usuarios', (req, res) => {

    let body = req.body; // este body es el que va a aparecer cuando se procese el app.use(...)

    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: "El nombre es necesario"
        });
    } else {
        res.json({
            persona: body
        });
    }


})


app.put('/usuarios/:id', (req, res) => { // sirve para actualizar

    let id = req.params.id // este id seria el id del usuario(url) al usuario que yo quiero modificar    
    res.json({
        id
    });
})
app.delete('/usuarios', (req, res) => { // sirve para borrar pero en realidad es lo cambiar el estado xq el registro siempre queda
    res.json('delete Usuario');
})

app.listen(process.env.PORT, () => {
    console.log("escuchando el puerto", (process.env.PORT));
});