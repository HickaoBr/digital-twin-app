import { StyleSheet } from "react-native";

const FlatListStyles = StyleSheet.create({
  nome: {
    fontSize: 26, // Aumentado de 22 para 26
    fontFamily: 'monospace',
    fontWeight: ['Lucida Console', 'bold'],
    marginBottom: 24, // Aumentado de 20 para 24
    color: '#180833'
  },
  valor: {
    fontSize: 20, // Aumentado de 18 para 20
    fontFamily: ['Lucida Console', 'bold'],
    fontWeight: 'bold',
    marginBottom: 8, // Aumentado de 6 para 8
    color: '#2C084C'
  },
  status: {
    fontSize: 20, // Aumentado de 18 para 20
    fontFamily: ['Lucida Console', 'bold'],
    fontWeight: 'bold',
  },
});


export default FlatListStyles