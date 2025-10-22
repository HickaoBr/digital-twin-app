import React, { useMemo } from 'react';
import { FlatList, View, Dimensions, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FlatListStyles from './styles';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = Math.min(380, width * 0.35); // Aumentado de 320 para 380
const ITEM_MARGIN_HORIZONTAL = 16;
const CARD_WIDTH_WITH_MARGIN = ITEM_WIDTH + ITEM_MARGIN_HORIZONTAL * 2;

const ListaHorizontal = ({ data }) => {
  const navigation = useNavigation();
  const snapOffsets = useMemo(() => {
    return data.map((_, i) => i * CARD_WIDTH_WITH_MARGIN);
  }, [data]);

  const handlePress = (item) => {
    navigation.navigate('SensorDetail', {
      sensorId: item.id,
      sensorName: item.nome,
    });
  };

  const renderItem = ({ item }) => {
    const isValid =
      typeof item.nome === 'string' &&
      typeof item.valor === 'string' &&
      typeof item.status === 'string';

    return (
      <TouchableOpacity onPress={() => handlePress(item)}>
        <View style={[styles.card, !isValid && styles.invalidCard]}>
          <Text style={FlatListStyles.nome}>
            {isValid ? item.nome : 'Nome inválido'}
          </Text>
          <Text style={FlatListStyles.valor}>
            Valor: {isValid ? item.valor : 'Valor inválido'}
          </Text>
          <Text
            style={[
              FlatListStyles.status,
              { color: item.status === 'OK' ? 'green' : 'red' },
            ]}
          >
            Status: {isValid ? item.status : 'Status inválido'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToOffsets={snapOffsets}
        snapToAlignment="center"
        decelerationRate="fast"
        scrollEventThrottle={16}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: ITEM_MARGIN_HORIZONTAL, alignItems: 'center' }}
        style={{ maxWidth: '100%' }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F2D4F3',
    height: 220, // Aumentado de 180 para 220
    width: ITEM_WIDTH,
    marginHorizontal: ITEM_MARGIN_HORIZONTAL,
    borderRadius: 12,
    padding: 16, // Aumentado de 10 para 16
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    elevation: 4, // Aumentado para mais sombra
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    maxWidth: 380, // Aumentado de 320 para 380
  },
  invalidCard: {
    backgroundColor: '#FFF',
  },
});

export default ListaHorizontal;
