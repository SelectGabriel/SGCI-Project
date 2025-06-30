import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

const getApiErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error) && error.response) {
    const responseData = error.response.data;
    if (typeof responseData === 'object' && responseData !== null && 'message' in responseData) {
        return (responseData as { message: string }).message;
    }
    return typeof responseData === 'string' ? responseData : 'Ocorreu um erro de validação.';
  }
  return 'Não foi possível se conectar ao servidor. Tente novamente mais tarde.';
};


export const registerService = {
  registerPesquisador: async (dados: any) => {
    try {
      const response = await axios.post(`${API_URL}/register`, dados);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },
};