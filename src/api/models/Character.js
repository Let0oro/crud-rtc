// Archivo Character.js dentro de la carpeta models
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Creamos el esquema de personajes
const characterSchema = new Schema(
    // 1. formato del documento que guardamos en la base de datos 
  {
    name: { type: String, required: true },//La propiedad required hace que el campo sea obligatorio
    age: { type: Number },
    alias: { type: String, required: true },
  },
    // 2. opciones, que serán "timestamps: true" en nuestro caso.   
  {
    // Esta propiedad servirá para guardar las fechas de creación y actualización de los documentos
    timestamps: true,
  }
);

// Creamos y exportamos el modelo Character
const Character = mongoose.model('Character', characterSchema);
module.exports = Character;