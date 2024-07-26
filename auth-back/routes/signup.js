const express = require('express');
const { jsonResponse } = require('../lib/jsonResponse');
const router = express.Router();
const User = require("../schema/user");

router.post('/', async (req, res) => {
    const usersData = [
        { name: 'Emilio', apellido: 'Piedra', userName: 'Emilio', pais: 'Ecuador', email: 'emilio@example.com', cedula: '123', password: 'clave123', fechaNacimiento: new Date('1990-01-01'), role: 'Jefe Planta' },
        { name: 'Jose', apellido: 'Codova', userName: 'Jose', pais: 'Ecuador', email: 'jose@example.com', cedula: '123', password: 'clave123', fechaNacimiento: new Date('1990-01-01'), role: 'Tanquero' },
        { name: 'Joseph', apellido: 'Martinez', userName: 'Joseph', pais: 'Ecuador', email: 'joseph@example.com', cedula: '123', password: 'clave123', fechaNacimiento: new Date('1990-01-01'), role: 'Codificador' },
        { name: 'Pana', apellido: 'Pana', userName: 'Pana', pais: 'Ecuador', email: 'pana@example.com', cedula: '123', password: 'clave123', fechaNacimiento: new Date('1990-01-01'), role: 'analizador' }
    ];

    try {
        for (const userData of usersData) {
            const exists = await User.findOne({ userName: userData.userName });

            if (exists) {
                return res.status(409).json(
                    jsonResponse(409, {
                        error: `Username ${userData.userName} already exists`,
                    })
                );
            }

            const newUser = new User(userData);
            await newUser.save();
        }

        res.status(200).json(jsonResponse(200, { message: "Usuarios creados correctamente" }));
    } catch (error) {
        console.error(error);
        return res.status(500).json(
            jsonResponse(500, {
                error: "Error creating users",
            })
        );
    }
});

module.exports = router;
