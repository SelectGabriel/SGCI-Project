import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Container, Row, Col, Button, Spinner, Modal } from 'react-bootstrap';
import { Pesquisador } from '../../Models/Pesquisador';
import { pesquisadorService } from '../../Service/pesquisadorService';
import { getTypeLabel } from '../../Utils/tipoPesquisadorUtils';
import { FaExclamationTriangle } from 'react-icons/fa';

const RemoverPesquisador: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [pesquisador, setPesquisador] = useState<Pesquisador | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function fetchPesquisador() {
      try {
        setLoading(true);
        if (id) {
            const pesquisadorEncontrado = await pesquisadorService.getPesquisadorById(Number(id));
            setPesquisador(pesquisadorEncontrado);
        } else {
            throw new Error('ID do pesquisador não fornecido.');
        }
      } catch (error: any) {
        console.error("Erro ao carregar dados do pesquisador:", error);
        setErrorMessage(error.message || 'Não foi possível carregar os dados do pesquisador.');
        setShowErrorModal(true);
      } finally {
        setLoading(false);
      }
    }
    fetchPesquisador();
  }, [id]);

  const handleDelete = async () => {
    if (!pesquisador?.id) {
        setErrorMessage("ID do pesquisador não encontrado para realizar a exclusão.");
        setShowErrorModal(true);
        return;
    };

    setIsDeleting(true);
    try {
      await pesquisadorService.removerPesquisadorById(pesquisador.id);
      alert('Pesquisador removido com sucesso!');
      setShowConfirmModal(false);
      navigate('/listar-pesquisador');
    } catch (error: any) {
      console.error('Erro ao remover pesquisador:', error);
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
        <p>Carregando dados do pesquisador...</p>
      </Container>
    );
  }

  return (
    <>
      <Container className="mt-5">
        {pesquisador ? (
            <Card>
                <Card.Header as="h4" className="text-center">
                    Remover Pesquisador
                </Card.Header>
                <Card.Body>
                    <div className="alert alert-warning text-center">
                    <strong>Atenção!</strong> Confirme os dados antes de remover o pesquisador.
                    </div>
                    <Row className="mb-2">
                    <Col xs={12} sm={6}><p><strong>Nome:</strong> {pesquisador.name}</p></Col>
                    <Col xs={12} sm={6}><p><strong>Sobrenome:</strong> {pesquisador.lastname}</p></Col>
                    </Row>
                    <Row className="mb-2">
                    <Col xs={12} sm={6}><p><strong>Tipo:</strong> {getTypeLabel(pesquisador.type)}</p></Col>
                    <Col xs={12} sm={6}><p><strong>Instituição:</strong> {pesquisador.institution}</p></Col>
                    </Row>
                    <Row className="mb-2">
                    <Col xs={12} sm={6}><p><strong>Telefone:</strong> {pesquisador.phone}</p></Col>
                    <Col xs={12} sm={6}><p><strong>Email:</strong> {pesquisador.email}</p></Col>
                    </Row>
                    <Row className="mb-2">
                    <Col xs={12} sm={6}><p><strong>CPF:</strong> {pesquisador.document}</p></Col>
                    </Row>
                </Card.Body>
                <Card.Footer className="d-flex justify-content-between">
                    <Button variant="secondary" onClick={() => navigate('/listar-pesquisador')}>
                    Voltar
                    </Button>
                    <Button variant="danger" onClick={handleShowModal}>
                    Remover Pesquisador
                    </Button>
                </Card.Footer>
            </Card>
        ) : (
            !showErrorModal && (
                <div className="text-center">
                    <h4>Pesquisador não encontrado.</h4>
                    <Button variant="secondary" onClick={() => navigate('/listar-pesquisador')}>
                        Voltar para a lista
                    </Button>
                </div>
            )
        )}
      </Container>
      
      {pesquisador && (
        <Modal show={showConfirmModal} onHide={handleCloseModal} centered>
            <Modal.Header closeButton>
            <Modal.Title>Confirmar Exclusão</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            Você tem certeza que deseja remover o pesquisador <strong>{`${pesquisador.name} ${pesquisador.lastname}`}</strong>?
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
                navigate('/listar-pesquisador');
              }
            }}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default RemoverPesquisador;