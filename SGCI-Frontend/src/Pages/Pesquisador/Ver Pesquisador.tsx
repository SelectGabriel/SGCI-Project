import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import { Pesquisador } from '../../Models/Pesquisador';
import { pesquisadorService } from '../../Service/pesquisadorService';
import { getTypeLabel } from '../../Utils/tipoPesquisadorUtils';

const VerPesquisador: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pesquisador, setPesquisador] = useState<Pesquisador | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPesquisador() {
      try {
        setLoading(true);
        if (id) {
          const pesquisadorEncontrado = await pesquisadorService.getPesquisadorById(Number(id));
          if (pesquisadorEncontrado) {
            setPesquisador(pesquisadorEncontrado);
          } else {
            throw new Error('Pesquisador não encontrado');
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchPesquisador();
  }, [id]);

  if (loading) return <p>Carregando...</p>;
  if (!pesquisador) return <p>Pesquisador não encontrado.</p>;

  return (
    <Container className="mt-5">
      <Card>
        <Card.Header className="text-center">
          <h4>Pesquisador</h4>
        </Card.Header>
        <Card.Body>
          <Row className="mb-2">
            <Col xs={12} sm={6}>
              <p><strong>Nome:</strong> {pesquisador.name}</p>
            </Col>
            <Col xs={12} sm={6}>
              <p><strong>Sobrenome:</strong> {pesquisador.lastname}</p>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col xs={12} sm={6}>
              <p><strong>Tipo:</strong> {getTypeLabel(pesquisador.type)}</p>
            </Col>
            <Col xs={12} sm={6}>
              <p><strong>Instituição:</strong> {pesquisador.institution}</p>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col xs={12} sm={6}>
              <p><strong>Telefone:</strong> {pesquisador.phone}</p>
            </Col>
            <Col xs={12} sm={6}>
              <p><strong>Email:</strong> {pesquisador.email}</p>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col xs={12} sm={6}>
              <p><strong>CPF:</strong> {pesquisador.document}</p>
            </Col>
            {/*<Col xs={12} sm={6}>
              <p><strong>Administrador:</strong> {pesquisador.isAdmin ? 'Sim' : 'Não'}</p>
            </Col>*/}
          </Row>
        </Card.Body>
        <Card.Footer className="d-flex justify-content-between">
          <Button variant="secondary" onClick={() => navigate('/listar-pesquisador')}>
            Voltar
          </Button>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default VerPesquisador;
