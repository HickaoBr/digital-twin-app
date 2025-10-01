
import { getApiUrl } from '../utils/api/apiUrl';

// POST nova leitura
export async function sendReading(reading) {
  try {
    const baseUrl = await getApiUrl();
    console.log('Enviando leitura:', reading);
    const res = await fetch(`${baseUrl}/api/readings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reading),
    });
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Erro HTTP:', res.status, errorText);
      throw new Error(`Erro ao enviar leitura: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error('Erro na API sendReading:', err);
    throw err; // Re-throw para ser tratado no componente
  }
}

// POST novo sensor
export async function createSensor(sensor) {
  try {
    const baseUrl = await getApiUrl();
    const res = await fetch(`${baseUrl}/api/sensors`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sensor),
    });
    if (!res.ok) throw new Error("Erro ao criar sensor");
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}

// GET leituras
export async function getReadings() {
  try {
    const baseUrl = await getApiUrl();
    const res = await fetch(`${baseUrl}/api/readings`);
    if (!res.ok) throw new Error("Erro ao buscar leituras");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

// GET sensores
export async function getSensors() {
  try {
    const baseUrl = await getApiUrl();
    const res = await fetch(`${baseUrl}/api/sensors`);
    if (!res.ok) throw new Error("Erro ao buscar sensores");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}
