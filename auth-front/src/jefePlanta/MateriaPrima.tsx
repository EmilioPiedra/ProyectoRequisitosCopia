import React, { useState, useEffect } from 'react';
import JefePlantaLayout from '../layout/JefePlantaLayout';
import { useAuth } from '../auth/AuthProvider';
import { API_URL } from '../auth/constants';
import { Tanquero } from '../types/types'; // Asegúrate de importar correctamente los tipos necesarios

export default function MateriaPrima() {
    const auth = useAuth();
    const [registros, setRegistros] = useState<Tanquero[]>([]); // Estado para almacenar los registros

    // Función para cargar los registros desde la API
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
                setRegistros(data); // Actualiza el estado con los registros obtenidos
            } else {
                console.error('Error al obtener registros:', response.statusText);
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }
    };
    useEffect(() => {
        fetchRegistros();
    }, []); // Solo se ejecuta una vez al montar el componente

    // Función para aprobar un registro específico y asignar valor de reserva
    const aprobarRegistro = async (id: string, reservaValue: string) => {
        try {
            const response = await fetch(`${API_URL}/tanquero/${id}/aprobar`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ reserva: reservaValue }) // Incluye el valor de reserva en la solicitud PUT
            });

            if (response.ok) {
                console.log('Registro aprobado correctamente');
                // Actualizar el estado local para reflejar el cambio
                const updatedRegistros = registros.map(registro => {
                    if (registro._id === id) {
                        return { ...registro, estado: 'aprobado', reserva: reservaValue }; // Actualiza el valor de reserva
                    }
                    return registro;
                });
                setRegistros(updatedRegistros);
            } else {
                console.error('Error al aprobar el registro:', response.statusText);
            }
        } catch (error) {
            console.error('Error durante la solicitud:', error);
        }
    };

    // Función para manejar el cambio en el select
    const handleReservaChange = (id: string, value: string) => {
        // Actualiza el estado local para reflejar el nuevo valor de reserva
        const updatedRegistros = registros.map(registro => {
            if (registro._id === id) {
                return { ...registro, reserva: value };
            }
            return registro;
        });
        setRegistros(updatedRegistros);
    };

    return (
        <JefePlantaLayout>
            <div className="container mt-4">
                <h1>Jefe Planta Materia Prima</h1>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Número</th>
                            <th>Centro Acopio</th>
                            <th>Cantidad Recibo</th>
                            <th>Total Litros</th>
                            <th>Compartimento</th>
                            <th>Observaciones</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {registros.map(registro => (
                            <tr key={registro._id}>
                                <td>{new Date(registro.fecha).toLocaleDateString()}</td>
                                <td>{registro.numero}</td>
                                <td>{registro.centroAcopio}</td>
                                <td>{registro.cantidadRecibo}</td>
                                <td>{registro.totalLitros}</td>
                                <td>{registro.compartimento}</td>
                                <td>{registro.observaciones || 'Ninguna'}</td>
                                <td>{registro.estado}</td>
                                <td>
                                    {registro.estado === 'nuevo' && (
                                        <>
                                            <button
                                                className="btn btn-success mr-2"
                                                onClick={() => aprobarRegistro(registro._id, registro.reserva || '')}
                                            >
                                                Aprobar
                                            </button>
                                            <select
                                                className="form-control"
                                                value={registro.reserva || ''}
                                                onChange={(e) => handleReservaChange(registro._id, e.target.value)}
                                            >
                                                <option value="">Seleccionar...</option>
                                                <option value="1">Tanque 1</option>
                                                <option value="2">Tanque 2</option>
                                                <option value="3">Tanque 3</option>
                                            </select>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </JefePlantaLayout>
    );
}
