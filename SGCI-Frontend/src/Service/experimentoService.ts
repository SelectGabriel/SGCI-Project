import axios from 'axios';
import { Experimento } from '../Models/Experimento';

const API_BASE_URL = 'http://localhost:8080/api/experiments';

const getApiErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error) && error.response) {
    return error.response.data;
  }
  return 'Ocorreu um erro de comunicação. Tente novamente mais tarde.';
};

export class ExperimentoService {
  async fetchExperimentos(): Promise<Experimento[]> {
    const response = await axios.get<Experimento[]>(`${API_BASE_URL}/all`);
    return response.data;
  }
  
  async fetchExperimentosDoUsuario(userId: number): Promise<Experimento[]> {
    const response = await axios.get<Experimento[]>(`${API_BASE_URL}/researcher/${userId}`);
    return response.data;
  }

  async getExperimentoById(id: number): Promise<Experimento> {
    const response = await axios.get<Experimento>(`${API_BASE_URL}/${id}`);
    return response.data;
  }

  async inserirExperimento(experimento: Experimento): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/create`, experimento);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async alterarExperimento(experimentoData: Experimento): Promise<void> {
    try {
      await axios.put(`${API_BASE_URL}/update/${experimentoData.id}`, experimentoData);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async removerExperimentoById(id: number): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/delete/${id}`);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }
}

export const experimentoService = new ExperimentoService();