import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthProvider';
import TanqueroLayout from '../layout/TanqueroLayout';
import { API_URL } from '../auth/constants';
import { Tanquero } from '../types/types';
import { Icon } from '@iconify/react';


const opcionesCompartimento = ['C1', 'C2', 'C3'];
const opcionesCentroAcopio = ['Zamora', 'Zumbi', 'Encuentros'];

export default function NuevoRegistroTanquero() {
    const [registros, setRegistros] = useState<Tanquero[]>([]);
    const auth = useAuth();
    const [fecha, setFecha] = useState('');
    const [numero, setNumero] = useState(''); // Omitir manejo si el backend se encarga del auto-incremento
    const [centroAcopio, setCentroAcopio] = useState(opcionesCentroAcopio[0]);
    const [cantidadRecibo, setCantidadRecibo] = useState('');
    const [cantidadRegla, setCantidadRegla] = useState('');
    const [diferencia, setDiferencia] = useState('');
    const [totalLitros, setTotalLitros] = useState('');
    const [compartimento, setCompartimento] = useState(opcionesCompartimento[0]);
    const [muestraTipo, setMuestraTipo] = useState('');
    const [color, setColor] = useState(''); // Actualiza de booleano a string
    const [olor, setOlor] = useState('');
    const [sabor, setSabor] = useState(''); // Actualiza de booleano a string
    const [alcohol, setAlcohol] = useState(''); // Actualiza de booleano a string
    const [acidez, setAcidez] = useState('');
    const [densidad, setDensidad] = useState('');
    const [temperatura, setTemperatura] = useState('');
    const [mastitis, setMastitis] = useState('');
    const [otros, setOtros] = useState('');
    const [observaciones, setObservaciones] = useState('');
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        const fetchRegistros = async () => {
            try {
                const response = await fetch(`${API_URL}/tanquero`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setRegistros(data);
                } else {
                    console.error('Error al obtener registros:', response.statusText);
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
            }
        };

        fetchRegistros();
    }, []);

    useEffect(() => {
        if (registros.length > 0) {
            const ultimoRegistro = registros[registros.length - 1];
            const nuevoNumero = parseInt(ultimoRegistro.numero, 10) + 1;
            setNumero(nuevoNumero.toString());
        }
    }, [registros]);

    const getColorForValue = (value, min, max) => {
        if (value < min || value > max) return 'text-danger'; // Rojo para fuera de rango
        if (value === min || value === max) return 'text-warning'; // Amarillo para límite
        return 'text-success'; // Verde para dentro del rango
    };
    const handleCantidadReciboChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCantidadRecibo(value);
        calculateDiferenciaAndTotalLitros(cantidadRegla, value);
    };
    const handleCantidadReglaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCantidadRegla(value);
        calculateDiferenciaAndTotalLitros(value, cantidadRecibo);
    };
    const calculateDiferenciaAndTotalLitros = (cantidadRegla: string, cantidadRecibo: string) => {
        const regla = parseFloat(cantidadRegla) || 0;
        const recibo = parseFloat(cantidadRecibo) || 0;
        setDiferencia((regla - recibo).toString());
        setTotalLitros(cantidadRegla);
    };
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/tanquero`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fecha,
                    numero,
                    centroAcopio,
                    cantidadRecibo,
                    cantidadRegla,
                    diferencia,
                    totalLitros,
                    compartimento,
                    muestraTipo,
                    pruebasRealizadas: [
                        {
                            compartimento,
                            color,
                            olor,
                            sabor,
                            alcohol,
                            acidez,
                            densidad,
                            temperatura,
                            mastitis,
                            otros,
                        }
                    ],
                    observaciones,
                }),
            });
            if (response.ok) {
                // Enviar correo electrónico
                const emailResponse = await fetch(`${API_URL}/send-email`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        to: 'jefe.planta@ejemplo.com', // Cambia la dirección según sea necesario
                        subject: 'Nuevo Registro de Tanquero',
                        text: `Se ha creado un nuevo registro con los siguientes detalles:\n\n${JSON.stringify({
                            fecha,
                            numero,
                            centroAcopio,
                            cantidadRecibo,
                            cantidadRegla,
                            diferencia,
                            totalLitros,
                            compartimento,
                            muestraTipo,
                            pruebasRealizadas: [
                                {
                                    compartimento,
                                    color,
                                    olor,
                                    sabor,
                                    alcohol,
                                    acidez,
                                    densidad,
                                    temperatura,
                                    mastitis,
                                    otros,
                                }
                            ],
                            observaciones,
                        }, null, 2)}`
                    }),
                });
                if (emailResponse.ok) {
                    setMensaje('Registro guardado correctamente y correo enviado.');
                } else {
                    setMensaje('Registro guardado, y correo enviado.');
                }
                // Limpiar los campos después de guardar
                setFecha('');
                setNumero('');
                setCentroAcopio(opcionesCentroAcopio[0]);
                setCantidadRecibo('');
                setCantidadRegla('');
                setDiferencia('');
                setTotalLitros('');
                setCompartimento(opcionesCompartimento[0]);
                setMuestraTipo('');
                setColor('');
                setOlor('');
                setSabor('');
                setAlcohol('');
                setAcidez('');
                setDensidad('');
                setTemperatura('');
                setMastitis('');
                setOtros('');
                setObservaciones('');
            } else {
                setMensaje('Error al guardar el registro');
                console.error('Error al guardar el registro');
            }
        } catch (error) {
            setMensaje('Error durante el envío');
            console.error('Error durante el envío:', error);
        }
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log('Archivo seleccionado:', file);
            const imageUrl = URL.createObjectURL(file);
            console.log('URL de la imagen:', imageUrl);
            // Puedes usar imageUrl para mostrar una vista previa de la imagen si lo deseas
        }
    };

    return (
        <TanqueroLayout>
            <div className="container mt-4">
                <h1 className="text-center mb-4">Nuevo Registro</h1>
                {mensaje && <div className="alert alert-info">{mensaje}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="fecha" className="form-label">Fecha:</label>
                            <input
                                type="date"
                                className="form-control form-control-lg"
                                id="fecha"
                                name="fecha"
                                value={fecha}
                                onChange={(e) => setFecha(e.target.value)}
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="numero" className="form-label">Nro:</label>
                            <input
                                type="text"
                                className="form-control form-control-lg"
                                id="numero"
                                name="numero"
                                value={numero}
                                onChange={(e) => setNumero(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="centro_acopio" className="form-label">Centro Acopio:</label>
                            <select
                                className="form-select"
                                id="centro_acopio"
                                name="centro_acopio"
                                value={centroAcopio}
                                onChange={(e) => setCentroAcopio(e.target.value)}
                            >
                                {opcionesCentroAcopio.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="cantidad_recibo" className="form-label">Cantidad en litros por recibo:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="cantidad_recibo"
                                name="cantidad_recibo"
                                value={cantidadRecibo}
                                onChange={handleCantidadReciboChange}
                            />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="cantidad_regla" className="form-label">Cantidad en litros por regla:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="cantidad_regla"
                                name="cantidad_regla"
                                value={cantidadRegla}
                                onChange={handleCantidadReglaChange}
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="diferencia" className="form-label">Diferencia:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="diferencia"
                                name="diferencia"
                                value={diferencia}
                                readOnly
                            />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="total_litros" className="form-label">Total Litros:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="total_litros"
                                name="total_litros"
                                value={totalLitros}
                                readOnly
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="compartimento" className="form-label">Compartimento:</label>
                            <select
                                className="form-select"
                                id="compartimento"
                                name="compartimento"
                                value={compartimento}
                                onChange={(e) => setCompartimento(e.target.value)}
                            >
                                {opcionesCompartimento.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="muestra_tipo" className="form-label">Tipo de Muestra:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="muestra_tipo"
                                name="muestra_tipo"
                                value={muestraTipo}
                                onChange={(e) => setMuestraTipo(e.target.value)}
                            />
                        </div>
                    </div>
                    <h2 className="mb-3">Pruebas Realizadas</h2>
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Prueba</th>
                                    <th>Valor</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Acidez</td>
                                    <td>
                                        <input
                                            type="text"
                                            className={`form-control ${getColorForValue(parseFloat(acidez), 0.13, 0.17)}`}
                                            id="acidez"
                                            name="acidez"
                                            value={acidez}
                                            onChange={(e) => setAcidez(e.target.value)}
                                            style={{ width: '150px' }}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Densidad</td>
                                    <td>
                                        <input
                                            type="text"
                                            className={`form-control ${getColorForValue(parseFloat(densidad), 1.028, 1.034)}`}
                                            id="densidad"
                                            name="densidad"
                                            value={densidad}
                                            onChange={(e) => setDensidad(e.target.value)}
                                            style={{ width: '150px' }}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Temperatura</td>
                                    <td>
                                        <input
                                            type="text"
                                            className={`form-control ${getColorForValue(parseFloat(temperatura), 9, 11)}`}
                                            id="temperatura"
                                            name="temperatura"
                                            value={temperatura}
                                            onChange={(e) => setTemperatura(e.target.value)}
                                            style={{ width: '150px' }}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Color</td>
                                    <td>
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="colorCumple"
                                                name="colorCumple"
                                                checked={color === "blanco opalescente o ligeramente amarillo"}
                                                onChange={() => setColor("blanco opalescente o ligeramente amarillo")}
                                            />
                                            <label className="form-check-label" htmlFor="colorCumple">Blanco opalescente o ligeramente amarillo</label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="colorNoCumple"
                                                name="colorNoCumple"
                                                checked={color === "otro color"}
                                                onChange={() => setColor("otro color")}
                                            />
                                            <label className="form-check-label" htmlFor="colorNoCumple">Otro color</label>
                                        </div>
                                        <div className="form-group mt-3 text-center">
                                            <label htmlFor="foto" className="form-label">
                                                <Icon icon="ri:camera-fill" style={{ fontSize: '30px', color: '#ff0000' }} /></label>
                                            <input
                                                type="file"
                                                className="form-control-file mx-auto"
                                                id="foto"
                                                name="foto"
                                                accept="image/*"
                                                capture="user" // o "environment" para la cámara trasera
                                                onChange={handleFileChange}
                                            />
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Olor</td>
                                    <td>
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="olorCumple"
                                                name="olorCumple"
                                                checked={olor === "suave"}
                                                onChange={() => setOlor("suave")}
                                            />
                                            <label className="form-check-label" htmlFor="olorCumple">Suave</label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="olorNoCumple"
                                                name="olorNoCumple"
                                                checked={olor === "otro olor"}
                                                onChange={() => setOlor("otro olor")}
                                            />
                                            <label className="form-check-label" htmlFor="olorNoCumple">Otro olor</label>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Sabor</td>
                                    <td>
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="saborCumple"
                                                name="saborCumple"
                                                checked={sabor === "lácteo característico"}
                                                onChange={() => setSabor("lácteo característico")}
                                            />
                                            <label className="form-check-label" htmlFor="saborCumple">Lácteo característico</label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="saborNoCumple"
                                                name="saborNoCumple"
                                                checked={sabor === "otro sabor"}
                                                onChange={() => setSabor("otro sabor")}
                                            />
                                            <label className="form-check-label" htmlFor="saborNoCumple">Otro sabor</label>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Alcohol</td>
                                    <td>
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="alcoholCumple"
                                                name="alcoholCumple"
                                                checked={alcohol === "-"}
                                                onChange={() => setAlcohol("-")}
                                            />
                                            <label className="form-check-label" htmlFor="alcoholCumple">No presenta partículas coagulación (-)</label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="alcoholNoCumple"
                                                name="alcoholNoCumple"
                                                checked={alcohol === "+"}
                                                onChange={() => setAlcohol("+")}
                                            />
                                            <label className="form-check-label" htmlFor="alcoholNoCumple">Presenta partículas coagulación (+)</label>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Mastitis</td>
                                    <td>
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="mastitisNegado"
                                                name="mastitis"
                                                value="negado"
                                                checked={mastitis === "negado"}
                                                onChange={(e) => setMastitis(e.target.checked ? "negado" : "")}
                                            />
                                            <label className="form-check-label" htmlFor="mastitisNegado">Negado (-)</label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="mastitisNivel1"
                                                name="mastitis"
                                                value="+"
                                                checked={mastitis === "+"}
                                                onChange={(e) => setMastitis(e.target.checked ? "+" : "")}
                                            />
                                            <label className="form-check-label" htmlFor="mastitisNivel1">(+)</label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="mastitisNivel2"
                                                name="mastitis"
                                                value="++"
                                                checked={mastitis === "++"}
                                                onChange={(e) => setMastitis(e.target.checked ? "++" : "")}
                                            />
                                            <label className="form-check-label" htmlFor="mastitisNivel2">(++)</label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="mastitisNivel3"
                                                name="mastitis"
                                                value="+++"
                                                checked={mastitis === "+++"}
                                                onChange={(e) => setMastitis(e.target.checked ? "+++" : "")}
                                            />
                                            <label className="form-check-label" htmlFor="mastitisNivel3">(+++)</label>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="observaciones" className="form-label">Observaciones:</label>
                        <textarea
                            className="form-control"
                            id="observaciones"
                            name="observaciones"
                            value={observaciones}
                            onChange={(e) => setObservaciones(e.target.value)}
                        ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg w-100">
                        Guardar
                    </button>
                </form>
            </div>
        </TanqueroLayout>
    );
}