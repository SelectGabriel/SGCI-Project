import React, { useEffect, useState } from 'react';
import { Button, Container, Form, Row, Col, Spinner, Modal } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import InputMask from 'react-input-mask';
import { Pesquisador } from '../../Models/Pesquisador';
import { pesquisadorService } from '../../Service/pesquisadorService';
import { authService } from '../../Service/authService';
import { getTypeMap } from '../../Utils/tipoPesquisadorUtils';
import { FaUserShield, FaExclamationTriangle, FaSave } from 'react-icons/fa';

const AlterarPesquisador: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const typeMap = getTypeMap();

  const [formData, setFormData] = useState<Pesquisador | null>(null);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCurrentUserAdmin, setIsCurrentUserAdmin] = useState(false);
  
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function fetchPesquisadorData() {
      try {
        setLoading(true);

        const currentUser = authService.getUserInfo();
        setIsCurrentUserAdmin(currentUser?.isAdmin ?? false);
        
        if (id) {
            const pesquisadorEncontrado = await pesquisadorService.getPesquisadorById(Number(id));
            setFormData(pesquisadorEncontrado);
        } else {
            throw new Error('ID do pesquisador não fornecido.');
        }
      } catch (error: any) {
        console.error("Erro ao carregar dados:", error);
        setErrorMessage(error.message || 'Não foi possível carregar os dados do pesquisador.');
        setShowErrorModal(true);
      } finally {
        setLoading(false);
      }
    }

    fetchPesquisadorData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
    setIsSubmitEnabled(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setIsSubmitting(true);
    try {
      await pesquisadorService.alterarPesquisadorById(Number(id), formData);
      alert('Alterações salvas com sucesso!');
      navigate('/listar-pesquisador');
    } catch (error: any) {
      console.error('Erro ao alterar pesquisador:', error);
      setErrorMessage(error.message);
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePromote = async () => {
    if (!formData) return;
    
    const confirmPromotion = window.confirm(
      `Você tem certeza que deseja promover ${formData.name} ${formData.lastname} a administrador? Esta ação dará a ele(a) permissões totais no sistema.`
    );

    if (confirmPromotion) {
      setIsSubmitting(true);
      try {
        await pesquisadorService.promoteToAdmin(Number(id));
        alert('Usuário promovido a administrador com sucesso!');
        setFormData(prev => (prev ? { ...prev, isAdmin: true } : null));
      } catch (error: any) {
        console.error('Erro ao promover usuário:', error);
        setErrorMessage(error.message);
        setShowErrorModal(true);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (loading) {
    return (
        <Container className="mt-5 text-center">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Carregando...</p>
        </Container>
    );
  }

  return (
    <>
        <Container className="mt-5">
            <h3 className="text-center mb-4">Edição de Pesquisador</h3>
            {!formData ? (
                 <div className="text-center">
                    <h4>Pesquisador não encontrado.</h4>
                    <Button variant="secondary" onClick={() => navigate('/listar-pesquisador')}>
                        Voltar para a lista
                    </Button>
                </div>
            ) : (
                <Form onSubmit={handleSubmit}>
                    <input type="hidden" name="id" value={formData.id} />

                    <Row className="mb-3">
                    <Col sm={6}>
                        <Form.Group controlId="name">
                        <Form.Label>Nome</Form.Label>
                        <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group controlId="lastname">
                        <Form.Label>Sobrenome</Form.Label>
                        <Form.Control type="text" name="lastname" value={formData.lastname} onChange={handleChange} required />
                        </Form.Group>
                    </Col>
                    </Row>

                    <Row className="mb-3">
                    <Col sm={6}>
                        <Form.Group controlId="type">
                        <Form.Label>Tipo</Form.Label>
                        <Form.Select name="type" value={formData.type} onChange={handleChange} required>
                            <option value="">Selecione o tipo</option>
                            {Object.entries(typeMap).map(([pt, en]) => (
                            <option key={en} value={en}>{pt}</option>
                            ))}
                        </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group controlId="institution">
                        <Form.Label>Instituição</Form.Label>
                        <Form.Control type="text" name="institution" value={formData.institution} onChange={handleChange} required />
                        </Form.Group>
                    </Col>
                    </Row>

                    <Row className="mb-3">
                    <Col sm={6}>
                        <Form.Group controlId="phone">
                        <Form.Label>Telefone</Form.Label>
                        <InputMask
                            className="form-control"
                            mask="(99)99999-9999"
                            value={formData.phone}
                            onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)}
                            type="text" name="phone" placeholder="(00)00000-0000" required />
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group controlId="document">
                        <Form.Label>CPF</Form.Label>
                        <InputMask
                            className="form-control"
                            mask="999.999.999-99"
                            value={formData.document}
                            onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)}
                            type="text" name="document" placeholder="000.000.000-00" required />
                        </Form.Group>
                    </Col>
                    </Row>

                    <Row className="mb-3">
                    <Col sm={6}>
                        <Form.Group controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} disabled />
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group controlId="username">
                        <Form.Label>Usuário</Form.Label>
                        <Form.Control type="text" name="username" value={formData.email} readOnly />
                        </Form.Group>
                    </Col>
                    </Row>

                    <div className="mt-4">
                    {(
                        <Button 
                        variant="success" 
                        className="mb-4 me-2" 
                        onClick={handlePromote}
                        disabled={formData.isAdmin || isSubmitting}
                        >
                        <FaUserShield className="me-2" />
                        {isSubmitting && '...'}
                        {!isSubmitting && (formData.isAdmin ? 'Já é Administrador' : 'Promover a Administrador')}
                        </Button>
                    )}
                    
                    <Button variant="secondary" className="me-2 mb-4" onClick={() => navigate('/listar-pesquisador')} disabled={isSubmitting}>
                        Voltar
                    </Button>

                    <Button type="submit" variant="primary" className="mb-4" disabled={!isSubmitEnabled || isSubmitting}>
                        {isSubmitting ? (
                            <><Spinner size="sm" as="span" animation="border" className="me-2"/> Salvando...</>
                        ) : (
                            <><FaSave className="me-2" /> Salvar Alterações</>
                        )}
                    </Button>
                    </div>
                </Form>
            )}
        </Container>

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

export default AlterarPesquisador;