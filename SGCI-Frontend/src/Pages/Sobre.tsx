import React from 'react';
import { Container, Row, Col, Card, Image } from 'react-bootstrap';
import logo_gepta from '../Shared/logo_gepta.png';

const Sobre: React.FC = () => {
  return (
    <Container className="mt-4">
      <h3 className="text-center mb-4">Sobre o Projeto</h3>

      <Row className="mb-5 align-items-center">
        <Col md={4} className="text-center mb-3 mb-md-0">
          <Image src={logo_gepta} fluid rounded />
        </Col>
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="h5">Grupo de Estudos e Pesquisas em Tecnologia Aplicada (GEPTA)</Card.Title>
              <Card.Text>
                O Grupo de Estudos e Pesquisas em Tecnologia Aplicada (GEPTA) é vinculado ao Setor de Educação Profissional e Tecnológica (SEPT) da Universidade Federal do Paraná (UFPR). O grupo desenvolve pesquisas científicas com foco na aplicação de tecnologias inovadoras em prol do desenvolvimento social, promovendo a interdisciplinaridade entre áreas da tecnologia e demandas reais da sociedade.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-5 align-items-center flex-md-row-reverse">
        <Col md={4} className="text-center mb-3 mb-md-0">
          <Image src="https://via.placeholder.com/300x200?text=Corredor+Inteligente" fluid rounded />
        </Col>
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="h5">Projeto Corredor Inteligente</Card.Title>
              <Card.Text>
                O Corredor Inteligente (Smart Corridor) é uma iniciativa tecnológica que integra sistemas embarcados, sensores sem fio e análise computacional com o objetivo de criar um ambiente capaz de estimular e reconhecer emoções humanas durante a locomoção. Por meio da coleta e análise de dados em tempo real, o projeto busca contribuir com estudos sobre interação homem-ambiente, saúde emocional e inteligência artificial aplicada ao cotidiano.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="h5">Coordenação do GEPTA</Card.Title>
              <Card.Text>
                As atividades do GEPTA e do projeto Corredor Inteligente são coordenadas por pesquisadores da UFPR:
              </Card.Text>
              <ul>
                <li><strong>Orientador:</strong> Professor Dr. Luiz Antônio Pereira Neves</li>
                <li><strong>Coorientadora:</strong> Professora Dra. Caroline Mazetto Mendes</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="h5">Desenvolvedores do Sistema</Card.Title>
              <Card.Text>
                Este sistema foi desenvolvido em 2025 como Trabalho de Conclusão de Curso (TCC) ao curso de Tecnologia em Análise e Desenvolvimento de Sistemas (TADS), da Universidade Federal do Paraná:
              </Card.Text>
              <ul>
                <li><strong>Gabriel Afonso da Cunha</strong> – Discente do TADS - UFPR</li>
                <li><strong>Luiz Senji Vidal Tsuchiya</strong> – Discente do TADS - UFPR</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Sobre;
