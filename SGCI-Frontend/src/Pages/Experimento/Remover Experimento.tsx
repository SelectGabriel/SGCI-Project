import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Container, Row, Col, Button, Spinner, Modal } from 'react-bootstrap';
import { FaExclamationTriangle } from 'react-icons/fa';
import { Experimento } from '../../Models/Experimento';
import { experimentoService } from '../../Service/experimentoService';

const RemoverExperimento: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [experimento, setExperimento] = useState<Experimento | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const experimentoEncontrado = await experimentoService.getExperimentoById(Number(id));
        setExperimento(experimentoEncontrado);
      } catch (error: any) {
        console.error('Erro ao carregar dados:', error);
        setErrorMessage(error.message || 'Não foi possível carregar os dados do experimento.');
        setShowErrorModal(true);
        setExperimento(null);
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      fetchData();
    } else {
      navigate('/listar-experimento');
    }
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!experimento?.id) {
        setErrorMessage("ID do experimento não encontrado para realizar a exclusão.");
        setShowErrorModal(true);
        return;
    };

    setIsDeleting(true);
    try {
      await experimentoService.removerExperimentoById(experimento.id);
      
      alert('Experimento removido com sucesso.');
      setShowConfirmModal(false);
      navigate('/listar-experimento');
    } catch (error: any) {
      console.error('Erro ao remover experimento:', error);
      setShowConfirmModal(false);
      setErrorMessage(error.message);
      setShowErrorModal(true);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShowModal = () => setShowConfirmModal(true);
  const handleCloseModal = () => setShowConfirmModal(false);

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p>Carregando...</p>
      </Container>
    );
  }

  return (
    <>
      <Container className="mt-5">
        {experimento ? (
          <Card>
            <Card.Header as="h4" className="text-center">
              Remover Experimento
            </Card.Header>
            <Card.Body>
              <div className="alert alert-warning text-center">
                <strong>Atenção!</strong> Você está prestes a remover os dados abaixo.
              </div>
              <Row className="mb-2">
                <Col xs={12} sm={6}><p><strong>ID:</strong> {experimento.id}</p></Col>
                <Col xs={12} sm={6}><p><strong>Pesquisador:</strong> {`${experimento.researcher?.name} ${experimento.researcher?.lastname}`}</p></Col>
              </Row>
              <Row className="mb-2">
                <Col xs={12} sm={6}><p><strong>Participante:</strong> {`${experimento.participant?.name} ${experimento.participant?.lastname}`}</p></Col>
                <Col xs={12} sm={6}><p><strong>Data de Início:</strong> {new Date(experimento.experimentStartDate).toLocaleDateString()}</p></Col>
              </Row>
              <Row className="mb-2">
                <Col xs={12}><p><strong>Status:</strong> {experimento.status}</p></Col>
              </Row>
              <Row>
                <Col xs={12}><p><strong>Observações:</strong> {experimento.observations || 'Sem observações'}</p></Col>
              </Row>
            </Card.Body>

            <Card.Footer className="d-flex justify-content-between">
              <Button variant="secondary" onClick={() => navigate('/listar-experimento')}>
                Voltar
              </Button>
              <Button variant="danger" onClick={handleShowModal}>
                Remover Experimento
              </Button>
            </Card.Footer>
          </Card>
        ) : (
          !showErrorModal && (
            <div className="text-center">
              <h4>Erro: Experimento não encontrado.</h4>
              <Button variant="secondary" onClick={() => navigate('/listar-experimento')}>
                Voltar para a lista
              </Button>
            </div>
          )
        )}
      </Container>

      {experimento && (
        <Modal show={showConfirmModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirmar Exclusão</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Você tem certeza que deseja remover este experimento?
            <br/>
            <strong>Esta ação não pode ser desfeita.</strong>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal} disabled={isDeleting}>
              Voltar
            </Button>
            <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? (<><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/><span className="ms-2">Removendo...</span></>) : ('Remover')}
            </Button>
          </Modal.Footer>
        </Modal>
      )}

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
                navigate('/listar-experimento');
              }
            }}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default RemoverExperimento;