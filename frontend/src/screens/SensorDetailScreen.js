import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, FlatList, StyleSheet, Alert } from 'react-native';
import { getSensorReadings } from '../api/sensorReadings';
import { sendReading } from '../api/readings';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function SensorDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { sensorId, sensorName } = route.params;
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistorico = async () => {
    setLoading(true);
    const data = await getSensorReadings(sensorId);
    setHistorico(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchHistorico();
  }, [sensorId]);

  // Gera valor mock e registra leitura
  const registrarLeitura = async () => {
    const leitura = {
      sensorId: sensorId,
      readingValue: 0 // Valor será mockado pelo backend
    };
    try {
      console.log('Registrando leitura para sensor:', sensorId);
      const resultado = await sendReading(leitura);
      console.log('Leitura registrada:', resultado);
      Alert.alert('Sucesso', `Leitura ${resultado.readingValue} registrada!`);
      fetchHistorico();
    } catch (err) {
      console.error('Erro ao registrar leitura:', err);
      Alert.alert('Erro', `Não foi possível registrar leitura: ${err.message}`);
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
                  <Text style={styles.barLabel}>{value}</Text>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#180833" style={{ margin: 20 }} />
      ) : (
        <FlatList
          data={historico}
          keyExtractor={item => String(item.id) + String(item.timestamp)}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text>Valor: {item.readingValue ?? item.value}</Text>
              <Text>Data: {new Date(item.timestamp).toLocaleString()}</Text>
            </View>
          )}
          ListEmptyComponent={<Text>Nenhum dado encontrado.</Text>}
        />
      )}
      <Button title="Atualizar" onPress={fetchHistorico} disabled={loading} />
      <View style={{ height: 12 }} />
      <Button title="Registrar Leitura" onPress={registrarLeitura} disabled={loading} />
      <View style={{ height: 12 }} />
      <Button title="Voltar" onPress={() => navigation.goBack()} color="#888" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#180833',
  },
  chartContainer: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#180833',
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 120,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 2,
  },
  bar: {
    backgroundColor: '#1976d2',
    width: '80%',
    borderRadius: 2,
    minHeight: 10,
  },
  barLabel: {
    fontSize: 10,
    marginTop: 4,
    color: '#666',
    textAlign: 'center',
  },
  item: {
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
});
