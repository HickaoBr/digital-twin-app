import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { getApiUrl, setApiUrl } from '../utils/api/apiUrl';
import { useAuth } from '../context/AuthContext';

export default function ConfigScreen() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    getApiUrl().then((savedUrl) => {
      setUrl(savedUrl);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    if (!url.startsWith('http')) {
      Alert.alert('URL inválida', 'A URL deve começar com http ou https.');
      return;
    }
    await setApiUrl(url);
    Alert.alert('Sucesso', 'URL da API salva!');
  };

  if (loading) return <Text>Carregando...</Text>;

  return (
    <View style={styles.container}>
      {/* Informações do Usuário */}
      <View style={styles.userInfo}>
        <Text style={styles.userLabel}>Usuário logado:</Text>
        <Text style={styles.username}>{user?.username || 'N/A'}</Text>
      </View>

      {/* Configuração de URL */}
      <Text style={styles.label}>URL da API:</Text>
      <TextInput
        style={styles.input}
        value={url}
        onChangeText={setUrl}
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="http://192.168.0.20:8080"
      />
      <Button title="Salvar URL" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#0A0E27',
  },
  userInfo: {
    backgroundColor: '#1A1F3A',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
  },
  userLabel: {
    fontSize: 14,
    color: '#8B8FA8',
    marginBottom: 4,
  },
  username: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#8B8FA8',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#2A2F4A',
    backgroundColor: '#1A1F3A',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    color: '#fff',
  },
});
