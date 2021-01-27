const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator"); // para validar el email para que se unico
let Schema = mongoose.Schema;

let rolesValidos = { // para limitar el uso de roles de los usuarios
    values: ["ADMIN_ROLE", "USER_ROLE"], // solo estos usuario se permiten
    message: "{VALUE} no es un rol valido" // el value sirve para poner el valor dinamico que haya incresado el usuario

}
let usuarioSchema = new Schema({ // es el esquema de la base de datos. una linea en la base de datos tendra todos las propiedades que se definen aqui dentro
    nombre: {
        type: String,
        required: [true, "El nombre es necesario"] // el required sirve para que sea obligatorio el campo
    },
    email: {
        type: String,
        unique: true, // el unique sirve para q este campo sea unico y no repita, es decir no puede haber 2 usuarios con el mismo email
        required: [true, "El corre es necesario"]
    },
    password: {
        type: String,
        required: [true, "La contraseña es obligaria"]
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        required: [true, "El rol del usuario es necesario"],
        default: "USER_ROLE",
        enum: rolesValidos // aqui se ingresan los roles validos definidos arriba
    },
    estado: {
        type: Boolean,
        required: [true, "El estado es necesario"],
        default: true
    },
    google: {
        type: Boolean,
        required: [true],
        default: false
    }
});
//excluir password del modelo
usuarioSchema.methods.toJSON = function() { // esto es un metodo para que el password no salga como informacion, es decir lo oculta a la vista al password
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject
}

usuarioSchema.plugin(uniqueValidator, { message: "{PATH} debe de ser unico" }); // el plugin para que sea unico el email

module.exports = mongoose.model("Usuario", usuarioSchema);