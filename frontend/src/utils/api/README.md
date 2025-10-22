# API URL Helper

Este utilitário permite salvar, ler e remover a URL base da API usando AsyncStorage.

- `setApiUrl(url)`: Salva a URL.
- `getApiUrl()`: Retorna a URL salva ou 'http://localhost:8080' se não houver.
- `removeApiUrl()`: Remove a URL salva.

Utilize este helper em todas as chamadas de API para garantir que o app use a URL configurada pelo usuário.
