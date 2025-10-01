# Digital Twin Full Stack Application

Este projeto é uma aplicação completa de Digital Twin (Gêmeo Digital) desenvolvida com Spring Boot no backend e React Native no frontend.

## 📁 Estrutura do Projeto

```
digital-twin-project/
├── backend/              # Spring Boot API
│   ├── src/
│   ├── pom.xml
│   └── README.md
└── frontend/             # React Native App
    ├── src/
    ├── package.json
    └── README.md
```

## 🚀 Tecnologias Utilizadas

### Backend (Spring Boot)
- **Java 17+**
- **Spring Boot 3.5.0**
- **Spring Data JPA**
- **H2 Database** (persistência em arquivo)
- **CORS** configurado para integração com frontend
- **Maven** para gerenciamento de dependências

### Frontend (React Native)
- **React Native** com Expo
- **TypeScript**
- **React Navigation** para navegação
- **Victory Native** para gráficos
- **AsyncStorage** para persistência local
- **Fetch API** para comunicação com backend

## 🌟 Funcionalidades

### Backend API
- ✅ **GET /api/readings** - Lista todas as leituras
- ✅ **POST /api/readings** - Cadastra nova leitura
- ✅ **GET /api/readings/{sensorId}** - Busca leituras por sensor
- ✅ **CORS habilitado** para chamadas externas
- ✅ **Persistência H2** funcionando
- ✅ **Valores mockados** baseados no tipo do sensor

### Frontend Mobile
- ✅ **Lista de Sensores** com dados reais do backend
- ✅ **Tela de Configuração** para alterar URL da API
- ✅ **Detalhes do Sensor** com histórico e gráficos
- ✅ **Loading spinners** durante carregamento
- ✅ **Fallback offline** quando backend indisponível
- ✅ **Botões para atualizar** e **registrar leituras**

## 🔧 Como Executar

### Backend
```bash
cd backend
./mvnw spring-boot:run
```
O servidor estará disponível em: `http://localhost:8080`

### Frontend
```bash
cd frontend
npm install
npm start
```

### Configuração da Integração
1. Inicie o backend na porta 8080
2. No app móvel, vá em **Configurações**
3. Configure a URL: `http://SEU_IP:8080` (substitua SEU_IP pelo IP da máquina)
4. Para emulador Android: `http://10.0.2.2:8080`
5. Para simulador iOS: `http://localhost:8080`

## 📱 Testando a Integração

### Usando cURL
```bash
# Listar leituras
curl http://localhost:8080/api/readings

# Criar nova leitura
curl -X POST http://localhost:8080/api/readings \
  -H "Content-Type: application/json" \
  -d '{"sensorId": "1"}'
```

### Usando Postman
- **GET** `http://localhost:8080/api/readings`
- **POST** `http://localhost:8080/api/readings` com body JSON:
  ```json
  {
    "sensorId": "1"
  }
  ```

## 🔗 Integração Backend/Frontend

A aplicação está totalmente integrada:
- Frontend faz requisições reais para o backend
- Sistema de fallback para quando backend está offline  
- Configuração dinâmica da URL da API
- Tratamento de erros e loading states
- Dados persistem no banco H2 do backend

## 📊 Console H2

Para acessar o console do banco de dados:
- URL: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:file:./data/readings`
- Username: `sa`
- Password: (vazio)

## 🤝 Contribuindo

Este projeto foi desenvolvido como parte de um sprint de desenvolvimento full-stack, demonstrando a integração completa entre backend Spring Boot e frontend React Native.

---

**Projeto Digital Twin - Sprint 3** 🚀