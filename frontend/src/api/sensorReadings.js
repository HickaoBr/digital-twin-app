import apiClient from '../utils/api/apiClient';

// GET histórico de um sensor específico
export async function getSensorReadings(sensorId) {
  try {
    console.log('Buscando histórico do sensor:', sensorId);
    const data = await apiClient.get(`/api/readings/${sensorId}`);
    console.log(`Histórico recebido (${data.length} leituras):`, data);
    
    // Ordenar por timestamp (mais recente primeiro)
    const sorted = data.sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
    
    return sorted;
  } catch (err) {
    console.error('Erro ao buscar histórico do sensor:', err);
    // Fallback para dados offline
    console.log('Usando histórico offline para sensor', sensorId);
    const readingsFallback = [
      {"id": 1, "sensorId": "1", "readingValue": 3.25, "timestamp": "2025-09-29T15:30:00"},
      {"id": 2, "sensorId": "1", "readingValue": 4.12, "timestamp": "2025-09-29T15:35:00"},
      {"id": 3, "sensorId": "2", "readingValue": 1, "timestamp": "2025-09-29T15:30:00"},
      {"id": 4, "sensorId": "2", "readingValue": 0, "timestamp": "2025-09-29T15:35:00"},
      {"id": 5, "sensorId": "3", "readingValue": 0, "timestamp": "2025-09-29T15:30:00"},
      {"id": 6, "sensorId": "123", "readingValue": 2.87, "timestamp": "2025-09-29T15:30:00"}
    ];
    return readingsFallback.filter(reading => reading.sensorId === String(sensorId));
  }
}
