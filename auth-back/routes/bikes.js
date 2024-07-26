const express = require('express');
const router = express.Router();
const Bicycle = require("../schema/bicycle");

// Obtener todas las bicicletas
router.get('/', async (req, res) => {
    try {
        const bicycles = await Bicycle.find();
        res.status(200).json(bicycles);
    } catch (error) {
        console.error("Error al obtener bicicletas:", error.message);
        res.status(500).json({ error: "Error interno al obtener bicicletas" });
    }
});

// Obtener una bicicleta por ID
router.get('/:id', async (req, res) => {
    try {
        const bicycle = await Bicycle.findById(req.params.id);

        if (!bicycle) {
            return res.status(404).json({ error: "Bicicleta no encontrada" });
        }

        res.status(200).json(bicycle);
    } catch (error) {
        console.error("Error al obtener la bicicleta por ID:", error.message);
        res.status(500).json({ error: "Error interno al obtener la bicicleta por ID" });
    }
});

// Actualizar una bicicleta por ID
router.put('/:id', async (req, res) => {
    try {
        const { name, description, price, status, image } = req.body;

        // Validar que se proporcionen todos los campos necesarios
        if (!name || !description || !price || !status || !image) {
            return res.status(400).json({ error: "Todos los campos (name, description, price, status, image) son obligatorios" });
        }

        const updatedBicycle = await Bicycle.findByIdAndUpdate(req.params.id, {
            name,
            description,
            price,
            status,
            image
        }, { new: true });

        if (!updatedBicycle) {
            return res.status(404).json({ error: "Bicicleta no encontrada" });
        }

        res.status(200).json(updatedBicycle);
    } catch (error) {
        console.error("Error al actualizar la bicicleta por ID:", error.message);
        res.status(500).json({ error: "Error interno al actualizar la bicicleta por ID" });
    }
});

// Agregar una nueva bicicleta
router.post('/', async (req, res) => {
    try {
        const { name, description, price, status, image } = req.body;

        // Validar que se proporcionen todos los campos necesarios
        if (!name || !description || !price || !image) {
            return res.status(400).json({ error: "Todos los campos (name, description, price, image) son obligatorios" });
        }

        // Crear una nueva instancia de Bicycle con los datos proporcionados
        const newBicycle = new Bicycle({
            name,
            description,
            price,
            status,
            image
        });

        // Guardar la bicicleta en la base de datos
        const savedBicycle = await newBicycle.save();
        res.status(201).json(savedBicycle);
    } catch (error) {
        console.error("Error al agregar la bicicleta:", error);

        // Devolver una respuesta HTTP clara con detalles del error
        res.status(500).json({ error: "Error interno al agregar la bicicleta", details: error.message });
    }
});



// Eliminar una bicicleta por ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedBicycle = await Bicycle.findByIdAndDelete(req.params.id);

        if (!deletedBicycle) {
            return res.status(404).json({ error: "Bicicleta no encontrada" });
        }

        res.status(200).json({ message: "Bicicleta eliminada correctamente" });
    } catch (error) {
        console.error("Error al eliminar la bicicleta por ID:", error.message);
        res.status(500).json({ error: "Error interno al eliminar la bicicleta por ID" });
    }
});

module.exports = router;
