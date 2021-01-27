const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const Usuario = require("../models/usuario");
const Producto = require('../models/producto');

const app = express();

app.use(fileUpload()); //esta funcion hace que todos los archivos que se carguen quedan en req.files

app.put('/upload/:tipo/:id', (req, res) => {
    let id = req.params.id;
    let tipo = req.params.tipo;
    let archivo;
    let direccionArchivo;
    let nombreArchivoCortado;
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: "No se ha seleccionada ningun archivo"
                }
            })
    }
    //Validar Tipos

    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) { // esto significa que no encontro ninguno 
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: "Las tipos Permitidos son " + tiposValidos.join(', ')
                }
            });
    };

    archivo = req.files.archivo; //cuando se realiza un input el nombre que yo estoy ingresando tiene que llamarse archivo
    nombreArchivoCortado = archivo.name.split('.');
    let extension = nombreArchivoCortado[nombreArchivoCortado.length - 1];
    //Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) { // esto significa que no encontro ninguno 
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: "Las extensiones Permitidas son " + extensionesValidas.join(', '),
                    ext: extension
                }
            });
    }

    //Cambia el nombre del archivo

    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    direccionArchivo = `uploads/${tipo}/${nombreArchivo}` // aqui esta donde se va a guardar el archivo
    archivo.mv(direccionArchivo, (err) => { // la funcion que mueve al archivo al la carpeta seleccionada 
        if (err)
            return res.status(500)
                .json({
                    ok: false,
                    err
                });
        //Aqui la imagen ya se carga
        if (tiposValidos === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }


    });
});

function imagenUsuario(id, res, nombreArchivo) { //funcion para agregar la foto a un usuario
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'usuarios')
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            borrarArchivo(nombreArchivo, 'usuarios')
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario no existe"
                }
            });
        }

        borrarArchivo(usuarioDB.img, 'usuarios')

        usuarioDB.img = nombreArchivo; // agrega la imagen con el nombre de la imagen
        usuarioDB.save((err, usuarioDB) => {
            res.json({
                ok: true,
                usuario: usuarioDB,
                img: nombreArchivo
            })
        });

    });
}

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'productos')
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            borrarArchivo(nombreArchivo, 'productos')
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Producto no existe"
                }
            });
        }
        borrarArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;
        productoDB.save((err, productoDB) => {
            res.json({
                ok: true,
                producto: productoDB,
                img: nombreArchivo
            })
        });
    });
};

function borrarArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`); //direccion de la foto de un usuario si es que ya tiene una

    if (fs.existsSync(pathImagen)) { //esto es para ver si existe esa imagen(devuelve true si existe y false si no existe)
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;