import { getApiUrl } from '../utils/api/apiUrl';

// GET histórico de um sensor específico
export async function getSensorReadings(sensorId) {
  try {
    const baseUrl = await getApiUrl();
    const res = await fetch(`${baseUrl}/api/readings/${sensorId}`);
    if (!res.ok) throw new Error('Erro ao buscar histórico do sensor');
    return await res.json();
  } catch (err) {
    console.error(err);
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
    return readingsFallback.filter(reading => reading.sensorId === sensorId);
  }
}
