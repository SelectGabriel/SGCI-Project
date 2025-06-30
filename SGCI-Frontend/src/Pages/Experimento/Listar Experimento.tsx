import React, { useEffect, useState } from 'react';
import { Table, InputGroup, Form, Button, Spinner, Card } from 'react-bootstrap';
import { FaPlus, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Experimento } from '../../Models/Experimento';
import { experimentoService } from '../../Service/experimentoService';

const PainelDeExperimentos: React.FC = () => {
  const [experimentos, setExperimentos] = useState<Experimento[]>([]);
  const [filtro, setFiltro] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleViewExperimento = (id: number) => navigate(`/relatorio-experimento/${id}`);
  const handleNewExperimento = () => navigate('/inserir-experimento');
  const handleEditExperimento = (id: number) => navigate(`/alterar-experimento/${id}`);
  const handleRemoveExperimento = (id: number) => navigate(`/remover-experimento/${id}`);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const dadosExperimentos = await experimentoService.fetchExperimentos();
        setExperimentos(dadosExperimentos);
      } catch (error) {
        console.error('Erro ao buscar experimentos:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const experimentosFiltrados = experimentos.filter((experimento) => {
    const textoFiltro = filtro.toLowerCase();
  
    const nomePesquisador = `${experimento.researcher?.name || ''} ${experimento.researcher?.lastname || ''}`.toLowerCase();
    const nomeParticipante = `${experimento.participant?.name || ''} ${experimento.participant?.lastname || ''}`.toLowerCase();
    const status = experimento.status?.toLowerCase() || '';
  
    return (
      nomePesquisador.includes(textoFiltro) ||
      nomeParticipante.includes(textoFiltro) ||
      status.includes(textoFiltro)
    );
  });  

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
        {/* 1. TÍTULO MELHORADO */}
        <h3 className="mb-0">Painel de Experimentos</h3>
        <Button variant="primary" className="d-flex align-items-center" onClick={handleNewExperimento}>
          <FaPlus className="me-2" /> Adicionar Experimento
        </Button>
      </div>
      
      <div className="mb-3">
        <InputGroup>
          <Form.Control
            placeholder="Filtrar por pesquisador, participante ou status..."
            value={filtro}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFiltro(e.target.value)}
          />
        </InputGroup>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Carregando experimentos...</p>
        </div>
      ) : (
        // 2. TABELA RESPONSIVA
        <Table striped bordered hover responsive="sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Pesquisador</th>
              <th>Participante</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {experimentosFiltrados.length > 0 ? (
              experimentosFiltrados.map((experimento) => (
                <tr key={experimento.id}>
                  <td>{experimento.id}</td>
                  <td>{experimento.researcher ? `${experimento.researcher.name} ${experimento.researcher.lastname}` : 'N/A'}</td>
                  <td>{experimento.participant ? `${experimento.participant.name} ${experimento.participant.lastname}` : 'N/A'}</td>
                  <td>{experimento.status}</td>
                  <td className="text-center">
                    <Button variant="link" title="Visualizar Relatório" className="text-primary p-1" onClick={() => handleViewExperimento(experimento.id!)}><FaEye size={18} /></Button>
                    <Button variant="link" title="Editar Experimento" className="text-warning p-1" onClick={() => handleEditExperimento(experimento.id!)}><FaEdit size={18} /></Button>
                    <Button variant="link" title="Remover Experimento" className="text-danger p-1" onClick={() => handleRemoveExperimento(experimento.id!)}><FaTrash size={18} /></Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center">Nenhum experimento encontrado.</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default PainelDeExperimentos;