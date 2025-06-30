import React, { useEffect, useState } from 'react';
import { Button, Container, Form, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import InputMask from 'react-input-mask';
import { participanteService } from '../../Service/participanteService';

const AlterarParticipante: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: 0,
    name: '',
    lastname: '',
    phone: '',
    email: '',
    document: '',
    observations: '',
    genre: '',
    dateOfBirth: new Date(),
  });

  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchParticipanteData() {
      try {
        setLoading(true);
        const participante = await participanteService.getParticipanteById(Number(id));
        if (participante) {
          setFormData({
            ...participante,
            id: participante.id ?? 0,
            dateOfBirth: new Date(participante.dateOfBirth),
          });
        } else {
          throw new Error('Participante não encontrado');
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchParticipanteData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'dateOfBirth' ? new Date(value) : value,
    }));

    setIsSubmitEnabled(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await participanteService.alterarParticipanteById(Number(id), formData);
      navigate('/listar-participante');
    } catch (error) {
      console.error('Erro ao alterar participante:', error);
    }
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <Container className="mt-5">
      <h3 className="text-center mb-4">Editar Participante</h3>

      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col sm={6}>
            <Form.Group controlId="name">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
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
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={6}>
            <Form.Group controlId="dateOfBirth">
              <Form.Label>Data de Nascimento</Form.Label>
              <Form.Control
                type="date"
                name="dateOfBirth"
                value={
                  formData.dateOfBirth instanceof Date
                    ? formData.dateOfBirth.toISOString().split('T')[0]
                    : ''
                }
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col sm={6}>
            <Form.Group controlId="genre">
              <Form.Label>Gênero</Form.Label>
              <Form.Select name="genre" value={formData.genre} onChange={handleChange} required>
                <option value="">Selecione o gênero</option>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
                <option value="outro">Outro</option>
              </Form.Select>
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
                name="phone"
                value={formData.phone}
                onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)}
                placeholder="(00)00000-0000"
                required
              />
            </Form.Group>
          </Col>

          <Col sm={6}>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={6}>
            <Form.Group controlId="document">
              <Form.Label>CPF</Form.Label>
              <InputMask
                className="form-control"
                mask="999.999.999-99"
                name="document"
                value={formData.document}
                disabled
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3" controlId="observations">
          <Form.Label>Observações (Opcional)</Form.Label>
          <Form.Control
            as="textarea"
            name="observations"
            value={formData.observations}
            onChange={handleChange}
            rows={3}
          />
        </Form.Group>

        <Button variant="secondary" className="me-2" onClick={() => navigate('/listar-participante')}>
          Voltar
        </Button>

        <Button type="submit" variant="primary" disabled={!isSubmitEnabled}>
          Salvar Alterações
        </Button>
      </Form>
    </Container>
  );
};

export default AlterarParticipante;
