# 📱 Digital Twin - Entrega 2

## 🚀 Como executar o projeto
✅ Pré-requisitos
Java 21

Maven 3.9+

Postman ou ferramenta similar (para testar a API)

(Opcional) Frontend configurado

--- 

## 🧱 Como Rodar:

- Baixe o arquivo.zip (entrega-2)
- Abra no inteliJ
- Rode o arquivo DigitalTwinAppApplication

--- 

## 🗃️ Localização do Arquivo H2:
data/readings.mv.db

--- 

## 🌐 Endpoints disponíveis:

| Método | Endpoint                          | Descrição                           |
| ------ | --------------------------------- | ----------------------------------- |
| GET    | `/api/readings`                   | Lista todas as leituras registradas |
| GET    | `/api/readings/sensor/{sensorId}` | Lista leituras por ID do sensor     |
| POST   | `/api/readings`                   | Registra uma nova leitura           |

--- 
## 📡 Exemplo de requisição curl

curl -X POST http://localhost:8080/api/readings \
-H "Content-Type: application/json" \
-d '{
  "sensorId": "sensor-01",
  "value": 22.5,
  "timestamp": "2025-06-17T14:30:00"
}'

---

## Testes no Postman:

### **GET:**
![image](https://github.com/user-attachments/assets/7c7f1c7d-8c87-4e86-854f-94bbf2b4e324)


### **POST:**
![image](https://github.com/user-attachments/assets/e6abc392-d3b5-4f3b-9ffb-22536d51707e)


--- 

## Para testes com o frontend:
- Baixar o arquivo.zip (main) 
- Rodar o Backend
- rodar o ipconfig no terminal e colocar o Endereço iPv4 por exemplo: 192.168.0.105
- Abrir o arquivo api/readinsg.js
- colocar seu endereço iPv4 aqui:

  **const API_URL = 'http://SEU-ENDEREÇO-IPV4:8080/api'**;
- Rodar o frontend com nxp expo start
- com o Backend rodando basta clickar em "começar"
- para atualizar dados dos sensores clickar em "Atualizar dados" que além de gerar novos dados também salva os dados atuais no histórico
  

---

## 👥 Integrantes

Humberto Martins |	RM: 551602

Gustavo Della Rocca |  RM: 551595

Maria Eduarda Paranhos |  RM: 98138

Rodrigo Cordeiro | RM: 97808

Eduardo Alves | RM: 98016
