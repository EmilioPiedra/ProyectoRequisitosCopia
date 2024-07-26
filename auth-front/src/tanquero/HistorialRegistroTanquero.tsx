import React, { useState, useEffect } from 'react';
import TanqueroLayout from '../layout/TanqueroLayout';
import { useAuth } from '../auth/AuthProvider';
import { API_URL } from '../auth/constants';
import { Tanquero } from '../types/types';

export default function HistorialRegistroTanquero() {
    const auth = useAuth();
    const [registros, setRegistros] = useState<Tanquero[]>([]);
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
                    const nuevosRegistros = data.filter((registro: Tanquero) => registro.estado === 'nuevo');
                    setRegistros(nuevosRegistros);
                } else {
                    console.error('Error al obtener registros:', response.statusText);
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
            }
        };

        fetchRegistros();
    }, []);

    return (
        <TanqueroLayout>
            <div className="container mt-5">
                <h1 className="mb-4 text-center">Historial de Registros de Tanquero</h1>
                <div className="table-responsive">
                    <table className="table table-hover table-bordered">
                        <thead className="thead-dark">
                            <tr>
                                <th>Fecha</th>
                                <th>Número</th>
                                <th>Centro Acopio</th>
                                <th>Cantidad Recibo</th>
                                <th>Cantidad Regla</th>
                                <th>Diferencia</th>
                                <th>Total Litros</th>
                                <th>Compartimento</th>
                                <th>Tipo de Muestra</th>
                                <th>Color</th>
                                <th>Olor</th>
                                <th>Sabor</th>
                                <th>Alcohol</th>
                                <th>Acidez</th>
                                <th>Densidad</th>
                                <th>Temperatura</th>
                                <th>Mastitis A</th>
                                <th>Mastitis B</th>
                                <th>Observaciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registros.length > 0 ? (
                                registros.map((registro) => (
                                    <tr key={registro._id}>
                                        <td>{new Date(registro.fecha).toLocaleDateString()}</td>
                                        <td>{registro.numero}</td>
                                        <td>{registro.centroAcopio}</td>
                                        <td>{registro.cantidadRecibo}</td>
                                        <td>{registro.cantidadRegla}</td>
                                        <td>{registro.diferencia}</td>
                                        <td>{registro.totalLitros}</td>
                                        <td>{registro.compartimento}</td>
                                        <td>{registro.muestraTipo}</td>
                                        <td>{registro.pruebasRealizadas[0]?.color || 'N/A'}</td>
                                        <td>{registro.pruebasRealizadas[0]?.olor || 'N/A'}</td>
                                        <td>{registro.pruebasRealizadas[0]?.sabor || 'N/A'}</td>
                                        <td>{registro.pruebasRealizadas[0]?.alcohol || 'N/A'}</td>
                                        <td>{registro.pruebasRealizadas[0]?.acidez || 'N/A'}</td>
                                        <td>{registro.pruebasRealizadas[0]?.densidad || 'N/A'}</td>
                                        <td>{registro.pruebasRealizadas[0]?.temperatura || 'N/A'}</td>
                                        <td>{registro.pruebasRealizadas[0]?.mastitis || 'N/A'}</td>
                                        <td>{registro.observaciones || 'N/A'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={19} className="text-center">No hay registros disponibles</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </TanqueroLayout>
    );
}
