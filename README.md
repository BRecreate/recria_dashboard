# Dashboard do Agente de IA - Versão Completa

## 🚀 Visão Geral

Este é um dashboard completo para monitoramento de métricas do seu Agente de IA desenvolvido em n8n. O sistema oferece visualização em tempo real de todas as interações, agendamentos, leads e performance do agente.

### ✨ Funcionalidades Principais

- **📊 Métricas Avançadas**: Monitoramento completo de clientes, reuniões e performance
- **📈 Análise de Tendências**: Gráficos temporais e horários de pico
- **🎯 Performance**: Taxa de conversão, tempo de agendamento e tópicos mais abordados
- **📋 Detalhes**: Lista de clientes recentes e próximas reuniões
- **🔄 Tempo Real**: Atualização automática a cada 30 segundos
- **📱 Responsivo**: Interface adaptável para desktop e mobile

### 🏗️ Arquitetura

- **Backend**: Node.js + Express + Google APIs
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui
- **Dados**: Google Sheets (leads) + Google Calendar (reuniões)
- **Gráficos**: Recharts para visualizações interativas

## 📦 Estrutura do Projeto

```
dashboard-agente-ia/
├── server.js              # Servidor backend
├── package.json           # Dependências do backend
├── .env                   # Variáveis de ambiente
├── credentials.json       # Credenciais do Google (você deve criar)
├── frontend/              # Aplicação React
│   ├── src/
│   │   ├── App.jsx       # Componente principal
│   │   ├── App.css       # Estilos
│   │   └── components/   # Componentes UI
│   ├── package.json      # Dependências do frontend
│   ├── .env.development  # Variáveis de desenvolvimento
│   └── .env.production   # Variáveis de produção
└── README.md             # Este arquivo
```

## 🛠️ Instalação e Configuração

### Pré-requisitos

- Node.js 18+ instalado
- pnpm instalado (`npm install -g pnpm`)
- Conta Google Cloud com APIs habilitadas
- Acesso às planilhas Google Sheets e Google Calendar do seu agente

### 1. Configuração do Backend

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com seus dados
```

### 2. Configuração das Credenciais do Google

#### 2.1. Criar Projeto no Google Cloud Console

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Habilite as seguintes APIs:
   - Google Sheets API
   - Google Calendar API

#### 2.2. Criar Conta de Serviço

1. Vá para "IAM & Admin" > "Service Accounts"
2. Clique em "Create Service Account"
3. Preencha os dados:
   - **Nome**: `dashboard-agente-ia`
   - **Descrição**: `Conta de serviço para o dashboard do agente de IA`
4. Clique em "Create and Continue"
5. Adicione as seguintes roles:
   - `Viewer` (para leitura básica)
6. Clique em "Done"

#### 2.3. Gerar Chave JSON

1. Na lista de contas de serviço, clique na conta criada
2. Vá para a aba "Keys"
3. Clique em "Add Key" > "Create new key"
4. Selecione "JSON" e clique em "Create"
5. Salve o arquivo baixado como `credentials.json` na raiz do projeto

#### 2.4. Configurar Permissões

**Para Google Sheets:**
1. Abra sua planilha de leads
2. Clique em "Compartilhar"
3. Adicione o email da conta de serviço (encontrado no arquivo `credentials.json`)
4. Defina permissão como "Viewer"

**Para Google Calendar:**
1. Abra Google Calendar
2. Vá para "Configurações" > "Configurações de calendários"
3. Selecione o calendário usado pelo agente
4. Em "Compartilhar com pessoas específicas", adicione o email da conta de serviço
5. Defina permissão como "Ver todos os detalhes do evento"

### 3. Configuração do Frontend

```bash
# Navegar para o diretório do frontend
cd frontend

# Instalar dependências
pnpm install

# Configurar variáveis de ambiente para produção
# Edite o arquivo .env.production com a URL do seu backend
```

### 4. Configuração das Variáveis de Ambiente

#### Backend (.env)
```env
PORT=3000
GOOGLE_SHEETS_ID=sua_planilha_id_aqui
GOOGLE_CALENDAR_ID=seu_email_calendario_aqui
NODE_ENV=production
```

#### Frontend (.env.production)
```env
VITE_API_URL=https://seu-dominio-backend.com
```

**Como obter os IDs:**

- **Google Sheets ID**: Na URL da planilha, é a parte entre `/d/` e `/edit`
  - Exemplo: `https://docs.google.com/spreadsheets/d/1ABC123.../edit`
  - ID: `1ABC123...`

- **Google Calendar ID**: Geralmente é o seu email ou ID específico do calendário
  - Para calendário principal: use seu email do Google
  - Para calendários específicos: vá em Configurações > Configurações de calendários > ID do calendário

## 🚀 Execução

### Desenvolvimento

```bash
# Terminal 1 - Backend
npm start

# Terminal 2 - Frontend
cd frontend
pnpm run dev
```

Acesse: `http://localhost:5173`

### Produção

#### Opção 1: Servidor Único (Recomendado para pequenos projetos)

```bash
# Build do frontend
cd frontend
pnpm run build

# Servir arquivos estáticos pelo backend (adicione middleware)
npm start
```

#### Opção 2: Servidores Separados

**Backend:**
```bash
npm start
```

