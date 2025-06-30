import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Container, Row, Col, Button, Spinner, Modal } from 'react-bootstrap';
import { Participante } from '../../Models/Participante';
import { participanteService } from '../../Service/participanteService';
import { FaExclamationTriangle } from 'react-icons/fa';

const RemoverParticipante: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [participante, setParticipante] = useState<Participante | null>(null);
  const [loading, setLoading] = useState(true);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function fetchParticipante() {
      try {
        setLoading(true);
        const participanteEncontrado = await participanteService.getParticipanteById(Number(id));
        setParticipante({
          ...participanteEncontrado,
          dateOfBirth: new Date(participanteEncontrado.dateOfBirth),
        });
      } catch (error: any) {
        console.error('Erro ao carregar dados do participante:', error);
        setErrorMessage(error.message || 'Não foi possível carregar os dados do participante.');
        setShowErrorModal(true);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
        fetchParticipante();
    } else {
        navigate('/listar-participante');
    }
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!participante?.id) {
        setErrorMessage("ID do participante não encontrado para realizar a exclusão.");
        setShowErrorModal(true);
        return;
    };

    setIsDeleting(true);
    try {
      await participanteService.removerParticipanteById(participante.id);
      alert('Participante removido com sucesso!');
      setShowConfirmModal(false);
      navigate('/listar-participante');
    } catch (error: any) {
      console.error('Erro ao remover participante:', error);
      setShowConfirmModal(false);
      setErrorMessage(error.message);
      setShowErrorModal(true);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShowModal = () => setShowConfirmModal(true);
  const handleCloseModal = () => setShowConfirmModal(false);

  const formatarData = (data: Date) => {
    if (isNaN(data.getTime())) {
        return 'Data inválida';
    }
    return data.toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p>Carregando dados do participante...</p>
      </Container>
    );
  }

  return (
    <>
      <Container className="mt-5">
        {participante ? (
            <Card>
                <Card.Header as="h4" className="text-center">
                    Remover Participante
                </Card.Header>
                <Card.Body>
                    <div className="alert alert-warning text-center">
                    <strong>Atenção!</strong> Você está prestes a remover permanentemente os dados abaixo.
                    </div>
                    <Row className="mb-2">
                    <Col xs={12} sm={6}><p><strong>Nome:</strong> {participante.name}</p></Col>
                    <Col xs={12} sm={6}><p><strong>Sobrenome:</strong> {participante.lastname}</p></Col>
                    </Row>
                    <Row className="mb-2">
                    <Col xs={12} sm={6}><p><strong>Gênero:</strong> {participante.genre}</p></Col>
                    <Col xs={12} sm={6}><p><strong>Data de Nascimento:</strong> {formatarData(participante.dateOfBirth)}</p></Col>
                    </Row>
                    <Row className="mb-2">
                    <Col xs={12} sm={6}><p><strong>Telefone:</strong> {participante.phone}</p></Col>
                    <Col xs={12} sm={6}><p><strong>Email:</strong> {participante.email}</p></Col>
                    </Row>
                    <Row className="mb-2">
                    <Col xs={12} sm={6}><p><strong>CPF:</strong> {participante.document}</p></Col>
                    </Row>
                    <Row>
                    <Col><p><strong>Observações:</strong> {participante.observations || "Nenhuma"}</p></Col>
                    </Row>
                </Card.Body>

                <Card.Footer className="d-flex justify-content-between">
                    <Button variant="secondary" onClick={() => navigate('/listar-participante')}>
                    Voltar
                    </Button>
                    <Button variant="danger" onClick={handleShowModal}>
                    Remover Participante
                    </Button>
                </Card.Footer>
            </Card>
        ) : (
            !showErrorModal && (
                <div className="text-center">
                    <h4>Participante não encontrado.</h4>
                    <Button variant="secondary" onClick={() => navigate('/listar-participante')}>
                        Voltar para a lista
                    </Button>
                </div>
            )
        )}
      </Container>

      {participante && (
        <Modal show={showConfirmModal} onHide={handleCloseModal} centered>
            <Modal.Header closeButton>
            <Modal.Title>Confirmar Exclusão</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            Você tem certeza que deseja remover o participante <strong>{`${participante.name} ${participante.lastname}`}</strong>?
            <br />
            Esta ação não pode ser desfeita.
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal} disabled={isDeleting}>
                Voltar
            </Button>
            <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? (
                <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/>
                    <span className="ms-2">Removendo...</span>
                </>
                ) : (
                'Remover'
                )}
            </Button>
            </Modal.Footer>
        </Modal>
      )}

      {/*Modalde Erro*/}
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
          <Button variant="secondary" onClick={() => {
              setShowErrorModal(false);
              if (errorMessage.includes("não encontrado")) {
                navigate('/listar-participante');
              }
            }}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default RemoverParticipante;