const mongoose = require('mongoose');
const tanqueroSchema = new mongoose.Schema({
    fecha: { type: Date, required: true },
    numero: { type: Number, required: true, unique: true },
    centroAcopio: { type: String, enum: ['Zamora', 'Zumbi', 'Encuentros'], required: true },
    cantidadRecibo: { type: Number, required: true },
    cantidadRegla: { type: Number, required: true },
    diferencia: { type: Number, required: true },
    totalLitros: { type: Number, required: true },
    compartimento: { type: String, enum: ['C1', 'C2', 'C3'], required: true },
    muestraTipo: { type: String, required: true },
    estado: { type: String, enum: ['nuevo', 'aprobado'], default: 'nuevo', required: true },
    pruebasRealizadas: [{
        compartimento: { type: String, enum: ['C1', 'C2', 'C3'], required: true },
        color: { type: String, enum: ['blanco opalescente o ligeramente amarillo', 'amarillo', 'otro'], required: true },
        olor: { type: String, enum: ['suave', 'otro'], required: true },
        sabor: { type: String, enum: ['lácteo característico', 'otro'], required: true },
        color: { type: String, required: true },
        olor: { type: String, required: true },
        sabor: { type: String, required: true },
        alcohol: { type: String, enum: ['-', '+'], required: true },
        acidez: { type: Number, required: true },
        densidad: { type: Number, required: true },
        temperatura: { type: Number, required: true },
        mastitis: { type: String, enum: ['negado', 'nivel1', 'nivel2', 'nivel3'], required: true },
        mastitis: { type: String, required: true },
        otros: { type: String },
    }],
    observaciones: { type: String },
    antibioticos: [{ // Nueva sección para Antibióticos
        antibiotico: { type: String },
        resultado: { type: String }
    }],
    supervisor: { type: String },
    analista: { type: String },
    supervisor: { type: String }
});

const Tanquero = mongoose.model('Tanquero', tanqueroSchema);
module.exports = Tanquero;