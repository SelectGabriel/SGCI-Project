import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Modal,
  Spinner,
} from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { loginService } from '../Service/loginService';

const AtualizarSenha: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (!tokenFromUrl) {
      setErrorMessage('Token não encontrado. O link de recuperação pode estar inválido ou expirado.');
      setShowErrorModal(true);
    }
    setToken(tokenFromUrl);
  }, [searchParams]);

  const handleModalClose = () => {
    setShowErrorModal(false);
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
        setErrorMessage('Token de segurança não encontrado. Não é possível redefinir a senha.');
        setShowErrorModal(true);
        return;
    }

    setIsLoading(true);

    if (!password || !confirmPassword) {
      setErrorMessage('Por favor, preencha os dois campos de senha.');
      setShowErrorModal(true);
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('As senhas não coincidem.');
      setShowErrorModal(true);
      setIsLoading(false);
      return;
    }
    
    if (password.length < 8) {
      setErrorMessage('A senha deve ter no mínimo 8 caracteres.');
      setShowErrorModal(true);
      setIsLoading(false);
      return;
    }

    try {
      await loginService.resetPassword(token, password);
      navigate('/', {
        state: { message: 'Senha redefinida com sucesso! Você já pode fazer o login.' },
      });

    } catch (error: any) {
      const apiError = error.response?.data || 'Ocorreu um erro ao redefinir sua senha.';
      setErrorMessage(apiError);
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  return (
    <>
      <Container className="mt-5">
        <Row className="justify-content-md-center">
          <Col md={6}>
            <Card>
              <Card.Body>
                <Card.Title className="text-center mb-4">
                  Redefinir Senha
                </Card.Title>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formNewPassword">
                    <Form.Label>Nova Senha</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Digite sua nova senha"
                      value={password}
                      onChange={handlePasswordChange}
                      disabled={!token || isLoading}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="formConfirmPassword">
                    <Form.Label>Confirmar Nova Senha</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Confirme sua nova senha"
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      disabled={!token || isLoading}
                    />
                  </Form.Group>

                  <div className="d-grid">
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={isLoading || !token}
                    >
                      {isLoading ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />
                          <span className="ms-2">Redefinindo...</span>
                        </>
                      ) : (
                        'Redefinir Senha'
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Modal show={showErrorModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Erro</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errorMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AtualizarSenha;