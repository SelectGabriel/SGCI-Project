import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Card, Modal, Spinner } from 'react-bootstrap';
import { FaExclamationTriangle } from 'react-icons/fa';
import { Caminhada } from '../../Models/Caminhada';
import { caminhadaService } from '../../Service/caminhadaService';

type FileType = 'termico' | 'esqueleto' | 'csv';

const EditarCaminhada: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [caminhada, setCaminhada] = useState<Caminhada | null>(null);
  const [loading, setLoading] = useState(true);

  const [videoTermico, setVideoTermico] = useState<string | null>(null);
  const [videoEsqueletizacao, setVideoEsqueletizacao] = useState<string | null>(null);
  const [arquivoCsv, setArquivoCsv] = useState<string | null>(null);

  const [showDeleteCaminhadaModal, setShowDeleteCaminhadaModal] = useState(false);
  const [isDeletingCaminhada, setIsDeletingCaminhada] = useState(false);
  const [fileTypeToRemove, setFileTypeToRemove] = useState<FileType | null>(null);
  const [isDeletingFile, setIsDeletingFile] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function fetchCaminhada() {
      try {
        setLoading(true);
        const caminhadaEncontrada = await caminhadaService.getCaminhadaById(Number(id));
        setCaminhada(caminhadaEncontrada);
        setVideoTermico(caminhadaEncontrada.thermalCameraVideo || null);
        setVideoEsqueletizacao(caminhadaEncontrada.skeletonizationVideo || null);
        setArquivoCsv(caminhadaEncontrada.observations || null);
      } catch (error: any) {
        console.error('Erro ao carregar caminhada:', error);
        setErrorMessage(error.message || 'Não foi possível carregar os dados da caminhada.');
        setShowErrorModal(true);
      } finally {
        setLoading(false);
      }
    }
    fetchCaminhada();
  }, [id]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, tipo: FileType) => {
    if (!event.target.files || event.target.files.length === 0 || !caminhada) return;
    
    const file = event.target.files[0];
    const targetInput = event.target;
    if ((tipo === 'termico' || tipo === 'esqueleto') && !file.type.startsWith('video/')) {
      setErrorMessage('Por favor, selecione um arquivo de vídeo válido (ex: .mp4, .mov, .avi).');
      setShowErrorModal(true);
      targetInput.value = '';
      return;
    }

    if (tipo === 'csv' && !file.name.toLowerCase().endsWith('.csv')) {
      setErrorMessage('Por favor, selecione um arquivo .csv válido.');
      setShowErrorModal(true);
      targetInput.value = '';
      return;
    }

    setIsUploading(true);
    try {
      const response = await caminhadaService.uploadArquivos(caminhada.id!, { [tipo]: file });
      if (tipo === 'termico') setVideoTermico(response.thermalCameraVideo);
      else if (tipo === 'esqueleto') setVideoEsqueletizacao(response.skeletonizationVideo);
      else if (tipo === 'csv') setArquivoCsv(response.observations);
    } catch (err: any) {
      console.error('Erro ao enviar arquivo:', err);
      setErrorMessage(err.message);
      setShowErrorModal(true);
    } finally {
      setIsUploading(false);
      targetInput.value = '';
    }
  };

   const handleConfirmRemoveFile = async () => {
    if (!fileTypeToRemove || !caminhada || !caminhada.id) {
        console.error("Tentativa de remover um arquivo de uma caminhada sem ID.");
        setErrorMessage("Não foi possível identificar a caminhada para remover o arquivo.");
        setShowErrorModal(true);
        return;
    }
    
    setIsDeletingFile(true);
    try {
      await caminhadaService.removerArquivo(caminhada.id, fileTypeToRemove);
      
      if (fileTypeToRemove === 'termico') setVideoTermico(null);
      else if (fileTypeToRemove === 'esqueleto') setVideoEsqueletizacao(null);
      else if (fileTypeToRemove === 'csv') setArquivoCsv(null);
      
      setFileTypeToRemove(null);
    } catch (error: any) {
      console.error('Erro ao remover arquivo:', error);
      setErrorMessage(error.message);
      setShowErrorModal(true);
      setFileTypeToRemove(null);
    } finally {
      setIsDeletingFile(false);
    }
  };

  const handleDeleteCaminhada = async () => {
    if (!caminhada) return;
    
    setIsDeletingCaminhada(true);
    try {
      await caminhadaService.deleteCaminhada(caminhada.id!);
      alert('Caminhada excluída com sucesso.');
      const experimentoId = caminhada.experiment?.id ?? caminhada.experimentId;
      navigate(`/relatorio-experimento/${experimentoId}`);
    } catch (error: any) {
      console.error('Erro ao excluir caminhada:', error);
      setErrorMessage(error.message);
      setShowErrorModal(true);
    } finally {
      setIsDeletingCaminhada(false);
      setShowDeleteCaminhadaModal(false);
    }
  };

  const handleBack = () => {
    const experimentoId = caminhada?.experiment?.id ?? caminhada?.experimentId;
    navigate(experimentoId ? `/relatorio-experimento/${experimentoId}` : '/listar-experimento');
  };

  const buildDownloadUrl = (fullPath: string | null): string => {
    if (!fullPath) return '#';
    const pathParts = fullPath.split(/[/\\]+/);
    const file = pathParts[pathParts.length - 1];
    const folder = pathParts[pathParts.length - 2];
    if (folder && file) {
      return `http://localhost:8080/api/experiments/walks/public/files/${folder}/${file}`;
    }
    console.error('buildDownloadUrl: Caminho inválido:', fullPath);
    return '#invalid-path';
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p>Carregando dados da caminhada...</p>
      </Container>
    );
  }

  return (
    <>
      <Container className="mt-5">
        {!caminhada ? (
          <div className="text-center">
             <h4>Caminhada não encontrada.</h4>
             <Button variant="secondary" onClick={handleBack}>Voltar</Button>
          </div>
        ) : (
          <Card>
            <Card.Header><h4>Editar Caminhada</h4></Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col><p><strong>ID da Caminhada:</strong> {caminhada.id}</p></Col>
                <Col><p><strong>Data:</strong> {caminhada.dateTime ? new Date(caminhada.dateTime).toLocaleDateString() : 'Data não disponível'}</p></Col>
              </Row>

              <Form.Group className="mb-3" controlId="videoTermico">
                <Form.Label>Vídeo Térmico</Form.Label>
                {videoTermico ? (
                  <div>
                    <a href={buildDownloadUrl(videoTermico)} target="_blank" rel="noopener noreferrer">Download Vídeo Térmico</a>
                    <Button variant="danger" size="sm" className="ms-2" onClick={() => setFileTypeToRemove('termico')} disabled={isUploading || isDeletingFile}>Remover</Button>
                  </div>
                ) : (
                  <Form.Control type="file" onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileUpload(e, 'termico')} accept="video/*" disabled={isUploading}/>
                )}
              </Form.Group>

              <Form.Group className="mb-3" controlId="videoEsqueletizacao">
                <Form.Label>Vídeo Esqueletização</Form.Label>
                {videoEsqueletizacao ? (
                  <div>
                    <a href={buildDownloadUrl(videoEsqueletizacao)} target="_blank" rel="noopener noreferrer">Download Vídeo Esqueletização</a>
                    <Button variant="danger" size="sm" className="ms-2" onClick={() => setFileTypeToRemove('esqueleto')} disabled={isUploading || isDeletingFile}>Remover</Button>
                  </div>
                ) : (
                  <Form.Control type="file" onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileUpload(e, 'esqueleto')} accept="video/*" disabled={isUploading}/>
                )}
              </Form.Group>

              <Form.Group className="mb-3" controlId="arquivoCsv">
                <Form.Label>Arquivo CSV</Form.Label>
                {arquivoCsv ? (
                  <div>
                    <a href={buildDownloadUrl(arquivoCsv)} target="_blank" rel="noopener noreferrer">Download CSV</a>
                    <Button variant="danger" size="sm" className="ms-2" onClick={() => setFileTypeToRemove('csv')} disabled={isUploading || isDeletingFile}>Remover</Button>
                  </div>
                ) : (
                  <Form.Control type="file" onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileUpload(e, 'csv')} accept=".csv, text/csv" disabled={isUploading}/>
                )}
              </Form.Group>
            </Card.Body>
            <Card.Footer className="d-flex justify-content-between">
              <Button variant="secondary" onClick={handleBack}>Voltar</Button>
              <Button variant="danger" onClick={() => setShowDeleteCaminhadaModal(true)}>Excluir Caminhada</Button>
            </Card.Footer>
          </Card>
        )}
      </Container>
      
      <Modal show={showDeleteCaminhadaModal} onHide={() => setShowDeleteCaminhadaModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Confirmar Exclusão</Modal.Title></Modal.Header>
        <Modal.Body>Você tem certeza que deseja excluir a caminhada (ID: {caminhada?.id})?<br /><strong>Todos os arquivos associados serão perdidos. Esta ação não pode ser desfeita.</strong></Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteCaminhadaModal(false)} disabled={isDeletingCaminhada}>Voltar</Button>
          <Button variant="danger" onClick={handleDeleteCaminhada} disabled={isDeletingCaminhada}>{isDeletingCaminhada ? (<><Spinner as="span" size="sm" animation="border" /><span className="ms-2">Excluindo...</span></>) : ('Excluir')}</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={fileTypeToRemove !== null} onHide={() => setFileTypeToRemove(null)} centered>
        <Modal.Header closeButton><Modal.Title>Confirmar Remoção</Modal.Title></Modal.Header>
        <Modal.Body>Tem certeza que deseja remover este arquivo?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setFileTypeToRemove(null)} disabled={isDeletingFile}>Cancelar</Button>
          <Button variant="danger" onClick={handleConfirmRemoveFile} disabled={isDeletingFile}>{isDeletingFile ? (<><Spinner as="span" size="sm" animation="border" /><span className="ms-2">Removendo...</span></>) : ('Remover')}</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title><FaExclamationTriangle className="me-2" />Ocorreu um Erro</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errorMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowErrorModal(false)}>Fechar</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EditarCaminhada;