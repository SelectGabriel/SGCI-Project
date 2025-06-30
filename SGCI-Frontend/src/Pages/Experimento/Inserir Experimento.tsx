import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import { FaSave } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Pesquisador } from '../../Models/Pesquisador';
import { Participante } from '../../Models/Participante';
import { experimentoService } from '../../Service/experimentoService';
import { pesquisadorService } from '../../Service/pesquisadorService';
import { participanteService } from '../../Service/participanteService';

const InserirExperimento: React.FC = () => {
  const [pesquisadores, setPesquisadores] = useState<Pesquisador[]>([]);
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [dataInicio, setDataInicio] = useState<string>(new Date().toISOString().slice(0, 16));
  const [observacoes, setObservacoes] = useState<string>('');
  const [pesquisadorId, setPesquisadorId] = useState<number | undefined>();
  const [participanteId, setParticipanteId] = useState<number | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const pesquisadorList = await pesquisadorService.fetchPesquisadores();
        const participanteList = await participanteService.fetchParticipantes();
        setPesquisadores(pesquisadorList);
        setParticipantes(participanteList);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pesquisadorId || !participanteId || !observacoes) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        researcherId: pesquisadorId,
        participantId: participanteId,
        experimentStartDate: new Date(dataInicio).toISOString(),
        observations: observacoes,
      };

      console.log('Payload a ser enviado:', payload);
      await experimentoService.inserirExperimento(payload);
      navigate('/listar-experimento');
    } catch (error) {
      console.error('Erro ao inserir experimento:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <h3>Inserir Novo Experimento</h3>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <div>Carregando...</div>
        </div>
      ) : (
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group controlId="formPesquisador">
                <Form.Label>Pesquisador</Form.Label>
                <Form.Control
                  as="select"
                  value={pesquisadorId}
                  onChange={(e) => setPesquisadorId(Number(e.target.value))}
                  required
                >
                  <option value="">Selecione o Pesquisador</option>
                  {pesquisadores.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} {p.lastname}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="formParticipante">
                <Form.Label>Participante</Form.Label>
                <Form.Control
                  as="select"
                  value={participanteId}
                  onChange={(e) => setParticipanteId(Number(e.target.value))}
                  required
                >
                  <option value="">Selecione o Participante</option>
                  {participantes.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} {p.lastname}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={6}>
              <Form.Group controlId="formDataInicio">
                <Form.Label>Data de Início</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={12}>
              <Form.Group controlId="formObservacoes">
                <Form.Label>Observações</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Button type="submit" variant="primary" className="mt-3">
            <FaSave className="me-2" />
            Salvar Experimento
          </Button>
        </Form>
      )}
    </Container>
  );
};

export default InserirExperimento;
