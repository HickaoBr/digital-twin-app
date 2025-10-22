import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSensorContext } from '../../context/SensorContext';
import { HistStyles } from './styles';

export default function HistoricoScreen() {
  const { historico, sensores, atualizarHistorico } = useSensorContext();
  const [loading, setLoading] = useState(false);

  const atualizar = async () => {
    console.log('Atualizando histórico...');
    setLoading(true);
    await atualizarHistorico();
    setLoading(false);
    console.log('Histórico atualizado!');
  };

  useEffect(() => {
    atualizar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mapeia sensorId -> nome do sensor
  const getSensorName = (sensorId) => {
    const sensor = sensores.find(s => s.id === String(sensorId));
    return sensor?.nome || `Sensor ${sensorId}`;
  };

  // Ordena histórico por timestamp (mais recente primeiro)
  const historicoOrdenado = [...historico].sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  );

  return (
    <View style={HistStyles.container}>
      {/* Botão de atualizar */}
      <TouchableOpacity
        onPress={atualizar}
        disabled={loading}
        style={{
          backgroundColor: '#4A90E2',
          padding: 14,
          borderRadius: 12,
          margin: 16,
          alignItems: 'center',
        }}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
            Atualizar Histórico
          </Text>
        )}
      </TouchableOpacity>

      {/* Lista de leituras */}
      {loading && historico.length === 0 ? (
        <ActivityIndicator size="large" color="#4A90E2" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView>
          {historicoOrdenado.length === 0 ? (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ color: '#666', fontSize: 16 }}>
                Nenhuma leitura encontrada
              </Text>
            </View>
          ) : (
            historicoOrdenado.map((leitura, i) => {
              const valor = leitura.readingValue ?? leitura.value ?? 0;
              const status = leitura.status || 'N/A';
              const sensorName = getSensorName(leitura.sensorId);
              
              return (
                <View key={leitura.id || i} style={HistStyles.card}>
                  <Text style={HistStyles.title}>
                    {sensorName}
                  </Text>
                  <Text style={{ fontSize: 16, marginVertical: 4 }}>
                    Valor: {typeof valor === 'number' ? valor.toFixed(2) : valor}
                  </Text>
                  <Text 
                    style={{ 
                      fontSize: 16, 
                      color: status === 'Alerta' ? '#FF6B6B' : '#4CAF50',
                      fontWeight: 'bold',
                      marginVertical: 4 
                    }}
                  >
                    Status: {status}
                  </Text>
                  <Text style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                    {new Date(leitura.timestamp).toLocaleString('pt-BR')}
                  </Text>
                </View>
              );
            })
          )}
        </ScrollView>
      )}
    </View>
  );
}
