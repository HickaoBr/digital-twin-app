import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useAuth } from '../../context/AuthContext';
import { loginStyles } from './styles';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const auth = useAuth();
  
  // Verificação de segurança
  if (!auth || !auth.login || !auth.register) {
    return (
      <View style={loginStyles.container}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={{ color: '#fff', marginTop: 20 }}>Carregando autenticação...</Text>
      </View>
    );
  }
  
  const { login, register } = auth;

  const handleSubmit = async () => {
    // Validações
    if (!username.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Campo obrigatório',
        text2: 'Por favor, digite o username',
        position: 'top',
      });
      return;
    }

    if (!password.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Campo obrigatório',
        text2: 'Por favor, digite a senha',
        position: 'top',
      });
      return;
    }

    if (password.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Senha inválida',
        text2: 'A senha deve ter pelo menos 6 caracteres',
        position: 'top',
      });
      return;
    }

    setLoading(true);

    try {
      const result = isRegisterMode
        ? await register(username, password)
        : await login(username, password);
      
      // Toast será mostrado no AuthContext
      // Navegação será automática
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: error.message || 'Ocorreu um erro. Tente novamente.',
        position: 'top',
        visibilityTime: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setUsername('');
    setPassword('');
  };

  return (
    <KeyboardAvoidingView
      style={loginStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={loginStyles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={loginStyles.content}>
          {/* Logo/Título */}
          <View style={loginStyles.headerContainer}>
            <Text style={loginStyles.title}>Digital Twin</Text>
            <Text style={loginStyles.subtitle}>
              {isRegisterMode ? 'Criar Conta' : 'Bem-vindo de volta!'}
            </Text>
          </View>

          {/* Formulário */}
          <View style={loginStyles.formContainer}>
            <View style={loginStyles.inputContainer}>
              <Text style={loginStyles.label}>Username</Text>
              <TextInput
                style={loginStyles.input}
                placeholder="Digite seu username"
                placeholderTextColor="#999"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
            </View>

            <View style={loginStyles.inputContainer}>
              <Text style={loginStyles.label}>Senha</Text>
              <TextInput
                style={loginStyles.input}
                placeholder="Digite sua senha"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                editable={!loading}
              />
            </View>

            {/* Dica de usuário padrão */}
            {!isRegisterMode && (
              <View style={loginStyles.hintContainer}>
                <Text style={loginStyles.hintText}>
                  Usuário padrão: admin / admin123
                </Text>
              </View>
            )}

            {/* Botão Principal */}
            <TouchableOpacity
              style={[
                loginStyles.button,
                loading && loginStyles.buttonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={loginStyles.buttonText}>
                  {isRegisterMode ? 'Registrar' : 'Entrar'}
                </Text>
              )}
            </TouchableOpacity>

            {/* Botão Alternar Modo */}
            <TouchableOpacity
              style={loginStyles.toggleButton}
              onPress={toggleMode}
              disabled={loading}
            >
              <Text style={loginStyles.toggleButtonText}>
                {isRegisterMode
                  ? 'Já tem uma conta? Fazer login'
                  : 'Não tem conta? Registrar-se'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
