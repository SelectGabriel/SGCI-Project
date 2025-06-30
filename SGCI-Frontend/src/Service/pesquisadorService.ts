import axios from 'axios';
import { Pesquisador } from '../Models/Pesquisador';

const API_BASE_URL = 'http://localhost:8080/api';

const getApiErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error) && error.response) {
    const responseData = error.response.data;
    return typeof responseData === 'object' ? JSON.stringify(responseData) : responseData;
  }
  return 'Ocorreu um erro de comunicação. Tente novamente mais tarde.';
};

export class PesquisadorService {
  async fetchPesquisadores(): Promise<Pesquisador[]> {
    try {
      const response = await axios.get<Pesquisador[]>(`${API_BASE_URL}/researchers/all`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async getPesquisadorById(id: number): Promise<Pesquisador> {
    try {
      const response = await axios.get<Pesquisador>(`${API_BASE_URL}/researchers/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async alterarPesquisadorById(id: number, dados: Partial<Pesquisador>): Promise<void> {
    try {
      await axios.put(`${API_BASE_URL}/researchers/update/${id}`, dados);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async removerPesquisadorById(id: number): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/researchers/delete/${id}`);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }

  async promoteToAdmin(researcherId: number): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/auth/promote/${researcherId}`);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  }
}

export const pesquisadorService = new PesquisadorService();