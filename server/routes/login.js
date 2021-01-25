const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require("../models/usuario");
const app = express();

const { OAuth2Client } = require('google-auth-library'); //para el sign-in de google
const client = new OAuth2Client(process.env.CLIENT_ID); //para el sign-in de google

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

//Configuracion de Google

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload(); // aqui se obtiene toda la informacion del usuario

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}
app.post('/google', async(req, res) => {

    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            });
        });

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "debe de usar su autenticacion normal"
                    }
                });
            } else {
                let token = jwt.sign({ //generamos el token para el usuario
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            }
        } else {
            //Si el usuario no existe en nuestra base de datos(nuevo usuario)
            let usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ":)";

            usuario.save((err, usuarioDB) => { //esto graba en la base de dato
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                };
                let token = jwt.sign({ //generamos el token para el usuario
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            })
        }

    });
});
module.exports = app;