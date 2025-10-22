import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useState } from 'react';
import { styles } from '../../../../styles';
import { Homestyles } from '../styles';
import { useSensorContext } from '../../../context/SensorContext';

type BottomTabParamList = {
  Home: undefined;
  Sensores: undefined;
  Histórico: undefined;
};

const HomeScreen = () => {
  const navigation = useNavigation<BottomTabNavigationProp<BottomTabParamList>>();
  const { atualizarSensoresEEnviar } = useSensorContext();
  const [carregando, setCarregando] = useState(false);

  const iniciarApp = async () => {
    setCarregando(true);
    await atualizarSensoresEEnviar();
    setCarregando(false);
    navigation.navigate('Sensores');
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={Homestyles.Title} numberOfLines={1}>Bem-Vindo</Text>
        <Text style={Homestyles.Title}>ao</Text>
        <Text style={Homestyles.TitleWMB} numberOfLines={1}>Digital Twin</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={iniciarApp}
        disabled={carregando}
      >
        {carregando ? (
          <ActivityIndicator color="#180833" />
        ) : (
          <Text style={styles.buttonText}>Começar</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
