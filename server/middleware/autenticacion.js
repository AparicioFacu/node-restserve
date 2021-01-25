const jwt = require('jsonwebtoken');
// ===============================
//  Verificar Token
//=================================
let verificarToken = (req, res, next) => { // el next es para continuar la ejecucion del programa

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => { //primer paramtero el token, el segundo el SEED(config.js),el callback del error y decoded(aqui dentro estaria la info del usuario)
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: "Token no es valido"
                }
            })
        }
        req.usuario = decoded.usuario;
        next();
    });
};

// ===============================
//  Verificar AdminRole
//================================

let verificaAdmin_Role = (req, res, next) => {
    let usuario = req.usuario;
    if (usuario.role === "ADMIN_ROLE") {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: "El usuario no es administrador"
            }
        });
    }
};

module.exports = {
    verificarToken,
    verificaAdmin_Role
}