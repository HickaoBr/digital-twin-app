import React, { useEffect, useState } from 'react';
import { SafeAreaView, TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import ListaHorizontal from '../../../components/ListaHorizontal';
import { useSensorContext } from '../../../context/SensorContext';
import { sendReading } from '../../../api/readings';
import Toast from 'react-native-toast-message';


const SensorScreen = () => {
  const { sensores, atualizarSensoresEEnviar } = useSensorContext();
  const [loading, setLoading] = useState(false);
  const [registrando, setRegistrando] = useState(false);

  const atualizarDados = async () => {
    setLoading(true);
    await atualizarSensoresEEnviar();
    setLoading(false);
  };

  const registrarTodasLeituras = async () => {
    if (sensores.length === 0) {
      Toast.show({
        type: 'warning',
        text1: 'Aviso',
        text2: 'Nenhum sensor disponível',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    setRegistrando(true);
    
    try {
      let sucessos = 0;
      let erros = 0;

      for (const sensor of sensores) {
        try {
          const valorAtual = parseFloat(sensor.valor);
          
          // Se conseguiu converter e é válido, usa o valor atual
          // Senão, gera aleatório genérico
          const valorGerado = !isNaN(valorAtual) ? valorAtual : Math.random() * 10;
          
          const leitura = {
            sensorId: String(sensor.id),
            readingValue: valorGerado,
            timestamp: new Date().toISOString()
          };
          
          await sendReading(leitura);
          sucessos++;
        } catch (err) {
          erros++;
        }
      }

      if (erros === 0) {
        Toast.show({
          type: 'success',
          text1: 'Sucesso!',
          text2: `${sucessos} leituras registradas com sucesso`,
          position: 'top',
          visibilityTime: 3000,
        });
      } else if (sucessos > 0) {
        Toast.show({
          type: 'warning',
          text1: 'Parcialmente Concluído',
          text2: `${sucessos} sucessos, ${erros} erros`,
          position: 'top',
          visibilityTime: 4000,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Erro ao Registrar',
          text2: 'Verifique sua conexão e autenticação',
          position: 'top',
          visibilityTime: 4000,
        });
      }

      // Atualizar dados após registrar
      setTimeout(() => {
        atualizarDados();
      }, 500);
    
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro Crítico',
        text2: error.message || 'Não foi possível registrar leituras',
        position: 'top',
        visibilityTime: 5000,
      });
    } finally {
      setRegistrando(false);
    }
  };

  useEffect(() => {
    atualizarDados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0A0E27' }}>
      {loading ? (
        <ActivityIndicator size="large" color="#4A90E2" style={{ marginTop: 40 }} />
      ) : (
        <ListaHorizontal data={sensores} />
      )}

      <View style={{ padding: 10, gap: 10 }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#4A90E2',
            padding: 14,
            borderRadius: 12,
            alignItems: 'center',
            elevation: 3,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          }}
          onPress={atualizarDados}
          disabled={loading || registrando}
        >
          <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 16 }}>
            {loading ? 'Atualizando...' : 'Atualizar Dados'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: '#4CAF50',
            padding: 14,
            borderRadius: 12,
            alignItems: 'center',
            elevation: 3,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            opacity: registrando ? 0.6 : 1,
          }}
          onPress={registrarTodasLeituras}
          disabled={loading || registrando}
        >
          {registrando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 16 }}>
              Registrar Leitura de Todos os Sensores
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SensorScreen;
