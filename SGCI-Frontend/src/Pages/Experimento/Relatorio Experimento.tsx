import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Table, Button, Card } from 'react-bootstrap';
import { Experimento } from '../../Models/Experimento';
import { Caminhada } from '../../Models/Caminhada';
import { experimentoService } from '../../Service/experimentoService';
import { caminhadaService } from '../../Service/caminhadaService';

const RelatorioExperimento: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [experimento, setExperimento] = useState<Experimento | null>(null);
  const [caminhadas, setCaminhadas] = useState<Caminhada[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const URLdownload = "http://localhost:8080/api/experiments/walks/public/files";
  const URLstream = "http://localhost:8080/api/experiments/walks/public/stream";

  useEffect(() => {
    async function fetchData() {
      try {
        if (!id) return;

        const experimentoEncontrado = await experimentoService.getExperimentoById(Number(id));
        setExperimento(experimentoEncontrado);

        const caminhadasEncontradas = await caminhadaService.getCaminhadasByExperimentoId(Number(id));
        setCaminhadas(caminhadasEncontradas);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    }

    fetchData();
  }, [id]);

  const handleNovaCaminhada = async () => {
    if (!experimento) return;

    try {
      const novaCaminhada: Caminhada = {
        experimentId: experimento.id!,
        dateTime: new Date().toISOString(),
        thermalCameraVideo: '',
        skeletonizationVideo: '',
        observations: '',
        order: caminhadas.length + 1
      };

      const caminhadaCriada = await caminhadaService.createCaminhada(novaCaminhada);
      setCaminhadas([...caminhadas, caminhadaCriada]);
    } catch (error) {
      console.error('Erro ao criar nova caminhada:', error);
      alert('Erro ao criar nova caminhada.');
    }
  };

  const handleEditarCaminhada = (idCaminhada: number) => {
    navigate(`/editar-caminhada/${idCaminhada}`);
  };

  const handleShowVideo = (fullPath: string | null) => {
    if (!fullPath) return;
    const parts = fullPath.split(/[/\\]+/);
    const folder = parts[parts.length - 2];
    const filename = parts[parts.length - 1];
    const url = fullPath;
    console.log(fullPath);

    setVideoUrl(url);
    setShowModal(true);
  };

  const handleVoltar = () => {
    navigate('/listar-experimento');
  };

  return (
    <Container className="mt-5">
      {experimento && (
        <>
          <h3>Experimento {experimento.id}</h3>
          <Card className="mb-4">
            <Card.Body>
              <Row className="mb-3">
                <Col>
                  <p><strong>Pesquisador:</strong> {`${experimento.researcher?.name} ${experimento.researcher?.lastname}`}</p>
                </Col>
                <Col>
                  <p><strong>Participante:</strong> {`${experimento.participant?.name} ${experimento.participant?.lastname}`}</p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <p><strong>Observações:</strong> {experimento.observations || 'Sem observações'}</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </>
      )}

      <div className="d-flex justify-content-between mb-3">
        <h4>Caminhadas</h4>
        <Button variant="primary" onClick={handleNovaCaminhada}>Nova Caminhada</Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Id Caminhada</th>
            <th>Data da Caminhada</th>
            <th>Vídeo Térmico</th>
            <th>Vídeo Esqueletização</th>
            <th>Arquivo CSV</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {caminhadas.length > 0 ? (
            caminhadas.map((caminhada) => (
              <tr key={caminhada.id}>
                <td>{caminhada.id}</td>
                <td>{caminhada.dateTime ? new Date(caminhada.dateTime).toLocaleString() : 'Data não disponível'}</td>
                <td>
                  {caminhada.thermalCameraVideo ? (
                    <>
                      <a href={URLdownload + caminhada.thermalCameraVideo?.replace("uploads/walks", "")} download>Download</a>
                      <Button variant="link" size="sm" className="ms-2 p-0" onClick={() => handleShowVideo(URLstream + caminhada.thermalCameraVideo?.replace("uploads/walks", ""))}>
                        Visualizar
                      </Button>
                    </>
                  ) : 'N/A'}
                </td>
                <td>
                  {caminhada.skeletonizationVideo ? (
                    <>
                      <a href={URLdownload + caminhada.skeletonizationVideo.replace("uploads/walks", "")} download>Download</a>
                      <Button variant="link" size="sm" className="ms-2 p-0" onClick={() => handleShowVideo(URLstream + caminhada.skeletonizationVideo?.replace("uploads/walks", ""))}>
                        Visualizar
                      </Button>
                    </>
                  ) : 'N/A'}
                </td>
                <td>
                  {caminhada.observations ? (
                    <a href={URLdownload + caminhada.thermalCameraVideo?.replace("uploads/walks", "")} download>Download</a>
                  ) : 'N/A'}
                </td>
                <td>
                  <Button variant="link" className="text-warning" onClick={() => handleEditarCaminhada(caminhada.id!)}>
                    Editar
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center">Nenhuma caminhada encontrada.</td>
            </tr>
          )}
        </tbody>
      </Table>

      <div className="d-flex justify-content-end mt-4">
        <Button variant="secondary" onClick={handleVoltar}>Voltar</Button>
      </div>

      {showModal && (
        <div className="modal fade show d-block" tabIndex={-1} role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Visualizar Vídeo</h5>
                <Button variant="close" onClick={() => { setShowModal(false); setVideoUrl(null); }} />
              </div>
              <div className="modal-body text-center">
                {videoUrl ? (
                  (() => {
                    const ext = videoUrl.split('.').pop()?.toLowerCase() || 'mp4';
                    return (
                      <video style={{ maxHeight: '80vh', maxWidth: '100%', objectFit: 'contain' }}
                       controls
                       crossOrigin="anonymous">
                        <source src={videoUrl} type={`video/${ext}`} />
                        Seu navegador não suporta visualização de vídeo.
                      </video>
                    );
                  })()
                ) : (
                  <p>Vídeo não encontrado.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default RelatorioExperimento;
