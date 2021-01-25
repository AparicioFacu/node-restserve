const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require("../models/usuario");
const app = express();

app.post('/login', (req, res) => { // req(es la solicitud que se esta haciendo), res(es la respuesta que se desea retornar)

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => { // este find sirve para deolver una sola propiedad, en este caso como condicion esta el email
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario y/o Contraseña incorrecto"
                }
            });
        };
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) { //funcion del bcrypt para comparar las password de la base de datos con la que ingresa el usuario
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario y/o Contraseña incorrecto"
                }
            });
        }
        let token = jwt.sign({ //generamos el token para el usuario
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }); // process.env.SEED(esto es la clave secreta del token para la autenticacion)
        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });
    });
})

module.exports = app;