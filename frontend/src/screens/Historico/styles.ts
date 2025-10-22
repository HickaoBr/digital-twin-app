import { StyleSheet } from 'react-native';

export const HistStyles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20,
    backgroundColor: '#fff' },
  title: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 10 },
  card: {
    backgroundColor: '#eee',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
  },
  nome: { 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  data: { 
    fontSize: 12, 
    color: '#555'
  },
});