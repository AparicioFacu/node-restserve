//==============================
// Puerto
//==============================

process.env.PORT = process.env.PORT || 3000; //determina el puerto que se utilizara, si no determina un puerto por defecto queda el puerto 3000

//===================================
// Entorno
//===================================

process.env.NODE_ENV = process.env.NODE_ENV || "dev";


//===================================
// Base de Datos
//===================================
let urlDB;

if (process.env.NODE_ENV === "dev") {
    urlDB = "mongodb://localhost:27017/cafe";
} else {
    urlDB = "mongodb+srv://chiino23:KEB8A9hlGJ5BrOzl@cluster0.hkdxs.mongodb.net/cafe";
}

process.env.URLDB = urlDB;