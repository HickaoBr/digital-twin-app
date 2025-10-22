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
      // Mapeia sensorId -> nome e tipo
      const dadosSensores = {};
      sensoresBackend.forEach((sensor) => {
        dadosSensores[sensor.id] = {
          nome: sensor.nome || `Sensor ${sensor.id}`,
          tipo: sensor.tipo
        };
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
        const sensorId = reading.sensorId?.toString();
        const tipo = dadosSensores[sensorId]?.tipo;
        let status = reading.status || "OK"; // Usa status do backend se disponível
        let valor;
        
        // Se o backend não enviou status, calcula baseado no tipo do sensor
        if (!reading.status) {
          if (tipo === "pressao") {
            // Sensor de Pressão: Alerta se valor > 9
            valor = rawValue?.toFixed ? rawValue.toFixed(2) : String(rawValue);
            if (Number(rawValue) > 9) {
              status = "Alerta";
            }
          } else if (tipo === "magnetico" || tipo === "indutivo") {
            // Sensores Magnético/Indutivo: Alerta se inativo (0)
            valor = rawValue === 1 || rawValue === 1.0 ? "1" : "0";
            if (rawValue === 0 || rawValue === 0.0) {
              status = "Alerta";
            }
          } else {
            // Tipo desconhecido - formato genérico
            valor = rawValue?.toFixed ? rawValue.toFixed(2) : String(rawValue);
          }
        } else {
          // Backend enviou status, apenas formata o valor
          if (tipo === "magnetico" || tipo === "indutivo") {
            valor = rawValue === 1 || rawValue === 1.0 ? "1" : "0";
          } else {
            valor = rawValue?.toFixed ? rawValue.toFixed(2) : String(rawValue);
          }
        }
        
        return {
          id: sensorId,
          nome: dadosSensores[sensorId]?.nome || `Sensor ${sensorId}`,
          valor,
          status,
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
    await carregarHistoricoBackend();
  };

  // Atualiza apenas o histórico
  const atualizarHistorico = async () => {
    await carregarHistoricoBackend();
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
        atualizarHistorico,
      }}
    >
      {children}
    </SensorContext.Provider>
  );
};

export const useSensorContext = () => useContext(SensorContext);
