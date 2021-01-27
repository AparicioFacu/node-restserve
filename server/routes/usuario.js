const express = require('express');

const Usuario = require("../models/usuario");
const { verificarToken, verificaAdmin_Role } = require("../middleware/autenticacion")
const bcrypt = require('bcrypt'); // este npm sirve para encriptar el password
const _ = require("underscore"); // este npm es para validaciones especificas
const app = express();

app.get('/usuario', verificarToken, (req, res) => { //el segundo parametro es un middleware
    let desde = req.query.desde || 0; // el query sirve para buscar dentro de la base de dato. el parametro desde si es que se pone lo buscara desde el numero que haya ingresado o sino desde 0
    desde = Number(desde); // lo paso a numero
    let limite = req.query.limite || 5;
    limite = Number(limite);
    Usuario.find({ estado: true }, "nombre email role") // el find sirve para regresar todo lo que este la base de dato primer parametro para especificar un condicion, el segundo parametro es para mostrar al usuario solo la informacion especificada(nombre,email) 
        .skip(desde) // para mostrar desde que usuario empezar a mostrar
        .limit(limite) // para poner un limite de los usarios que quiero mostrar
        .exec((err, usuarios) => { // para ejecutar el get
            if (err) { // el error de siempre
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Usuario.count({ estado: true }, (err, conteo) => { // el conteo es para ver la cantidad de registro que hay. elprimer parametro es para pomer una condicion que tiene que ser igual a la del find si es que hay alguna condicion
                res.json({
                    ok: true, // la respuesta
                    usuarios,
                    cuantos: conteo
                });
            })


        })
})
app.post('/usuario', [verificarToken, verificaAdmin_Role], (req, res) => {

    let body = req.body; // este body es el que va a aparecer cuando se procese el app.use(...)
    let usuario = new Usuario({ // aqui se crea el usuario con sus propiedades que tienen que coincidir con la base de datos
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10), // se encripta la clave
        //img : body.img,
        role: body.role
    })
    usuario.save((err, usuarioDB) => { // se guarda el usuario
        if (err) {
            return res.status(400).json({ // manda el error por si algo anda mal
                ok: false,
                err
            });
        };

        //usuarioDB.password = null;
        res.json({
            ok: true,
            usuario: usuarioDB // muestra el usuario
        })
    });
})
app.put('/usuario/:id', [verificarToken, verificaAdmin_Role], (req, res) => { // sirve para actualizar el registro

    let id = req.params.id; // este id seria el id del usuario(url) al usuario que yo quiero modificar    
    let body = _.pick(req.body, ["nombre", "email", "img", "rola", "estado"]); // esto es poner todoas las propiedades que son validas para poder actualizar

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => { // para las validaciones,el segundo parametro es el objeto que queremos actualizar 

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    })

})
app.delete('/usuario/:id', [verificarToken, verificaAdmin_Role], (req, res) => { // sirve para borrar pero en realidad es lo cambiar el estado xq el registro siempre queda

    let id = req.params.id;
    let cambiaEstado = {
            estado: false
        }
        //Usuario.findByIdAndRemove(id(usuarioBorrado)) //esta funcion elimina por completo el registro, se borra fisicamente
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => { // aqui solo cambiamos el estado del registro a falso, para no eliminarlo por completo
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "usuario no encontrado"
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
})

module.exports = app;