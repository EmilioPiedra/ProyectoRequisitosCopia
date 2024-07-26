import React, { useState } from "react";
import { Icon } from '@iconify/react';
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { API_URL } from "../auth/constants";

export default function CodificadorLayout({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  async function handleSignout(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/signout`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.getRefreshToken()}`,
        },
      });

      if (response.ok) {
        auth.signOut();
      }
    } catch (error) {
      console.error('Error during signout:', error);
    }
  }
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        <Icon icon="bi:justify-left" />
      </button>
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="menu-section">
          <h3>Registros</h3>
          <ul>
            <li>
              <Link to="/nuevoRegistro">
                Nuevo Registro
              </Link>
            </li>
            <li>
              <Link to="/historialRegistro">
                Historial Resgistro
              </Link>
            </li>
            <li>
              <Link to="/editarRegistro">
                Editar Registro
              </Link>
            </li>
          </ul>
        </div>
        <div className="logout-section">
          <a href="#" onClick={handleSignout}>
            <Icon icon="material-symbols:logout" />
            Cerrar sesión
          </a>
        </div>
      </div>
      <div className={`content ${sidebarOpen ? 'shifted' : ''}`}>
        {children}
      </div>
    </>
  );
}