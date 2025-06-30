class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_INFO_KEY = 'user_info';

  saveAuthData(
      token: string,
      userInfo: {
        id: number;
        name: string;
        lastname: string;
        phone: string;
        email: string;
        document: string;
        type: string;
        uuid: number;
        isAdmin: boolean;
      }
  ): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_INFO_KEY, JSON.stringify(userInfo));
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUserInfo(): {
    id: number;
    name: string;
    lastname: string;
    phone: string;
    email: string;
    document: string;
    type: string;
    uuid: number;
    isAdmin:boolean;
  } | null {
    const userInfo = localStorage.getItem(this.USER_INFO_KEY);
    return userInfo ? JSON.parse(userInfo) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_INFO_KEY);
  }

  getUserType(): string | null {
    const userInfo = this.getUserInfo();
    return userInfo ? userInfo.type : null;
  }
}

export const authService = new AuthService();
