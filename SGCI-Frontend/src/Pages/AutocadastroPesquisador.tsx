import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Modal, Spinner } from 'react-bootstrap';
import InputMask from 'react-input-mask';
import { useNavigate } from 'react-router-dom';
import { registerService } from '../Service/registerService';
import { getTypeMap } from '../Utils/tipoPesquisadorUtils';
import { FaExclamationTriangle } from 'react-icons/fa';

const AutocadastroPesquisador: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    type: '',
    phone: '',
    email: '',
    document: '',
    institution: '',
    senha: '',
    confirmarSenha: '',
  });

  const [errors, setErrors] = useState({
    name: false,
    lastname: false,
    type: false,
    phone: false,
    email: false,
    document: false,
    institution: false,
    senha: false,
    confirmarSenha: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const typeMap = getTypeMap();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {
      name: formData.name === '',
      lastname: formData.lastname === '',
      type: formData.type === '',
      phone: formData.phone.replace(/[^0-9]/g, '') === '',
      email: formData.email === '',
      document: formData.document.replace(/[^0-9]/g, '') === '',
      institution: formData.institution === '',
      senha: formData.senha === '',
      confirmarSenha: formData.confirmarSenha === '',
    };

    let formIsValid = true;

    if (formData.senha !== formData.confirmarSenha) {
      newErrors.senha = true;
      newErrors.confirmarSenha = true;
      formIsValid = false;
    }

    setErrors(newErrors);
    
    // Check if any error is true
    if (Object.values(newErrors).includes(true)) {
        formIsValid = false;
    }

    return formIsValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const payload = {
          username: formData.email,
          password: formData.senha,
          name: formData.name,
          lastname: formData.lastname,
          phone: formData.phone,
          email: formData.email,
          document: formData.document,
          institution: formData.institution,
          type: typeMap[formData.type as keyof typeof typeMap],
        };

        await registerService.registerPesquisador(payload);
        
        alert("Cadastro realizado com sucesso! Você será redirecionado para a tela de login.");
        navigate('/');
      } catch (error: any) {
        console.error('Erro ao se cadastrar:', error);
        setErrorMessage(error.message);
        setShowErrorModal(true);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <>
      <Container className="mt-5">
        <h3 className="text-center mb-4">Autocadastro de Pesquisador</h3>
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col sm={6}>
              <Form.Group controlId="name">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  isInvalid={errors.name}
                  required
                />
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group controlId="lastname">
                <Form.Label>Sobrenome</Form.Label>
                <Form.Control
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  isInvalid={errors.lastname}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col sm={6}>
              <Form.Group controlId="type">
                <Form.Label>Tipo</Form.Label>
                <Form.Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  isInvalid={errors.type}
                  required
                >
                  <option value="">Selecione o tipo</option>
                  <option value="Aluno">Aluno</option>
                  <option value="Pesquisador">Pesquisador</option>
                  <option value="Funcionário">Funcionário</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group controlId="institution">
                <Form.Label>Instituição</Form.Label>
                <Form.Control
                  type="text"
                  name="institution"
                  value={formData.institution}
                  onChange={handleChange}
                  isInvalid={errors.institution}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col sm={6}>
              <Form.Group controlId="phone">
                <Form.Label>Telefone</Form.Label>
                <InputMask
                  className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                  mask="(99)99999-9999"
                  value={formData.phone}
                  onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)}
                  type="text"
                  name="phone"
                  required
                />
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group controlId="document">
                <Form.Label>CPF</Form.Label>
                <InputMask
                  className={`form-control ${errors.document ? 'is-invalid' : ''}`}
                  mask="999.999.999-99"
                  value={formData.document}
                  onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)}
                  type="text"
                  name="document"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col sm={6}>
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  isInvalid={errors.email}
                  required
                />
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group controlId="username">
                <Form.Label>Usuário</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={formData.email}
                  readOnly
                  disabled
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col sm={6}>
              <Form.Group controlId="senha">
                <Form.Label>Senha</Form.Label>
                <Form.Control
                  type="password"
                  name="senha"
                  value={formData.senha}
                  onChange={handleChange}
                  isInvalid={errors.senha}
                  required
                />
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group controlId="confirmarSenha">
                <Form.Label>Confirmar Senha</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmarSenha"
                  value={formData.confirmarSenha}
                  onChange={handleChange}
                  isInvalid={errors.confirmarSenha}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Button variant="primary" type="submit" className="mt-3" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                <span className="ms-2">Criando Conta...</span>
              </>
            ) : (
              'Criar Conta'
            )}
          </Button>
          <Button
            variant="secondary"
            className="mt-3 ms-2"
            onClick={() => navigate('/')}
            disabled={isSubmitting}
          >
            Voltar
          </Button>
        </Form>
      </Container>

      <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>
            <FaExclamationTriangle className="me-2" />
            Falha no Cadastro
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

export default AutocadastroPesquisador;