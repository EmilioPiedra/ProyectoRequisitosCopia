import { useAuth } from '../auth/AuthProvider';
import TanqueroLayout from '../layout/TanqueroLayout';
import { Outlet } from 'react-router-dom';
import JefePlantaDashboard from './jefePlantaDashboard';
import JefePlantaLayout from '../layout/JefePlantaLayout';


export default function Pruebas() {
    const auth = useAuth();

    return (
        <JefePlantaLayout>
            <h1>Pruebas</h1>
            <div className="container my-5">
                <h2 className="text-center mb-4">Registrar Control de Calidad</h2>
                <div className="row">
                    <div className="col-md-6">
                        <p><strong>Codigo:</strong> RMT.CMP.001</p>
                        <p><strong>Fecha:</strong> ________</p>
                        <p><strong>Hora:</strong> ________</p>
                    </div>
                    <div className="col-md-6 text-end">
                        <p><strong>Proveedor:</strong> ________</p>
                        <p><strong>No. Muestras:</strong> ________</p>
                        <p><strong>Cantidad (L):</strong> ________</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <h5>Parámetros y Resultados</h5>
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Parámetro</th>
                                    <th>Resultado</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td>Organoléptico</td><td>__________</td></tr>
                                <tr><td>Temperatura (°C)</td><td>__________</td></tr>
                                <tr><td>Acidez (13-16%)</td><td>__________</td></tr>
                                <tr><td>Alcohol</td><td>__________</td></tr>
                                <tr><td>pH (6.6-6.8)</td><td>__________</td></tr>
                                <tr><td>Mastitis</td><td>__________</td></tr>
                                <tr><td>Grasa (min. 3%)</td><td>__________</td></tr>
                                <tr><td>Sólidos no grasos (min. 8.2%)</td><td>__________</td></tr>
                                <tr><td>Densidad (1.029 - 1.033)</td><td>__________</td></tr>
                                <tr><td>Proteína (min. 4.4%)</td><td>__________</td></tr>
                                <tr><td>Lactosa (4.4-4.5%)</td><td>__________</td></tr>
                                <tr><td>Sólidos totales (min. 12.6%)</td><td>__________</td></tr>
                                <tr><td>Células somáticas ( menor a 600,000)</td><td>__________</td></tr>
                                <tr><td>Punto de congelación (-0.545 a -0.525)</td><td>__________</td></tr>
                                <tr><td>Agua añadida</td><td>__________</td></tr>
                                <tr><td>Cloruros</td><td>__________</td></tr>
                                <tr><td>Peróxido (0.5 mol/L)</td><td>__________</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="col-md-6">
                        <h5>Antibióticos</h5>
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Antibiótico</th>
                                    <th>Resultado</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td>T</td><td>__________</td></tr>
                                <tr><td>S</td><td>__________</td></tr>
                                <tr><td>β</td><td>__________</td></tr>
                                <tr><td>STR</td><td>__________</td></tr>
                                <tr><td>GM</td><td>__________</td></tr>
                                <tr><td>Neo</td><td>__________</td></tr>
                            </tbody>
                        </table>
                        <p><strong>Analista:</strong> ________</p>
                        <p><strong>Observaciones:</strong></p>
                        <p>__________________________</p>
                        <p>__________________________</p>
                        <p><strong>Supervisor:</strong> _____________</p>
                    </div>
                </div>
                <div className="text-center mt-4">
                    <button className="btn btn-primary">Guardar</button>
                </div>
            </div>
            <Outlet />
        </JefePlantaLayout>
    );
}
