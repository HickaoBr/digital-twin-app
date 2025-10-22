import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../../../styles';
import { Splashstyles } from './styles';

export default function SplashScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Main');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/logo.png')}
        style={Splashstyles.logo}
        resizeMode="contain"
      />
      <Text style={Splashstyles.subtitle}>Carregando...</Text>
    </View>
  );
}
