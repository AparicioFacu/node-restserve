const express = require("express");

const Categoria = require("../models/categoria");

const { verificarToken, verificaAdmin_Role } = require("../middleware/autenticacion");

const app = express();
//===========================
//Mostrar todas las categoria
//===========================
app.get("/categoria", verificarToken, (req, res) => {
    Categoria.find({})
        .sort('descripcion') //ordena para que aparezca la descripcion primero
        .populate('usuario', 'nombre email') //esta propiedad es para mostrar los datos del usuario, el segundo parametro es para solo mostrar los datos especificados
        .exec((err, categoriasDB) => {
            if (err)
                return res.status(400).json({
                    ok: false,
                    err
                });
            res.json({
                ok: true,
                categorias: categoriasDB
            })
        })
});

//===========================
//Mostrar una categoria por ID
//===========================
app.get("/categoria/:id", verificarToken, (req, res) => {
    let id = req.params.id
    Categoria.findById(id, (err, categoriasDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        res.json({
            ok: true,
            categoria: categoriasDB
        });
    });
});
//===========================
//Crear nueva categoria
//===========================
app.post("/categoria", verificarToken, (req, res) => {
    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });
    categoria.save((err, categoriasDB) => {
        if (err) {
            return res.status(500).json({ // manda el error por si algo anda mal
                ok: false,
                err
            });
        }
        if (!categoriasDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriasDB
        });
    });
});
//===========================
//Modifica una categoria por ID
//===========================
app.put("/categoria/:id", verificarToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let descCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriasDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!categoriasDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriasDB
        });
    });
});
//===========================
//Elimina una categoria por ID
//===========================
app.delete("/categoria/:id", [verificarToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    //Categoria.findByIdAndRemove(id, categoriasDB);
    Categoria.findByIdAndRemove(id, { new: true }, (err, categoriasBorrada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        res.json({
            ok: true,
            message: "Categoria Borrada",
            categorias: categoriasBorrada
        });
    })
});

module.exports = app;