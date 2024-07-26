import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import { createBrowserRouter, RouteObject, RouterProvider } from 'react-router-dom';
import Login from './rutas/Login';
import RutaProtegida from './rutas/RutaProtegita';
import JefePlantaDashboard from './jefePlanta/jefePlantaDashboard';
import TanqueroDashboar from './tanquero/TanqueroDashboard';
import NuevoRegistroTanquero from './tanquero/NuevoRegistroTanquero';
import HistorialRegistroTanquero from './tanquero/HistorialRegistroTanquero';
import EditarRegistroTanquero from './tanquero/EditarRegistroTanquero';
import MateriaPrima from './jefePlanta/MateriaPrima';
import { AuthProvider } from './auth/AuthProvider';
import CodificadorDashboard from './codificador/codificadorDashboard';
import Pruebas from './jefePlanta/Pruebas';


// Definir las rutas utilizando Remix
const routes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <RutaProtegida />,  // Corregido el nombre del componente
    children: [
      {
        path: "/JefePlantadashboard",
        element: <JefePlantaDashboard />
      },
      {
        path: "/MateriaPrima",
        element: <MateriaPrima />
      },
      {
        path: "/Tanquerodashboard",
        element: <TanqueroDashboar />
      },
      {
        path: "/nuevoRegistroTanquero",
        element: <NuevoRegistroTanquero />
      },
      {
        path: "/historialRegistroTanquero",
        element: <HistorialRegistroTanquero />
      },
      {
        path: "/editarRegistroTanquero",
        element: <EditarRegistroTanquero />
      },
      {
        path: "/CodificadorDashboard",
        element: <CodificadorDashboard />
      },
      {
        path: "/Pruebas",
        element: <Pruebas />
      }
    ]
  },
];


const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
);
