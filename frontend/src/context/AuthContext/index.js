import React, { createContext, useState, useContext, useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { authService } from '../../services/authService';
import * as Updates from 'expo-updates';

const AuthContext = createContext({
  user: null,
  loading: true,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  checkAuth: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar autenticação ao iniciar
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await authService.getToken();
      const userInfo = await authService.getUserInfo();
      
      if (token && userInfo) {
        setUser(userInfo);
        setIsAuthenticated(true);
        
        // Validação em background (não bloqueia UI)
        authService.validateToken().catch(() => {
          // Token pode estar expirado, mas mantendo sessão local
        });
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      // NÃO deslogar em caso de erro
      // Usuário pode estar offline temporariamente
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const data = await authService.login(username, password);
      setUser({ username: data.username });
      setIsAuthenticated(true);
      
      Toast.show({
        type: 'success',
        text1: 'Login realizado!',
        text2: `Bem-vindo, ${data.username}!`,
        position: 'top',
        visibilityTime: 3000,
      });
      
      return { success: true, message: data.message };
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro no login',
        text2: error.message || 'Verifique suas credenciais',
        position: 'top',
        visibilityTime: 4000,
      });
      
      return { success: false, message: error.message || 'Erro ao fazer login' };
    }
  };

  const register = async (username, password) => {
    try {
      const data = await authService.register(username, password);
      setUser({ username: data.username });
      setIsAuthenticated(true);
      
      Toast.show({
        type: 'success',
        text1: 'Conta criada!',
        text2: `Bem-vindo, ${data.username}!`,
        position: 'top',
        visibilityTime: 3000,
      });
      
      return { success: true, message: data.message };
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro no registro',
        text2: error.message || 'Não foi possível criar a conta',
        position: 'top',
        visibilityTime: 4000,
      });
      
      return { success: false, message: error.message || 'Erro ao registrar' };
    }
  };

  const logout = async () => {
    try {
      // Limpa o AsyncStorage
      await authService.logout();
      
      // Limpa o estado local
      setIsAuthenticated(false);
      setUser(null);
      
      Toast.show({
        type: 'info',
        text1: 'Logout realizado',
        text2: 'Até logo!',
        position: 'top',
        visibilityTime: 2000,
      });

      // Força reload do app após 500ms
      setTimeout(async () => {
        try {
          await Updates.reloadAsync();
        } catch (e) {
          // Fallback: apenas atualiza o estado
        }
      }, 500);
      
    } catch (error) {
      // Mesmo com erro, força o logout local
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context || Object.keys(context).length === 0) {
    // Retornar valores padrão em vez de throw para evitar crash
    return {
      user: null,
      loading: false,
      isAuthenticated: false,
      login: async () => ({ success: false, message: 'AuthProvider não configurado' }),
      register: async () => ({ success: false, message: 'AuthProvider não configurado' }),
      logout: async () => {},
      checkAuth: async () => {},
    };
  }
  return context;
}
