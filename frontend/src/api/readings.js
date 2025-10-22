import apiClient from '../utils/api/apiClient';

// POST nova leitura
export async function sendReading(reading) {
  try {
    console.log('[readings.js] Enviando leitura:', reading);
    
    // Garantir formato correto
    const payload = {
      sensorId: String(reading.sensorId), // Garantir que é string
      readingValue: parseFloat(reading.readingValue) || 0,
      timestamp: reading.timestamp || new Date().toISOString()
    };
    
    console.log('[readings.js] Payload formatado:', payload);
    const data = await apiClient.post('/api/readings', payload);
    console.log('[readings.js] Resposta do backend:', data);
    return data;
  } catch (err) {
    console.error('[readings.js] Erro na API sendReading:', err);
    console.error('[readings.js] Mensagem do erro:', err.message);
    throw err; // Re-throw para ser tratado no componente
  }
}

// POST novo sensor
export async function createSensor(sensor) {
  try {
    const data = await apiClient.post('/api/sensors', sensor);
    return data;
  } catch (err) {
    console.error('Erro ao criar sensor:', err);
    throw err;
  }
}

// GET leituras
export async function getReadings() {
  try {
    const data = await apiClient.get('/api/readings');
    return data;
  } catch (err) {
    console.error('Erro ao buscar leituras:', err);
    return [];
  }
}

// GET sensores
export async function getSensors() {
  try {
    const data = await apiClient.get('/api/sensors');
    return data;
  } catch (err) {
    console.error('Erro ao buscar sensores:', err);
    return [];
  }
}
