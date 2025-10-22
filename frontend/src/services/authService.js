import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiUrl } from '../utils/api/apiUrl';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_info';

/**
 * Serviço de Autenticação
 */
export const authService = {
  /**
   * Fazer login
   */
  async login(username, password) {
    try {
      const apiUrl = await getApiUrl();
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Credenciais inválidas');
      }

      const data = await response.json();
      
      // Salvar token e informações do usuário
      await AsyncStorage.setItem(TOKEN_KEY, data.token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify({
        username: data.username,
        type: data.type,
      }));

      return data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Registrar novo usuário
   */
  async register(username, password) {
    try {
      const apiUrl = await getApiUrl();
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Erro ao registrar usuário');
      }

      const data = await response.json();
      
      // Salvar token e informações do usuário
      await AsyncStorage.setItem(TOKEN_KEY, data.token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify({
        username: data.username,
        type: data.type,
      }));

      return data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Fazer logout
   */
  async logout() {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
  },

  /**
   * Obter token armazenado
   */
  async getToken() {
    return await AsyncStorage.getItem(TOKEN_KEY);
  },

  /**
   * Obter informações do usuário
   */
  async getUserInfo() {
    const userJson = await AsyncStorage.getItem(USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  },

  /**
   * Verificar se está autenticado
   */
  async isAuthenticated() {
    const token = await this.getToken();
    return !!token;
  },

  /**
   * Validar token no servidor
   */
  async validateToken() {
    try {
      const token = await this.getToken();
      if (!token) return false;

      const apiUrl = await getApiUrl();
      const response = await fetch(`${apiUrl}/auth/validate`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.ok;
    } catch (error) {
      return false;
    }
  },
};
