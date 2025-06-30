import React, { useEffect, useState } from 'react';
import { Table, InputGroup, Form, Button, Spinner, Card } from 'react-bootstrap';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Pesquisador } from '../../Models/Pesquisador';
import { pesquisadorService } from '../../Service/pesquisadorService';
import { getTypeLabel } from '../../Utils/tipoPesquisadorUtils';

const PainelDePesquisadores: React.FC = () => {
  const [pesquisadores, setPesquisadores] = useState<Pesquisador[]>([]);
  const [filtro, setFiltro] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleViewPesquisador = (id: number) => navigate(`/ver-pesquisador/${id}`);
  const handleEditPesquisador = (id: number) => navigate(`/alterar-pesquisador/${id}`);
  const handleRemovePesquisador = (id: number) => navigate(`/remover-pesquisador/${id}`);

  useEffect(() => {
    async function fetchPesquisadoresData() {
      try {
        setLoading(true);
        const dados = await pesquisadorService.fetchPesquisadores();
        setPesquisadores(dados);
      } catch (error) {
        console.error('Erro ao buscar pesquisadores:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPesquisadoresData();
  }, []);
  
  const pesquisadoresFiltrados = pesquisadores.filter((pesquisador) =>
    `${pesquisador.name} ${pesquisador.lastname}`.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h3 className="mb-0">Painel de Pesquisadores</h3>
        <div style={{ minWidth: '250px' }}>
          <InputGroup>
            <Form.Control
              placeholder="Filtrar por nome..."
              value={filtro}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFiltro(e.target.value)}
            />
          </InputGroup>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Carregando pesquisadores...</p>
        </div>
      ) : (
        // 2. TABELA RESPONSIVA E OTIMIZADA
        <Table striped bordered hover responsive="sm">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Sobrenome</th>
              <th>Tipo</th>
              <th>Instituição</th>
              <th className="text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {pesquisadoresFiltrados.length > 0 ? (
              pesquisadoresFiltrados.map((pesquisador) => (
                <tr key={pesquisador.id}>
                  <td>{pesquisador.name}</td>
                  <td>{pesquisador.lastname}</td>
                  <td>{getTypeLabel(pesquisador.type)}</td>
                  <td>{pesquisador.institution}</td>
                  <td className="text-center">
                    <Button variant="link" title="Visualizar Detalhes" className="text-primary p-1" onClick={() => handleViewPesquisador(pesquisador.id!)}><FaEye size={18}/></Button>
                    <Button variant="link" title="Editar Pesquisador" className="text-warning p-1" onClick={() => handleEditPesquisador(pesquisador.id!)}><FaEdit size={18}/></Button>
                    <Button variant="link" title="Remover Pesquisador" className="text-danger p-1" onClick={() => handleRemovePesquisador(pesquisador.id!)}><FaTrash size={18}/></Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center">Nenhum pesquisador encontrado.</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default PainelDePesquisadores;