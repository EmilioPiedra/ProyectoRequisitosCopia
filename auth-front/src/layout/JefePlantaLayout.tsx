import React, { useState, useEffect } from "react";
import { Icon } from '@iconify/react';
import { Link } from "react-router-dom";
import logoImage from "../imagenes/ecolac-logo.jpg";
import { useAuth } from "../auth/AuthProvider";
import { API_URL } from "../auth/constants";

interface LayoutProps {
  children: React.ReactNode;
}

export default function JefePlantaLayout({ children }: LayoutProps) {
  const auth = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [scrollingUp, setScrollingUp] = useState(true);


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
      <header>
        <nav
          className="navbar navbar-expand-lg navbar-light fixed-top"
          style={{
            height: '65px',
            backgroundColor: '#ffffff',
            color: '#000000',
            boxShadow: '0 2px 3px rgba(0, 0, 0, 0.5)'
          }}
        >
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            <Icon icon="bi:justify-left" />
          </button>
          <div className="container-fluid d-flex align-items-center">
            <div className="d-flex flex-grow-1 justify-content-center">
              <img
                src={logoImage}
                alt="Logo"
                className="logo"
                style={{
                  width: '175px',
                  height: '50px'
                }}
              />
            </div>
            <div className="d-flex align-items-center ms-auto">
              <Icon icon="bi:bell" style={{ fontSize: '27px', color: '#1C4C99' }} className="me-3" />
              <Icon icon="bi:person-circle" style={{ fontSize: '27px', color: '#1C4C99' }} />
            </div>
          </div>
        </nav>
      </header>

      <div className={`sidebar ${sidebarOpen ? 'open' : ''} ${!scrollingUp ? 'hidden' : ''}`}>
        <div className="menu-section">
          <h3>Registros</h3>
          <ul>
            <li>
              <Link to="/MateriaPrima">
                <Icon icon="bi:file-earmark-text" style={{ fontSize: '20px', color: '#ff0000' }} />
                Materia Prima
              </Link>
            </li>
            <li>
              <Link to="/pruebas">
                <Icon icon="bi:file-earmark-text" style={{ fontSize: '20px', color: '#ff0000' }} />
                Pruebas
              </Link>
            </li>
            <li>
              <Link to="/produccion">
                <Icon icon="bi:file-earmark-text" style={{ fontSize: '20px', color: '#ff0000' }} />
                Codificación
              </Link>
            </li>
            <li>
              <Link to="/almacenamiento">
                <Icon icon="bi:file-earmark-text" style={{ fontSize: '20px', color: '#ff0000' }} />
                Almacenamiento
              </Link>
            </li>
            <li>
              <Link to="/ventas">
                <Icon icon="bi:file-earmark-text" style={{ fontSize: '20px', color: '#ff0000' }} />
                Planificación
              </Link>
            </li>
          </ul>
        </div>
        <div className="menu-section">
          <h3>Trazabilidad</h3>
          <ul>
            <li>
              <Link to="/codigo-de-barras">
                <Icon icon="bi:file-earmark-code" style={{ fontSize: '20px', color: '#ff0000' }} />
                Consultar Trazabilidad
              </Link>
            </li>
            <li>
              <Link to="/reclamos">
                <Icon icon="bi:envelope" style={{ fontSize: '20px', color: '#ff0000' }} />
                Reclamos
              </Link>
            </li>
            <li>
              <Link to="/informes">
                <Icon icon="bi:file-earmark-spreadsheet" style={{ fontSize: '20px', color: '#ff0000' }} />
                Informes
              </Link>
            </li>
          </ul>
        </div>
        <div className="logout-section">
          <a href="#" onClick={handleSignout}>
            <Icon icon="material-symbols:logout" style={{ fontSize: '20px', color: '#ff0000' }} />
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
