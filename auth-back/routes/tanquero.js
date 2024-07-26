const express = require('express');
const { jsonResponse } = require('../lib/jsonResponse');
const sendEmail = require('../routes/sendEmail'); // Asegúrate de la ruta correcta
const router = express.Router();
const Tanquero = require('../schema/tanquero');

router.post('/', async (req, res) => {
    try {
        const {
            fecha,
            numero,
            centroAcopio,
            cantidadRecibo,
            cantidadRegla,
            diferencia,
            totalLitros,
            compartimento,
            muestraTipo,
            pruebasRealizadas,
            observaciones,
            reserva
        } = req.body;

        const newRegistro = new Tanquero({
            fecha,
            numero,
            centroAcopio,
            cantidadRecibo,
            cantidadRegla,
            diferencia,
            totalLitros,
            compartimento,
            muestraTipo,
            pruebasRealizadas,
            observaciones,
            reserva
        });

        await newRegistro.save();

        // Convertir pruebasRealizadas a texto
        const pruebasRealizadasText = pruebasRealizadas.map((prueba, index) => `
           Prueba ${index + 1}:
           - Compartimento: ${prueba.compartimento}
           - Color: ${prueba.color}
           - Olor: ${prueba.olor}
           - Sabor: ${prueba.sabor}
           - Alcohol: ${prueba.alcohol}
           - Acidez: ${prueba.acidez}
           - Densidad: ${prueba.densidad}
           - Temperatura: ${prueba.temperatura}
           - Mastitis A: ${prueba.mastitisA}
           - Mastitis B: ${prueba.mastitisB}
           - Otros: ${prueba.otros}
       `).join('\n\n');

        // Crear HTML para el correo electrónico
        const html = `
           <h1>Nuevo Registro de Tanquero</h1>
           <p>Fecha: ${fecha}</p>
           <p>Número: ${numero}</p>
           <p>Centro de Acopio: ${centroAcopio}</p>
           <p>Cantidad Recibo: ${cantidadRecibo}</p>
           <p>Cantidad Regla: ${cantidadRegla}</p>
           <p>Diferencia: ${diferencia}</p>
           <p>Total Litros: ${totalLitros}</p>
           <p>Compartimento: ${compartimento}</p>
           <p>Muestra Tipo: ${muestraTipo}</p>
           <h2>Pruebas Realizadas:</h2>
           <p>${pruebasRealizadasText}</p>
           <p>Observaciones: ${observaciones}</p>
           <p>Reserva: ${req.body.reserva !== undefined ? req.body.reserva : 'No definido'}</p>
       `;

        // Enviar correo electrónico al 'Jefe Planta'
        const subject = 'Nuevo Registro de Tanquero';
        await sendEmail('real.emilio14@hotmail.com', subject, html); // Cambia la dirección de correo electrónico por la correcta

        res.json(jsonResponse(true, 'Registro guardado correctamente'));
    } catch (error) {
        console.error('Error al guardar el registro:', error);
        res.status(500).json(jsonResponse(false, 'Error al guardar el registro'));
    }
});

router.get('/', async (req, res) => {
    try {
        const registros = await Tanquero.find();
        res.status(200).json(registros);
    } catch (error) {
        console.error("Error al obtener registros:", error.message);
        res.status(500).json({ error: "Error interno al obtener registros" });
    }
});

router.put('/:id/aprobar', async (req, res) => {
    const { id } = req.params;
    const { reserva } = req.body;
    try {
        const registroActualizado = await Tanquero.findByIdAndUpdate(id, {
            estado: 'aprobado',
            reserva
        }, { new: true });

        if (!registroActualizado) {
            return res.status(404).json(jsonResponse(false, 'Registro no encontrado'));
        }

        res.status(200).json(jsonResponse(true, 'Registro aprobado correctamente', registroActualizado));
    } catch (error) {
        console.error('Error al aprobar el registro:', error);
        res.status(500).json(jsonResponse(false, 'Error al aprobar el registro'));
    }
});

module.exports = router;
