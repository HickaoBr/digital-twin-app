import React, { createContext, useContext, useState, useEffect } from "react";
import { sendReading, getReadings, getSensors } from "../../api/readings";

const SensorContext = createContext();

export const SensorProvider = ({ children }) => {
  const [sensores, setSensores] = useState([]);
  const [historico, setHistorico] = useState([]);

  // Envia uma leitura para backend e atualiza histórico local
  const enviarLeituraBackend = async (leitura) => {
    try {
      const resposta = await sendReading(leitura);
      setHistorico((oldHistorico) => [...oldHistorico, resposta]);
    } catch (error) {
      console.error("Erro ao enviar leitura:", error);
    }
  };

  // Envia múltiplas leituras (array) para backend
  const enviarMultiplaLeitura = async (leituras) => {
    for (const leitura of leituras) {
      const dadoEnvio = {
        sensorId: leitura.id.toString(),
        value: parseFloat(leitura.valor),  // valor numérico
      };
      await enviarLeituraBackend(dadoEnvio);
    }
  };

  // Carrega histórico do backend
  const carregarHistoricoBackend = async () => {
    try {
      const dados = await getReadings();
      setHistorico(dados);
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
    }
  };

  // Carrega sensores a partir das leituras do backend (agrupa por sensorId) e associa nome do backend
  const carregarSensoresBackend = async () => {
    try {
      const [readings, sensoresBackend] = await Promise.all([
        getReadings(),
        getSensors(),
      ]);
      
      // Se não conseguiu dados do backend, usar fallback
      if (!readings || readings.length === 0) {
        console.log('Backend indisponível, usando dados offline');
        const sensoresFallback = [
          {"id": "1", "nome": "Sensor de Pressão", "valor": "3.25", "status": "OK"},
          {"id": "2", "nome": "Sensor Magnético", "valor": "1", "status": "OK"},
          {"id": "3", "nome": "Sensor Indutivo", "valor": "0", "status": "OK"},
          {"id": "123", "nome": "Sensor de Teste", "valor": "2.87", "status": "OK"}
        ];
        setSensores(sensoresFallback);
        return;
      }
      // Mapeia sensorId -> nome
      const nomesSensores = {};
      sensoresBackend.forEach((sensor) => {
        nomesSensores[sensor.id] = sensor.nome || `Sensor ${sensor.id}`;
      });
      // Agrupa por sensorId e pega o último valor
      const sensoresMap = {};
      readings.forEach((reading) => {
        const id = reading.sensorId?.toString();
        if (!id) return;
        if (!sensoresMap[id] || new Date(reading.timestamp) > new Date(sensoresMap[id].timestamp)) {
          sensoresMap[id] = reading;
        }
      });
      const sensoresFormatados = Object.values(sensoresMap).map((reading) => {
        const rawValue = reading.readingValue ?? reading.value;
        const valor = rawValue?.toFixed ? rawValue.toFixed(2) : String(rawValue);
        const limite = 3.5; // exemplo de limite para alerta
        return {
          id: reading.sensorId?.toString(),
          nome: nomesSensores[reading.sensorId?.toString()] || `Sensor ${reading.sensorId}`,
          valor,
          status: Number(rawValue) > limite ? 'Alerta' : 'OK',
        };
      });
      setSensores(sensoresFormatados);
    } catch (error) {
      console.error("Erro ao carregar sensores:", error);
      // Fallback para dados offline em caso de erro
      console.log('Usando dados offline devido a erro');
      const sensoresFallback = [
        {"id": "1", "nome": "Sensor de Pressão", "valor": "3.25", "status": "OK"},
        {"id": "2", "nome": "Sensor Magnético", "valor": "1", "status": "OK"},
        {"id": "3", "nome": "Sensor Indutivo", "valor": "0", "status": "OK"},
        {"id": "123", "nome": "Sensor de Teste", "valor": "2.87", "status": "OK"}
      ];
      setSensores(sensoresFallback);
    }
  };

  // Atualiza sensores buscando do backend
  const atualizarSensoresEEnviar = async () => {
    await carregarSensoresBackend();
  };

  useEffect(() => {
    carregarSensoresBackend();
    carregarHistoricoBackend();
  }, []);

  return (
    <SensorContext.Provider
      value={{
        sensores,
        historico,
        setSensores,
        atualizarSensoresEEnviar,
      }}
    >
      {children}
    </SensorContext.Provider>
  );
};

export const useSensorContext = () => useContext(SensorContext);
