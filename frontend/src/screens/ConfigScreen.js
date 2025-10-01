import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { getApiUrl, setApiUrl } from '../utils/api/apiUrl';

export default function ConfigScreen() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(true);

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
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
    fontSize: 16,
  },
});
