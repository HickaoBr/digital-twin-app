import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { getSensorReadings } from '../api/sensorReadings';
import { sendReading } from '../api/readings';
import { useRoute, useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

export default function SensorDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { sensorId, sensorName } = route.params;
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registrando, setRegistrando] = useState(false);

  const fetchHistorico = async () => {
    console.log(`Atualizando histórico do sensor ${sensorId}...`);
    setLoading(true);
    try {
      const data = await getSensorReadings(sensorId);
      console.log(`Histórico carregado: ${data.length} leituras`);
      setHistorico(data);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistorico();
  }, [sensorId]);

  // Gera valor mock e registra leitura
  const registrarLeitura = async () => {
    console.log(`Registrando leitura para sensor ${sensorId}...`);
    setRegistrando(true);
    
    // O backend vai gerar o valor mockado baseado no tipo do sensor
    const leitura = {
      sensorId: String(sensorId),
      readingValue: 0, // Backend vai sobrescrever com valor correto
      timestamp: new Date().toISOString()
    };
    
    console.log('Payload da leitura:', leitura);
    
    try {
      const resultado = await sendReading(leitura);
      console.log('Leitura registrada com sucesso:', resultado);
      
      Toast.show({
        type: 'success',
        text1: 'Leitura registrada!',
        text2: `Valor: ${resultado.readingValue?.toFixed(2)}`,
        position: 'top',
        visibilityTime: 3000,
      });
      
      // Aguardar 500ms para garantir que salvou no banco
      setTimeout(() => {
        fetchHistorico();
      }, 500);
    } catch (err) {
      console.error('Erro ao registrar leitura:', err);
      
      Toast.show({
        type: 'error',
        text1: 'Erro ao registrar',
        text2: err.message || 'Tente novamente',
        position: 'top',
        visibilityTime: 4000,
      });
    } finally {
      setRegistrando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico - {sensorName || sensorId}</Text>
      
      {/* Gráfico simples de barras */}
      {!loading && historico.length > 0 && (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Gráfico de Leituras</Text>
          <View style={styles.chart}>
            {historico.slice(-10).map((item, index) => {
              const value = item.readingValue ?? item.value ?? 0;
              const maxValue = Math.max(...historico.map(h => h.readingValue ?? h.value ?? 0));
              const barHeight = Math.max(10, (value / maxValue) * 100);
              return (
                <View key={index} style={styles.barContainer}>
                  <View style={[styles.bar, { height: barHeight }]} />
                  <Text style={styles.barLabel}>{value.toFixed(1)}</Text>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#4A90E2" style={{ margin: 20 }} />
      ) : (
        <FlatList
          data={historico}
          keyExtractor={item => String(item.id) + String(item.timestamp)}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemValue}>Valor: {(item.readingValue ?? item.value)?.toFixed(2)}</Text>
              <Text style={styles.itemDate}>Data: {new Date(item.timestamp).toLocaleString('pt-BR')}</Text>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhum dado encontrado.</Text>
            </View>
          }
        />
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.buttonPrimary]}
          onPress={fetchHistorico}
          disabled={loading || registrando}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Atualizar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonSuccess]}
          onPress={registrarLeitura}
          disabled={loading || registrando}
        >
          {registrando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Registrar Leitura</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>← Voltar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E27',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  chartContainer: {
    backgroundColor: '#1A1F3A',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 120,
    backgroundColor: '#0A0E27',
    borderRadius: 8,
    padding: 8,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 2,
  },
  bar: {
    backgroundColor: '#4A90E2',
    width: '80%',
    borderRadius: 4,
    minHeight: 10,
  },
  barLabel: {
    fontSize: 10,
    marginTop: 4,
    color: '#B0BEC5',
    textAlign: 'center',
  },
  item: {
    backgroundColor: '#1A1F3A',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
  },
  itemValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 14,
    color: '#B0BEC5',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#B0BEC5',
    fontSize: 16,
  },
  buttonContainer: {
    gap: 12,
    paddingTop: 16,
  },
  button: {
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonPrimary: {
    backgroundColor: '#4A90E2',
  },
  buttonSuccess: {
    backgroundColor: '#4CAF50',
  },
  buttonSecondary: {
    backgroundColor: '#5C6BC0',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
