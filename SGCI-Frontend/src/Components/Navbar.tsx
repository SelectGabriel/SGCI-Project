import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Nav, NavDropdown } from 'react-bootstrap';
import { FaUserCircle } from 'react-icons/fa';
import logo from '../Shared/logo.png';
import { perfilService } from '../Service/perfilService';
import { authService } from '../Service/authService';

const Navbar: React.FC = () => {
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [isAdminUser, setIsAdminUser] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const subscription = perfilService.isAdminMode$.subscribe(setIsAdminMode);
    const userInfo = authService.getUserInfo();
    setIsAdminUser(userInfo?.isAdmin ?? false);
    setUserName(userInfo?.name ?? null);
    return () => subscription.unsubscribe();
  }, []);

  const toggleAdminMode = () => {
    perfilService.toggleAdminMode();
    window.location.reload(); 
  };

  const handleLogout = () => {
    authService.clearAuthData();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container">
        <NavLink className="navbar-brand d-flex align-items-center" to="/listar-experimento">
          <img src={logo} alt="Logo" width="50" height="40" className="d-inline-block align-top me-2"/>
          <span style={{ fontWeight: 500 }}>SGCI</span>
        </NavLink>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/listar-experimento">Experimento</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/listar-pesquisador">Pesquisador</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/listar-participante">Participante</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/sobre">Sobre nós</NavLink>
            </li>
          </ul>

          <Nav>
            {userName && (
              <NavDropdown 
                title={
                  <>
                    <FaUserCircle className="me-2" /> 
                    Olá, {userName}
                  </>
                } 
                id="user-menu-dropdown"
                align="end"
              >
                {isAdminUser && (
                  <NavDropdown.Item onClick={toggleAdminMode}>
                    Mudar para {isAdminMode ? 'Perfil Pesquisador' : 'Perfil Administrador'}
                  </NavDropdown.Item>
                )}
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout} className="text-danger">
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;