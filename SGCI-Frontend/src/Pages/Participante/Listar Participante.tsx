import React, { useEffect, useState } from 'react';
import { Table, InputGroup, Form, Button, Spinner, Card } from 'react-bootstrap';
import { FaPlus, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Participante } from '../../Models/Participante';
import { participanteService } from '../../Service/participanteService';

const PainelDeParticipantes: React.FC = () => {
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [filtro, setFiltro] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleViewParticipante = (id: number) => navigate(`/ver-participante/${id}`);
  const handleNewParticipante = () => navigate("/inserir-participante");
  const handleEditParticipante = (id: number) => navigate(`/alterar-participante/${id}`);
  const handleRemoveParticipante = (id: number) => navigate(`/remover-participante/${id}`);

  useEffect(() => {
    async function fetchParticipantesData() {
      try {
        setLoading(true);
        const dados = await participanteService.fetchParticipantes();
        setParticipantes(dados);
      } catch (error) {
        console.error("Erro ao buscar participantes:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchParticipantesData();
  }, []);

  const participantesFiltrados = participantes.filter((participante) =>
    `${participante.name} ${participante.lastname}`.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="container mt-4">
      {/* 1. CABEÇALHO MODERNIZADO */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h3 className="mb-0">Painel de Participantes</h3>
        <Button variant="primary" className="d-flex align-items-center" onClick={handleNewParticipante}>
          <FaPlus className="me-2" /> Adicionar Participante
        </Button>
      </div>
      
      <div className="mb-3">
        <InputGroup>
          <Form.Control
            placeholder="Filtrar por nome ou sobrenome..."
            value={filtro}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFiltro(e.target.value)}
          />
        </InputGroup>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Carregando participantes...</p>
        </div>
      ) : (
        // 2. TABELA RESPONSIVA
        <Table striped bordered hover responsive="sm">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Sobrenome</th>
              <th>Email</th>
              <th>Observações</th>
              <th className="text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {participantesFiltrados.length > 0 ? (
              participantesFiltrados.map((participante) => (
                <tr key={participante.id}>
                  <td>{participante.name}</td>
                  <td>{participante.lastname}</td>
                  <td>{participante.email}</td>
                  <td>{participante.observations || 'N/A'}</td>
                  <td className="text-center">
                    <Button variant="link" title="Visualizar Detalhes" className="text-primary p-1" onClick={() => handleViewParticipante(participante.id!)}><FaEye size={18} /></Button>
                    <Button variant="link" title="Editar Participante" className="text-warning p-1" onClick={() => handleEditParticipante(participante.id!)}><FaEdit size={18} /></Button>
                    <Button variant="link" title="Remover Participante" className="text-danger p-1" onClick={() => handleRemoveParticipante(participante.id!)}><FaTrash size={18} /></Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center">Nenhum participante encontrado.</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default PainelDeParticipantes;