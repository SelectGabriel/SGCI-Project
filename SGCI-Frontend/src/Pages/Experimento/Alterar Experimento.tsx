import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Spinner, Modal } from 'react-bootstrap';
import { FaSave, FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { Pesquisador } from '../../Models/Pesquisador';
import { Participante } from '../../Models/Participante';
import { Experimento } from '../../Models/Experimento';
import { experimentoService } from '../../Service/experimentoService';
import { pesquisadorService } from '../../Service/pesquisadorService';
import { participanteService } from '../../Service/participanteService';

const AlterarExperimento: React.FC = () => {
  const [pesquisadores, setPesquisadores] = useState<Pesquisador[]>([]);
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [observacoes, setObservacoes] = useState<string>('');
  const [pesquisadorId, setPesquisadorId] = useState<number | undefined>();
  const [participanteId, setParticipanteId] = useState<number | undefined>();
  const [dataInicio, setDataInicio] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [experimento, setExperimento] = useState<Experimento | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();

  // Estados para controlar o modal de erro
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [pesquisadorList, participanteList] = await Promise.all([
          pesquisadorService.fetchPesquisadores(),
          participanteService.fetchParticipantes(),
        ]);
        setPesquisadores(pesquisadorList);
        setParticipantes(participanteList);

        if (id) {
          const experimentoData = await experimentoService.getExperimentoById(Number(id));
          setExperimento(experimentoData);
          setPesquisadorId(experimentoData.researcher?.id);
          setParticipanteId(experimentoData.participant?.id);
          setObservacoes(experimentoData.observations || '');
          setDataInicio(experimentoData.experimentStartDate?.slice(0, 16));
        }
      } catch (error: any) {
        console.error('Erro ao carregar dados:', error);
        // Exibe o modal se houver erro ao carregar os dados iniciais
        setErrorMessage(error.message || 'Não foi possível carregar os dados do experimento.');
        setShowErrorModal(true);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!experimento || !pesquisadorId || !participanteId || !observacoes) {
        alert('Por favor, preencha todos os campos.');
        return;
    }
    
    const hasChanges =
        experimento.researcher?.id !== pesquisadorId ||
        experimento.participant?.id !== participanteId ||
        experimento.observations !== observacoes;

    if (!hasChanges) {
        alert('Nenhuma alteração detectada.');
        return;
    }

    try {
        setLoading(true);

        const experimentDataPayload: Experimento = {
            id: experimento.id!,
            researcherId: pesquisadorId,
            participantId: participanteId,
            experimentStartDate: experimento.experimentStartDate,
            observations: observacoes,
            status: experimento.status,
        };

        await experimentoService.alterarExperimento(experimentDataPayload);
        
        alert('Experimento alterado com sucesso!');
        navigate('/listar-experimento');
    } catch (error: any) {
        console.error('Erro ao salvar alterações:', error);
        setErrorMessage(error.message); 
        setShowErrorModal(true);      
    } finally {
        setLoading(false);
    }
  };

  const hasChanges = experimento
    ? experimento.researcher?.id !== pesquisadorId ||
      experimento.participant?.id !== participanteId ||
      experimento.observations !== observacoes
    : false;

  return (
    <>
      <Container className="mt-4">
        <h3>Editar Experimento</h3>

        {loading && (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Carregando...</p>
          </div>
        )}

        {!loading && experimento && (
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group controlId="formId">
                  <Form.Label>ID do Experimento</Form.Label>
                  <Form.Control type="text" value={experimento.id} disabled />
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group controlId="formPesquisador">
                  <Form.Label>Pesquisador</Form.Label>
                  <Form.Select
                    value={pesquisadorId}
                    onChange={(e) => setPesquisadorId(Number(e.target.value))}
                    required
                  >
                    <option value="">Selecione o Pesquisador</option>
                    {pesquisadores.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} {p.lastname}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group controlId="formParticipante">
                  <Form.Label>Participante</Form.Label>
                  <Form.Select
                    value={participanteId}
                    onChange={(e) => setParticipanteId(Number(e.target.value))}
                    required
                  >
                    <option value="">Selecione o Participante</option>
                    {participantes.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} {p.lastname}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group controlId="formDataInicio">
                  <Form.Label>Data de Início</Form.Label>
                  <Form.Control type="datetime-local" value={dataInicio} disabled />
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

            <Row className="mt-4">
              <Col>
                <Button type="submit" variant="primary" disabled={!hasChanges || loading}>
                  <FaSave className="me-2" />
                  Salvar Alterações
                </Button>
                <Button variant="secondary" className="ms-2" onClick={() => navigate('/listar-experimento')}>
                  Voltar
                </Button>
              </Col>
            </Row>
          </Form>
        )}
        
        {!loading && !experimento && (
            <div className="text-center py-5">
                <h4>Experimento não encontrado.</h4>
                <Button variant="secondary" onClick={() => navigate('/listar-experimento')}>
                    Voltar para a lista
                </Button>
            </div>
        )}
      </Container>
      
      {/* Modal de Erro */}
      <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>
            <FaExclamationTriangle className="me-2" />
            Ocorreu um Erro
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorMessage}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowErrorModal(false)}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AlterarExperimento;