**Frontend:**
```bash
cd frontend
pnpm run build
# Deploy dos arquivos da pasta 'dist' para seu servidor web
```

## 🌐 Deploy em Produção

### Backend (Node.js)

**Opções recomendadas:**
- **Railway**: Deploy automático via Git
- **Render**: Plano gratuito disponível
- **DigitalOcean App Platform**: Fácil configuração
- **AWS EC2**: Maior controle
- **Google Cloud Run**: Serverless

**Configuração básica:**
1. Faça push do código para um repositório Git
2. Configure as variáveis de ambiente na plataforma
3. Adicione o arquivo `credentials.json` via upload seguro
4. Configure o comando de start: `npm start`

### Frontend (React)

**Opções recomendadas:**
- **Vercel**: Deploy automático, ideal para React
- **Netlify**: Simples e gratuito
- **GitHub Pages**: Para projetos open source
- **AWS S3 + CloudFront**: Para maior escala

**Configuração básica:**
1. Build do projeto: `pnpm run build`
2. Upload da pasta `dist` para o serviço escolhido
3. Configure a variável `VITE_API_URL` com a URL do backend

## 📊 Métricas Disponíveis

### 📈 Visão Geral
- **Total de Clientes**: Número único de clientes atendidos
- **Novos vs Recorrentes**: Segmentação de clientes
- **Reuniões Agendadas**: Total de reuniões confirmadas
- **Taxa de Sucesso**: Percentual de agendamentos bem-sucedidos
- **Média de Mensagens**: Mensagens por interação

### 📊 Tendências
- **Contatos Diários**: Evolução de novos contatos
- **Horários de Pico**: Distribuição por horário
- **Tendências de Reuniões**: Agendadas, reagendadas, canceladas

### 🎯 Performance
- **Tempo para Agendamento**: Média em dias
- **Taxa de Conversão**: Lead para reunião
- **Status de Leads**: Distribuição por qualificação
- **Tópicos Abordados**: Principais assuntos
- **Resposta por Dia**: Eficiência semanal

### 📋 Detalhes
- **Clientes Recentes**: Lista dos últimos contatos
- **Próximas Reuniões**: Agendamentos confirmados

## 🔧 Personalização

### Adicionando Novas Métricas

1. **Backend**: Adicione endpoint em `server.js`
```javascript
app.get("/api/dashboard/nova-metrica", async (req, res) => {
  // Sua lógica aqui
  res.json(dados);
});
```

2. **Frontend**: Adicione componente em `App.jsx`
```jsx
const [novaMetrica, setNovaMetrica] = useState(null);

// No useEffect
const novaMetricaRes = await fetch(`${API_BASE_URL}/api/dashboard/nova-metrica`);
const novaMetricaData = await novaMetricaRes.json();
setNovaMetrica(novaMetricaData);
```

### Modificando Cores e Estilos

- **Cores dos gráficos**: Modifique a constante `COLORS` em `App.jsx`
- **Tema**: Edite as variáveis CSS em `App.css`
- **Layout**: Ajuste as classes Tailwind nos componentes

### Configurando Intervalos de Atualização

Modifique o intervalo em `App.jsx`:
```javascript
// Atualizar a cada 60 segundos em vez de 30
const interval = setInterval(fetchData, 60000)
```

## 🔒 Segurança

### Boas Práticas Implementadas

- **Credenciais**: Arquivo `credentials.json` não versionado
- **CORS**: Configurado para permitir apenas origens autorizadas
- **Variáveis de Ambiente**: Dados sensíveis em `.env`
- **Validação**: Tratamento de erros nas APIs

### Recomendações Adicionais

- Use HTTPS em produção
- Configure firewall para limitar acesso ao backend
- Monitore logs de acesso
- Implemente rate limiting se necessário

## 🐛 Solução de Problemas

### Erro: "credentials.json não encontrado"
- Verifique se o arquivo está na raiz do projeto
- Confirme se as permissões estão corretas

### Erro: "Acesso negado ao Google Sheets/Calendar"
- Verifique se a conta de serviço tem permissões
- Confirme se os IDs estão corretos no `.env`

### Frontend não conecta com Backend
- Verifique se `VITE_API_URL` está correto
- Confirme se o backend está rodando
- Verifique configurações de CORS

### Dados não aparecem
- Verifique se há dados nas fontes (Sheets/Calendar)
- Confirme se a estrutura da planilha está correta
- Verifique logs do backend para erros

## 📞 Suporte

Para dúvidas ou problemas:

1. Verifique os logs do backend e frontend
2. Confirme se todas as configurações estão corretas
3. Teste as APIs do Google separadamente
4. Verifique se as dependências estão atualizadas

## 📝 Changelog

### Versão 2.0.0
- ✅ Métricas avançadas implementadas
- ✅ Interface completamente redesenhada
- ✅ Gráficos interativos com Recharts
- ✅ Dados em tempo real
- ✅ Responsividade mobile
- ✅ Sistema de abas para organização
- ✅ Integração completa com Google APIs

### Próximas Funcionalidades
- 🔄 Filtros por período personalizado
- 📧 Alertas por email
- 📊 Exportação de relatórios
- 🔍 Busca e filtros avançados
- 📱 Aplicativo mobile

---

**Desenvolvido com ❤️ para otimizar seu Agente de IA**

