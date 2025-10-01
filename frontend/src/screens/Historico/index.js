import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useSensorContext } from '../../context/SensorContext';
import { HistStyles } from './styles';

export default function HistoricoScreen() {
  const { historico } = useSensorContext();

  return (
    <ScrollView style={HistStyles.container}>
      {historico.map((leitura, i) => (
        <View key={i} style={HistStyles.card}>
          <Text style={HistStyles.title}>Leitura {historico.length - i}</Text>

          {Array.isArray(leitura) &&
            leitura.map((sensor, index) => {
              if (
                typeof sensor === 'object' &&
                typeof sensor.nome === 'string' &&
                typeof sensor.valor === 'string' &&
                typeof sensor.status === 'string'
              ) {
                return (
                  <Text key={sensor.id ?? index}>
                    {`${sensor.nome || '---'}: ${sensor.valor || '---'} - ${sensor.status || '---'}`}
                  </Text>
                );
              } else {
                console.warn('Sensor malformado:', sensor); 
                return (
                  <Text key={index} style={{ color: 'red' }}>
                    Sensor inválido
                  </Text>
                );
              }
            })}

        </View>
      ))}
    </ScrollView>
  );
}
