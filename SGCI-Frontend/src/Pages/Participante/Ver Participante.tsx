import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import { Participante } from '../../Models/Participante';
import { participanteService } from '../../Service/participanteService';

const VerParticipante: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [participante, setParticipante] = useState<Participante | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchParticipante() {
      try {
        setLoading(true);
        const participanteEncontrado = await participanteService.getParticipanteById(Number(id));
        if (participanteEncontrado) {
          setParticipante({
            ...participanteEncontrado,
            dateOfBirth: new Date(participanteEncontrado.dateOfBirth),
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

    fetchParticipante();
  }, [id]);

  const formatarData = (data: Date) => {
    return data.toLocaleDateString('pt-BR');
  };

  if (loading) return <p>Carregando...</p>;
  if (!participante) return <p>Participante não encontrado.</p>;

  return (
    <Container className="mt-5">
      <Card>
        <Card.Header className="text-center">
          <h4>Detalhes do Participante</h4>
        </Card.Header>
        <Card.Body>
          <Row className="mb-2">
            <Col xs={12} sm={6}>
              <p><strong>Nome:</strong> {participante.name}</p>
            </Col>
            <Col xs={12} sm={6}>
              <p><strong>Sobrenome:</strong> {participante.lastname}</p>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col xs={12} sm={6}>
              <p><strong>Gênero:</strong> {participante.genre}</p>
            </Col>
            <Col xs={12} sm={6}>
              <p><strong>Data de Nascimento:</strong> {formatarData(participante.dateOfBirth)}</p>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col xs={12} sm={6}>
              <p><strong>Telefone:</strong> {participante.phone}</p>
            </Col>
            <Col xs={12} sm={6}>
              <p><strong>Email:</strong> {participante.email}</p>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col xs={12} sm={6}>
              <p><strong>CPF:</strong> {participante.document}</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <p><strong>Observações:</strong> {participante.observations}</p>
            </Col>
          </Row>
        </Card.Body>
        <Card.Footer className="d-flex justify-content-between">
          <Button variant="secondary" onClick={() => navigate('/listar-participante')}>
            Voltar
          </Button>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default VerParticipante;
