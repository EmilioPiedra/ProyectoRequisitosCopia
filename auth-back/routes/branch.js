const express = require('express');
const { jsonResponse } = require('../lib/jsonResponse');
const Branch = require('../schema/branch');
const Bicycle = require('../schema/bicycle');
const router = express.Router();
const authenticate = require('../auth/authenticate');

// Obtener todas las direcciones
router.get('/', async (req, res) => {
    try {
        const branches = await Branch.find().populate('bicycles');
        res.status(200).json(branches);
    } catch (error) {
        console.error("Error al obtener direcciones:", error.message);
        res.status(500).json({ error: "Error interno al obtener direcciones" });
    }
});

// Función para enviar respuestas JSON con código de estado y mensaje de error
function sendErrorResponse(res, status, errorMessage) {
    res.status(status).json({ error: errorMessage });
}

// Crear una nueva dirección con bicicletas
router.post('/', authenticate, async (req, res) => {
    try {
        const { name, lat, lon, bicycles } = req.body;

        // Validar campos
        if (!name || !lat || !lon) {
            return sendErrorResponse(res, 400, "Nombre, latitud y longitud son campos obligatorios.");
        }

        // Crear la dirección
        const createdBranch = await Branch.create({ name, lat, lon, bicycles: bicycles || [] });

        res.status(200).json(jsonResponse(200, createdBranch));
    } catch (error) {
        console.error("Error al crear dirección:", error.message);
        sendErrorResponse(res, 400, "Error al crear dirección");
    }
});

router.put('/:id', authenticate, async (req, res) => {
    try {
        const { name, lat, lon, bicycles } = req.body;

        // Validar campos
        if (!name || !lat || !lon) {
            return sendErrorResponse(res, 400, "Nombre, latitud y longitud son campos obligatorios.");
        }

        // Actualizar la dirección
        const updatedBranch = await Branch.findByIdAndUpdate(
            req.params.id,
            { name, lat, lon, bicycles: bicycles || [] },
            { new: true }
        );

        res.status(200).json(jsonResponse(200, updatedBranch));
    } catch (error) {
        console.error("Error al actualizar dirección:", error.message);
        sendErrorResponse(res, 400, "Error al actualizar dirección");
    }
});



// Obtener una dirección por ID
router.get('/:id', async (req, res) => {
    try {
        const branch = await Branch.findById(req.params.id).populate('bicycles');
        if (!branch) {
            return res.status(404).json({ error: "Dirección no encontrada" });
        }
        res.status(200).json(branch);
    } catch (error) {
        console.error("Error al obtener dirección por ID:", error.message);
        res.status(500).json({ error: "Error interno al obtener dirección por ID" });
    }
});


// Eliminar una dirección
router.delete('/:id', authenticate, async (req, res) => {
    try {
        // Eliminar solo la dirección
        const deletedBranch = await Branch.findByIdAndDelete(req.params.id);

        res.status(200).json(jsonResponse(200, deletedBranch));
    } catch (error) {
        console.error("Error al eliminar dirección:", error.message);
        res.status(500).json({ error: "Error interno al eliminar dirección" });
    }
});


module.exports = router;
