import { authService } from '../../services/authService';
import { getApiUrl } from '../api/apiUrl';

/**
 * Cliente HTTP com suporte a JWT
 */
export const apiClient = {
  /**
   * Fazer requisição GET com autenticação
   */
  async get(endpoint) {
    try {
      const apiUrl = await getApiUrl();
      const token = await authService.getToken();

      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      if (response.status === 401 || response.status === 403) {
        const errorText = await response.text();
        throw new Error(`Erro de autenticação (${response.status}): ${errorText || 'Token inválido ou expirado'}`);
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText || 'Erro desconhecido'}`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  /**
   * Fazer requisição POST com autenticação
   */
  async post(endpoint, data) {
    try {
      const apiUrl = await getApiUrl();
      const token = await authService.getToken();

      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(data),
      });

      if (response.status === 401 || response.status === 403) {
        const errorText = await response.text();
        throw new Error(`Erro de autenticação (${response.status}): ${errorText || 'Token inválido ou expirado'}`);
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText || 'Erro desconhecido'}`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  /**
   * Fazer requisição PUT com autenticação
   */
  async put(endpoint, data) {
    try {
      const apiUrl = await getApiUrl();
      const token = await authService.getToken();

      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(data),
      });

      if (response.status === 401 || response.status === 403) {
        const errorText = await response.text();
        throw new Error(`Erro de autenticação (${response.status}): ${errorText || 'Token inválido ou expirado'}`);
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText || 'Erro desconhecido'}`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  /**
   * Fazer requisição DELETE com autenticação
   */
  async delete(endpoint) {
    try {
      const apiUrl = await getApiUrl();
      const token = await authService.getToken();

      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      if (response.status === 401 || response.status === 403) {
        const errorText = await response.text();
        throw new Error(`Erro de autenticação (${response.status}): ${errorText || 'Token inválido ou expirado'}`);
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText || 'Erro desconhecido'}`);
      }

      return response.status === 204 ? null : await response.json();
    } catch (error) {
      throw error;
    }
  },
};

export default apiClient;
