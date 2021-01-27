const express = require('express');
const Producto = require("../models/producto");
const { verificarToken } = require("../middleware/autenticacion");
const { find } = require('../models/producto');

const app = express();



//========================
//Obtener Productos
//========================
app.get('/productos', verificarToken, (req, res) => {
    // trae todos los productos
    //populate: usuario categoria
    //paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);
    Producto.find({ disponible: true })
        .skip(desde)
        .limit(3)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err)
                return res.status(400).json({
                    ok: false,
                    err
                });
            res.json({
                ok: true,
                producto: productoDB
            })
        })
});
//========================
//Obtener un Producto por ID
//========================
app.get('/productos/:id', verificarToken, (req, res) => {
    //populate: usuario categoria
    let id = req.params.id;
    Producto.findById(id, (err, productoDB) => {
            if (err)
                return res.status(400).json({
                    ok: false,
                    err
                });
            res.json({
                ok: true,
                producto: productoDB
            })

        })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
});
//========================
//Buscar Productos
//========================
app.get('/productos/buscar/:termino', verificarToken, (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i'); // expresion regular (la i es para que sea sensible a mayusculas y minusculas)
    //para hacer la busqueda mas flexible
    Producto.find({ descripcion: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err)
                return res.status(400).json({
                    ok: false,
                    err
                });
            res.json({
                ok: true,
                producto: productoDB
            })
        })
})


//========================
//Crear un nuevo Producto 
//========================
app.post('/productos', verificarToken, (req, res) => {
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({ // manda el error por si algo anda mal
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    })
});
//========================
//Actualizar Producto 
//========================
app.put('/productos/:id', verificarToken, (req, res) => {
    let body = req.body;
    let id = req.params.id;
    let modificarProd = {
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
    }
    Producto.findByIdAndUpdate(id, modificarProd, (err, productoDB) => {
        if (err) {
            return res.status(500).json({ // manda el error por si algo anda mal
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    })
});
//========================
//Borrar un Producto 
//========================
app.delete('/productos/:id', (req, res) => {
    //cambiar el esto de disponible a falso
    let id = req.params.id;
    let disponible = {
        disponible: false
    }
    Producto.findByIdAndUpdate(id, disponible, (err, productoDB) => {
        if (err) {
            return res.status(500).json({ // manda el error por si algo anda mal
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    })
});
module.exports = app;