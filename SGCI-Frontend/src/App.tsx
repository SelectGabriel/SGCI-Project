import './Utils/axiosConfig';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Login from './Pages/Login';
import ListarPesquisador from './Pages/Pesquisador/Listar Pesquisador';
import VerPesquisador from './Pages/Pesquisador/Ver Pesquisador';
import AlterarPesquisador from './Pages/Pesquisador/Alterar Pesquisador';
import RemoverPesquisador from './Pages/Pesquisador/Remover Pesquisador';
import ListarParticipante from './Pages/Participante/Listar Participante';
import InserirParticipante from './Pages/Participante/Inserir Participante';
import VerParticipante from './Pages/Participante/Ver Participante';
import AlterarParticipante from './Pages/Participante/Alterar Participante';
import RemoverParticipante from './Pages/Participante/Remover Participante';
import ListarExperimentos from './Pages/Experimento/Listar Experimento';
import InserirExperimento from './Pages/Experimento/Inserir Experimento';
import AlterarExperimento from './Pages/Experimento/Alterar Experimento';
import RemoverExperimento from './Pages/Experimento/Remover Experimento';
import RecuperarSenha from './Pages/Recuperar Senha';
import RelatorioExperimento from './Pages/Experimento/Relatorio Experimento';
import EditarCaminhada from './Pages/Experimento/Editar Caminhada';
import AutocadastroPesquisador from './Pages/AutocadastroPesquisador';
import PrivateRoute from './Routes/PrivateRoute';
import Sobre from './Pages/Sobre';
import AtualizarSenha from './Pages/Atualizar Senha';

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

const AppContent: React.FC = () => {
  const location = useLocation();

  const hideNavbar = ['/', '/autocadastro-pesquisador', '/recuperar-senha', '/alterar-senha'].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>

        {/*Páginas Públicas*/}
        <Route path="/" element={<Login />} />
        <Route path="/autocadastro-pesquisador" element={<AutocadastroPesquisador />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        <Route path="/alterar-senha" element={<AtualizarSenha />} />

        {/*Páginas privadas*/}
        <Route path="/sobre" element={<PrivateRoute><Sobre /></PrivateRoute>} />

        <Route path="/listar-pesquisador" element={<PrivateRoute><ListarPesquisador /></PrivateRoute>} />
        <Route path="/ver-pesquisador/:id" element={<PrivateRoute><VerPesquisador /></PrivateRoute>} />
        <Route path="/alterar-pesquisador/:id" element={<PrivateRoute><AlterarPesquisador /></PrivateRoute>} />
        <Route path="/remover-pesquisador/:id" element={<PrivateRoute><RemoverPesquisador /></PrivateRoute>} />

        <Route path="/listar-participante" element={<PrivateRoute><ListarParticipante /></PrivateRoute>} />
        <Route path="/inserir-participante" element={<PrivateRoute><InserirParticipante /></PrivateRoute>} />
        <Route path="/ver-participante/:id" element={<PrivateRoute><VerParticipante /></PrivateRoute>} />
        <Route path="/alterar-participante/:id" element={<PrivateRoute><AlterarParticipante /></PrivateRoute>} />
        <Route path="/remover-participante/:id" element={<PrivateRoute><RemoverParticipante /></PrivateRoute>} />

        <Route path="/listar-experimento" element={<PrivateRoute><ListarExperimentos /></PrivateRoute>} />
        <Route path="/inserir-experimento" element={<PrivateRoute><InserirExperimento /></PrivateRoute>} />
        <Route path="/editar-caminhada/:id" element={<PrivateRoute><EditarCaminhada /></PrivateRoute>} />
        <Route path="/alterar-experimento/:id" element={<PrivateRoute><AlterarExperimento /></PrivateRoute>} />
        <Route path="/remover-experimento/:id" element={<PrivateRoute><RemoverExperimento /></PrivateRoute>} />
        <Route path="/relatorio-experimento/:id" element={<PrivateRoute><RelatorioExperimento /></PrivateRoute>} />

      </Routes>
    </>
  );
};

export default App;
