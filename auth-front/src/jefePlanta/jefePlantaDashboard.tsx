import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthProvider';
import JefePlantaLayout from '../layout/JefePlantaLayout';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Definir un tipo para las capacidades de los tanques
interface Capacidades {
    '1': number;   // TANQUE 4000L
    '2': number;   // TANQUE 7000L
    '3': number;   // TANQUE 1000L
}

// Capacidades de los tanques en litros
const CAPACIDADES: Capacidades = {
    '1': 4000,   // TANQUE 4000L
    '2': 7000,   // TANQUE 7000L
    '3': 1000    // TANQUE 1000L
};

// Datos estáticos para simular los registros
const STATIC_REGISTROS = [
    { centroAcopio: 'Zamora', totalLitros: 250, reserva: '1' },
    { centroAcopio: 'Zumbi', totalLitros: 1500, reserva: '1' },
    { centroAcopio: 'Encuentros', totalLitros: 1000, reserva: '1' },
    { centroAcopio: 'Zamora', totalLitros: 5000, reserva: '2' },
    { centroAcopio: 'Zumbi', totalLitros: 6000, reserva: '2' },
    { centroAcopio: 'Encuentros', totalLitros: 3000, reserva: '2' },
    { centroAcopio: 'Zamora', totalLitros: 800, reserva: '3' },
    { centroAcopio: 'Zumbi', totalLitros: 900, reserva: '3' },
    { centroAcopio: 'Encuentros', totalLitros: 700, reserva: '3' },
];

export default function JefePlantaDashboard() {
    const auth = useAuth();
    const [registros, setRegistros] = useState(STATIC_REGISTROS);

    // Función para procesar los datos según la reserva y ajustar a la capacidad del tanque
    const processData = (reserva: keyof Capacidades) => {
        const processedData = registros
            .filter(item => item.reserva === reserva.toString())
            .map((item, index) => {
                const capacidad = CAPACIDADES[reserva];
                const scaledValue = item.totalLitros / capacidad;
                return {
                    name: item.centroAcopio,
                    value: scaledValue * 100,
                    fill: COLORS[index % COLORS.length]
                };
            });
        console.log(`Datos procesados para TANQUE ${CAPACIDADES[reserva]}L:`, processedData); // Depuración: ver datos procesados
        return processedData;
    };

    useEffect(() => {
        console.log('Registros estáticos:', registros); // Depuración: ver registros estáticos
    }, [registros]);

    return (
        <JefePlantaLayout>
            <div className="container text-center">
                <h1 className="my-4">Cantidad Insumos</h1>
                <div className="row justify-content-center">
                    <div className="col-md-4 d-flex flex-column align-items-center">
                        <h5>TANQUE 4000L</h5>
                        <PieChart width={250} height={250}>
                            <Pie
                                data={processData('1')}
                                cx={125}
                                cy={125}
                                innerRadius={80}
                                outerRadius={100}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {processData('1').map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </div>
                    <div className="col-md-4 d-flex flex-column align-items-center">
                        <h5>TANQUE 7000L</h5>
                        <PieChart width={250} height={250}>
                            <Pie
                                data={processData('2')}
                                cx={125}
                                cy={125}
                                innerRadius={80}
                                outerRadius={100}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {processData('2').map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </div>
                    <div className="col-md-4 d-flex flex-column align-items-center">
                        <h5>TANQUE 1000L</h5>
                        <PieChart width={250} height={250}>
                            <Pie
                                data={processData('3')}
                                cx={125}
                                cy={125}
                                innerRadius={80}
                                outerRadius={100}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {processData('3').map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </div>
                </div>
                <button className="btn btn-primary mt-4">Iniciar Planificación</button>
            </div>
        </JefePlantaLayout>
    );
}
