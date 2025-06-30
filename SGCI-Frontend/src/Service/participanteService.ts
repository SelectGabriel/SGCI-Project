import axios from 'axios';
import { Participante } from "../Models/Participante";

const API_BASE_URL = 'http://localhost:8080/api/participant';

const getApiErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error) && error.response) {
    const responseData = error.response.data;
    if (typeof responseData === 'object' && responseData !== null && 'message' in responseData) {
        return (responseData as { message: string }).message;
    }
    return typeof responseData === 'string' ? responseData : 'Ocorreu um erro de validação no servidor.';
  }
  return 'Não foi possível se conectar ao servidor. Verifique sua conexão e tente novamente.';
};


export class ParticipanteService {
  async fetchParticipantes(): Promise<Participante[]> {
    try {
      const response = await axios.get<Participante[]>(`${API_BASE_URL}/all`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async getParticipanteById(id: number): Promise<Participante> {
    try {
      const response = await axios.get<Participante>(`${API_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async alterarParticipanteById(id: number, dados: Partial<Participante>): Promise<void> {
    try {
      await axios.put(`${API_BASE_URL}/update/${id}`, dados);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async removerParticipanteById(id: number): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/delete/${id}`);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async inserirParticipante(participante: Participante): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/register`, participante);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }
}

export const participanteService = new ParticipanteService();