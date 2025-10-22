# Digital Twin App - Sprint 4

---

## Pré-requisitos

- **Java 21**
- **Maven 3.9+**
- **Docker Desktop** (para MySQL)
- **Node.js 18+** (para frontend React Native)
- **Expo CLI** (`npm install -g expo-cli`)

---

## Como Rodar o Projeto

### **Backend (Spring Boot + MySQL)**

# Iniciar MySQL via Docker
docker-compose up -d

# Abra no inteliJ
Rode o arquivo DigitalTwinAppApplication

# OU :
mvn spring-boot:run

### **Frontend (React Native + Expo)**

# Instalar dependências
npm install

# Configurar URL da API
# Abrir frontend/src/utils/api/apiUrl.js
# Inserir seu IPv4 (obter com 'ipconfig' no terminal)

# Executar o app
npx expo start

---

## Autenticação

### **Endpoints Públicos:**
- `POST /auth/login` - Login de usuário
- `POST /auth/register` - Registro de novo usuário

### **Endpoints Protegidos (requerem JWT):**
- `GET /api/readings` - Listar todas as leituras
- `POST /api/readings` - Registrar nova leitura
- `GET /api/readings/{sensorId}` - Leituras por sensor
- `GET /api/sensors` - Listar sensores

**Exemplo de Login:**
```json
POST http://localhost:8080/auth/login
{
  "username": "admin",
  "password": "admin123"
}
```

**Resposta:**
```json
{
  "token": "eyJhbGciOiJIUzI1Ni...",
  "username": "admin",
  "message": "Login realizado com sucesso!"
}
```

---

## Banco de Dados

**MySQL** (via Docker Compose):
- Host: `localhost:3306`
- Database: `digital_twin_db`
- Usuário: `digital_twin_user`
- Senha: `digital_twin_pass`

Para parar o MySQL:
```bash
docker-compose down
```

---

## Funcionalidades

### **Backend:**
✅ Autenticação JWT com Spring Security  
✅ Banco de dados MySQL persistente  
✅ CRUD completo de leituras de sensores  
✅ Validação de dados com Bean Validation  

### **Frontend:**
✅ Tela de Login/Registro com validação  
✅ Dashboard com múltiplos sensores  
✅ Mensagens de feedback (Toast)  
✅ Armazenamento seguro de token JWT  
✅ Tela de histórico de leituras  

---

---

## 👥 Integrantes

Humberto Martins |	RM: 551602

Gustavo Della Rocca |  RM: 551595

Maria Eduarda Paranhos |  RM: 98138

Rodrigo Cordeiro | RM: 97808

Eduardo Alves | RM: 98016

---