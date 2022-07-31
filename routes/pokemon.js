const express = require('express');
const pokemon = express.Router();
//const { pk } = require('../pokedex.json'); //las llaves funcionan como un buscador y toman todo lo que coincida con el nombre
const db = require('../config/database');

pokemon.post("/", async (req, res, next) => {

    const { pok_name, pok_height, pok_weight, pok_base_experience } = req.body; //estamos deconstruyendo estas variables y les agregamos un req.body al inicio, solo funciona con jsons

    if (pok_name && pok_height && pok_weight && pok_base_experience) {
        let query = "INSERT INTO pokemon(pok_name, pok_height, pok_weight, pok_base_experience)";
        query += ` VALUES('${pok_name}', ${pok_height}, ${pok_weight}, ${pok_base_experience})`;

        const rows = await db.query(query);

        if (rows.affectedRows == 1) {
            return res.status(201).json({ code: 201, message: "pokemon insertado correctamente" });
        }

        return res.status(500).json({ code: 500, message: "Ocurrio un error" });
    }
    return res.status(500).json({ code: 500, message: "campos incompletos" })

});

pokemon.delete("/:id([0-9]{1,3})", async (req, res, next) => {
    const query = `DELETE FROM pokemon WHERE pok_id=${req.params.id}`;

    const rows = await db.query(query);
    if (rows.affectedRows == 1) {
        return res.status(200).json({ code: 200, message: 'pokemon borrado correctamente' });
    }
    return res.status(404).json({ code: 404, message: 'pokemon no encontrado' });
});

pokemon.put("/:id([0-9]{1,3})", async (req, res, next) => {
    const { pok_name, pok_height, pok_weight, pok_base_experience } = req.body;
    if (pok_name && pok_height && pok_weight && pok_base_experience) {
        let query = `UPDATE pokemon SET pok_name='${pok_name}', pok_height=${pok_height}, `;
        query += `pok_weight=${pok_weight}, pok_base_experience=${pok_base_experience} WHERE pok_id=${req.params.id}`;

        const rows = await db.query(query);

        if (rows.affectedRows == 1) {
            return res.status(200).json({ code: 200, message: "pokemon actualizado correctamente" });
        }

        return res.status(500).json({ code: 500, message: "Ocurrio un error" });
    }
    return res.status(500).json({ code: 500, message: "campos incompletos" })

});

pokemon.patch("/:id([0-9]{1,3})", async (req, res, next) => {

    if (req.body.pok_name) {
        let query = `UPDATE pokemon SET pok_name='${req.body.pok_name}' WHERE pok_id=${req.params.id} `;
        const rows = await db.query(query);

        if (rows.affectedRows == 1) {
            return res.status(200).json({ code: 200, message: "pokemon actualizado correctamente" });
        }

        return res.status(500).json({ code: 500, message: 'Ocurrio un error' });
    }
    return res.status(500).json({ code: 500, message: 'datos incompletos' })

});

pokemon.get("/", async (req, res, next) => { //"/: nos dice que ahora es un variable por lo tanto pdoemos asignarle mas uris pro ejemplo /:nombreX/edad "
    //console.log(req.params.name); //recordemos que req es una peticion del usuario
    const pkmn = await db.query("SELECT * FROM pokemon");
    return res.status(200).json({ code: 1, message: pkmn });
});


pokemon.get('/:id([0-9]{1,3})', async (req, res, next) => {
    const id = req.params.id - 1;
    if (id >= 1 && id <= 722) {
        const pkmn = await db.query("SELECT * FROM pokemon WHERE pok_id=" + id + ";");
        return res.status(200).json({ code: 1, message: pkmn })
    }
    return res.status(404).json({ code: 404, message: "pokemon no encontrado" });

});

pokemon.get('/:name([A-Za-z]+)', async (req, res, next) => {
    const name = req.params.name;
    const pkmn = await db.query("SELECT * FROM pokemon WHERE pok_name='" + name + "';");
    if (pkmn.length > 0) {
        return res.status(200).json({ code: 1, message: pkmn });

    }
    return res.status(404).send({ code: 404, message: "pokemon no encontrado" });
    // for (i = 0; i < pokemon.length; i++) {
    //     if (pokemon[i].name.toUpperCase() == name.toUpperCase()) {

    //         return res.status(200).send(pokemon[i]);
    //     }
    //     return res.status(404).send('pokemon no encontrado')
    // }

    // const pkmn = pk.filter((p) => { //pk es un arreglo que va almacenar lo que se adapte al filtro que establecimos
    //     // if (p.name.toUpperCase() == name.toUpperCase()) {
    //     //     return p;
    //     // }


    //     // operador ternario: condicion ? valor_si_true : valor_si_false
    //     return (p.name.toUpperCase() == name.toUpperCase()) ? p : null;

    // });

    // console.log(pk);

    // (pkmn.length > 0) ? res.status(200).send(pkmn) : res.status(404).send("Pokemon no encontrado");


});

module.exports = pokemon; //la forma mas sencilla de exportar pero solo nos permite exportar una sola cosa