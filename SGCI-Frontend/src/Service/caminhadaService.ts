import axios from 'axios';
import { Caminhada } from '../Models/Caminhada';

const API_BASE_URL = 'http://localhost:8080/api/experiments/walks';

const getApiErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error) && error.response) {
    return error.response.data;
  }
  return 'Ocorreu um erro de comunicação. Tente novamente mais tarde.';
};

class CaminhadaService {
  async getCaminhadasByExperimentoId(experimentoId: number): Promise<Caminhada[]> {
    try {
      const response = await axios.get<Caminhada[]>(`${API_BASE_URL}/byExperiment/${experimentoId}`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async getCaminhadaById(caminhadaId: number): Promise<Caminhada> {
    try {
      const response = await axios.get<Caminhada>(`${API_BASE_URL}/${caminhadaId}`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async removerArquivo(caminhadaId: number, tipo: 'termico' | 'esqueleto' | 'csv'): Promise<Caminhada> {
    try {
      const response = await axios.delete<Caminhada>(`${API_BASE_URL}/${caminhadaId}/remove-file`, {
        params: { tipo }
      });
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }
  
  async createCaminhada(caminhada: Caminhada): Promise<Caminhada> {
    try {
      const response = await axios.post<Caminhada>(`${API_BASE_URL}?experimentId=${caminhada.experimentId}`, caminhada);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }
  
  async updateCaminhada(caminhadaId: number, caminhada: Partial<Caminhada>): Promise<Caminhada> {
    try {
      const response = await axios.put<Caminhada>(`${API_BASE_URL}/${caminhadaId}`, caminhada);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async deleteCaminhada(caminhadaId: number): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/${caminhadaId}`);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async uploadArquivos(id: number, arquivos: {
    termico?: File;
    esqueleto?: File;
    csv?: File;
  }): Promise<Caminhada> {
    try {
      const formData = new FormData();
      if (arquivos.termico) formData.append('termico', arquivos.termico);
      if (arquivos.esqueleto) formData.append('esqueleto', arquivos.esqueleto);
      if (arquivos.csv) formData.append('csv', arquivos.csv);

      const response = await axios.put<Caminhada>(`${API_BASE_URL}/${id}/upload`, formData);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  createNovaCaminhada(experimentoId: number): Caminhada {
    return {
      id: Date.now(),
      experimentId: experimentoId,
      dateTime: "",
      thermalCameraVideo: '',
      skeletonizationVideo: '',
      observations: '',
      order: 0,
    };
  }
}

export const caminhadaService = new CaminhadaService();