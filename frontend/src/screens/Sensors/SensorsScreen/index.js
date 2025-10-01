
import React, { useEffect, useState } from 'react';
import { SafeAreaView, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import ListaHorizontal from '../../../components/ListaHorizontal';
import { useSensorContext } from '../../../context/SensorContext';


const SensorScreen = () => {
  const { sensores, atualizarSensoresEEnviar } = useSensorContext();
  const [loading, setLoading] = useState(false);

  const atualizarDados = async () => {
    setLoading(true);
    await atualizarSensoresEEnviar();
    setLoading(false);
  };

  useEffect(() => {
    atualizarDados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#180833' }}>
      {loading ? (
        <ActivityIndicator size="large" color="#fff" style={{ marginTop: 40 }} />
      ) : (
        <ListaHorizontal data={sensores} />
      )}

      <TouchableOpacity
        style={{
          backgroundColor: '#fff',
          margin: 10,
          padding: 10,
          borderRadius: 10,
          alignItems: 'center',
        }}
        onPress={atualizarDados}
        disabled={loading}
      >
        <Text style={{ fontWeight: 'bold', color: '#180833' }}>
          {loading ? 'Atualizando...' : 'Atualizar Dados'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SensorScreen;
