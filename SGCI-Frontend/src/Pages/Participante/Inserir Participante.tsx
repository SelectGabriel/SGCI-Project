import React, { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import InputMask from 'react-input-mask';
import { useNavigate } from 'react-router-dom';
import { participanteService } from '../../Service/participanteService';

const InserirParticipante: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    phone: '',
    email: '',
    document: '',
    observations: '',
    genre: '',
    dateOfBirth: '',
  });

  const [errors, setErrors] = useState({
    name: false,
    lastname: false,
    phone: false,
    email: false,
    document: false,
    genre: false,
    dateOfBirth: false,
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {
      name: formData.name === '',
      lastname: formData.lastname === '',
      phone: formData.phone === '',
      email: formData.email === '',
      document: formData.document === '',
      genre: formData.genre === '',
      dateOfBirth: formData.dateOfBirth === '',
    };
    setErrors(newErrors);
    return !Object.values(newErrors).includes(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const participante = {
          ...formData,
          dateOfBirth: new Date(formData.dateOfBirth),
        };

        await participanteService.inserirParticipante(participante);
        console.log('Participante cadastrado com sucesso:', participante);
        navigate('/listar-participante');
      } catch (error) {
        console.error('Erro ao cadastrar participante:', error);
      }
    }
  };

  return (
    <Container className="mt-5">
      <h3 className="text-center mb-4">Cadastrar Participante</h3>
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
                isInvalid={errors.name}
                placeholder="Digite o nome"
                required
              />
              {errors.name && <Form.Text className="text-danger">Nome é obrigatório.</Form.Text>}
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
                placeholder="Digite o sobrenome"
                required
              />
              {errors.lastname && <Form.Text className="text-danger">Sobrenome é obrigatório.</Form.Text>}
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
                value={formData.dateOfBirth}
                onChange={handleChange}
                isInvalid={errors.dateOfBirth}
                required
              />
              {errors.dateOfBirth && <Form.Text className="text-danger">Data de nascimento é obrigatória.</Form.Text>}
            </Form.Group>
          </Col>

          <Col sm={6}>
            <Form.Group controlId="genre">
              <Form.Label>Gênero</Form.Label>
              <Form.Control
                as="select"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                isInvalid={errors.genre}
                required
              >
                <option value="">Selecione o gênero</option>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
                <option value="outro">Outro</option>
              </Form.Control>
              {errors.genre && <Form.Text className="text-danger">Gênero é obrigatório.</Form.Text>}
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={6}>
            <Form.Group controlId="phone">
              <Form.Label>Telefone</Form.Label>
              <InputMask
                className='form-control'
                mask="(99)99999-9999"
                value={formData.phone}
                onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)}
                type="text"
                name="phone"
                placeholder="(00)00000-0000"
                required
              />
              {errors.phone && <Form.Text className="text-danger">Telefone é obrigatório.</Form.Text>}
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
                isInvalid={errors.email}
                placeholder="Digite o email"
                required
              />
              {errors.email && <Form.Text className="text-danger">Email é obrigatório.</Form.Text>}
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={12}>
            <Form.Group controlId="document">
              <Form.Label>CPF</Form.Label>
              <InputMask
                className='form-control'
                mask="999.999.999-99"
                value={formData.document}
                onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)}
                type="text"
                name="document"
                placeholder="000.000.000-00"
                required
              />
              {errors.document && <Form.Text className="text-danger">CPF é obrigatório.</Form.Text>}
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3" controlId="observations">
          <Form.Label>Observações (Opcional)</Form.Label>
          <Form.Control
            as="textarea"
            name="observations"
            placeholder="Digite observações, se houver"
            value={formData.observations}
            onChange={handleChange}
          />
        </Form.Group>

        <Button variant="secondary" className="mb-4 me-2" onClick={() => navigate('/listar-participante')}>
          Voltar
        </Button>

        <Button variant="primary" type="submit" className="mb-4">
          Cadastrar Participante
        </Button>
      </Form>
    </Container>
  );
};

export default InserirParticipante;
