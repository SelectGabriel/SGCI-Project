import axios from "axios";
import { authService } from "./authService";

const API_BASE_URL = "http://localhost:8080/api";

class LoginService {
  async login(username: string, password: string): Promise<boolean> {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        username,
        password,
      });

      const { accessToken, tokenType, researcher } = response.data;

      authService.saveAuthData(`${tokenType}${accessToken}`, {
        id: researcher.id,
        name: researcher.name,
        lastname: researcher.lastname,
        phone: researcher.phone,
        email: researcher.email,
        document: researcher.document,
        type: researcher.type,
        uuid: researcher.uuid,
        isAdmin: false
      });

      return true;
    } catch (error) {
      console.error("Erro ao realizar login:", error);
      return false;
    }
  }

  async recuperarSenha(email: string): Promise<boolean> {
    try {
      await axios.post(`${API_BASE_URL}/auth/forgot`, email, {
        headers: {
          "Content-Type": "text/plain",
        },
      });
      return true;
    } catch (error) {
      console.error("Erro ao enviar e-mail de recuperação:", error);
      return false;
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const params = new URLSearchParams();
      params.append('token', token);
      params.append('newPassword', newPassword);
      await axios.post(`${API_BASE_URL}/auth/reset`, params);
    } catch (error) {
      console.error("Erro ao redefinir a senha:", error);
      throw error;
    }
  }

}

export const loginService = new LoginService();
