const express = require("express");

const Character = require("../models/Character");

const router = express.Router();
// CRUD - READ (GET)
/** Arguments:
 * req → Nos permite acceder a la información que el cliente envía al servidor, 
         como las cookies, los query o los request params.

 * res → Nos permite modificar las respuestas y enviar datos al cliente tras completar 
         un proceso a través del status o las funciones send o json.

 * next → Si llamamos a esta función sin envíar nada como argumento, Express avanzará 
         hasta el siguiente punto de control de la aplicación (middleware), y si enviamos 
         un argumento de tipo error, se lanzará el controlador de errores de Express.

        → Cuando un middleware o manejador de ruta llama a next(), Express ejecutará la 
         siguiente función en la cadena de middlewares o manejadores de rutas que se han 
         registrado para la ruta actual. Si ningún otro middleware o manejador de ruta llama 
         a next(), la solicitud se considera terminada y se envía una respuesta al cliente.
*/

// En este punto, ya existiría la ruta /characters, por lo que lo óptimo es un router.get('/', ...)
router.get("/", async (req, res, next) => {
  try {
    const characters = await Character.find();
    return res.status(200).json(characters);
  } catch (err) {
    return next(err);
  }
});
// router.get('/characters', async (req, res) => {
//     // Encontrar todos los caracteres
//     try {
//         const characters = await Character.find();
//         return res.status(200).json(characters);
//     } catch (err) {
//         return res.status(500).json(err)
//     }

// Otra posibilidad con then y catch
// router.get('/characters', (req, res) => {
// return Character.find()
//     .then(characters => {
//         return res.status(200).json(characters);
//     })
//     .catch(err => {
//         return res.status(500).json(err);
//     });
// });

router.get("/:id", async (req, res) => {
  // Encontrar caracter por su id
  const { id } = req.params;
  try {
    const character = await Character.findById(id);
    if (character) {
      return res.status(200).json(character);
    } else {
      return res.status(404).json("No character found by this id");
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.get("/alias/:alias", async (req, res) => {
  // Encontrar caracter por su alias
  const { alias } = req.params;
  try {
    const characterByAlias = await Character.find({ alias: alias });
    return res.status(200).json(characterByAlias);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.get("/age/:age", async (req, res) => {
  // Encontrar caracter por su edad
  const { age } = req.params;
  try {
    const characterByAge = await Character.find({ age: { $gt: age } });
    /** Condicionales:
     * Si usamos $lt (less than) encontraremos valores menores al que usemos.
     * Si usamos $lte (less than equal) encontraremos valores menores o igual al usado.
     * Si usamos $gt (greater than) encontraremos los valores mayores al usado.
     * Si usamos $gte (greater than equal) encontraremos los valores mayores e iguales al usado. */
    return res.status(200).json(characterByAge);
  } catch (err) {
    return res.status(500).json(err);
  }
});
// ---

// CRUD CREATE (POST) & UPDATE (PUT & PATCH)
// Los endpoints de tipo POST y PUT pueden tener una propiedad llamada *body* que utilizaremos para enviar datos a estos endpoints.
// POST
router.post("/create", async (req, res, next) => {
  try {
    // Crearemos una instancia de character con los datos enviados
    const newCharacter = new Character({
      name: req.body.name,
      age: req.body.age,
      alias: req.body.alias,
      role: req.body.role,
    });

    // Guardamos el personaje en la DB
    const createdCharacter = await newCharacter.save();
    return res.status(201).json(createdCharacter);
  } catch (error) {
    // Lanzamos la función next con el error para que lo gestione Express
    next(error);
  }
});

// PUT
router.put('/edit/:id', async (req, res, next) => {
    try {
        const { id } = req.params //Recuperamos el id de la url
        const characterModify = new Character(req.body) //instanciamos un nuevo Character con la información del body
        characterModify._id = id //añadimos la propiedad _id al personaje creado
        const characterUpdated = await Character.findByIdAndUpdate(id , characterModify)
        return res.status(200).json(characterUpdated)//Este personaje que devolvemos es el anterior a su modificación
    } catch (error) {
        return next(error)
    }
});


// ---

// CRUD DELETE
// Utilizaremos un parámetro de ruta /:id para identificar el elemento que queremos eliminar de nuestra DB
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    // No será necesaria asignar el resultado a una variable ya que vamos a eliminarlo
    await Character.findByIdAndDelete(id);
    return res.status(200).json("Character deleted!");
  } catch (error) {
    return next(error);
  }
});
// ---

module.exports = router;
