# Sistema de Inscrições - Feira de Empreendedorismo 2026

## Configuração do Banco de Dados

Este projeto utiliza Supabase como banco de dados. Para configurar corretamente:

### 1. Scripts SQL (Execute na ordem)

1. `scripts/001_create_registrations_table.sql` - Cria a tabela de inscrições
2. `scripts/002_create_workshop_limits_table.sql` - Cria a tabela de limites de oficinas
3. `scripts/003_seed_workshop_limits.sql` - Popula os limites iniciais das oficinas
4. `scripts/004_create_update_triggers.sql` - Cria triggers para atualização automática

### 2. Estrutura das Tabelas

#### Tabela `registrations`
- `id` (UUID) - Chave primária
- `nome_completo` (TEXT) - Nome completo do participante
- `email` (TEXT) - Email do participante
- `telefone` (TEXT) - Telefone de contato
- `escola` (TEXT) - Escola/instituição
- `dia` (TEXT) - Dia do evento escolhido
- `oficina` (TEXT) - Atividade selecionada (nome mantido por compatibilidade)
- `oficina_option` (TEXT) - Opção complementar, quando aplicável
- `presente` (BOOLEAN) - Status de presença
- `created_at` (TIMESTAMP) - Data de criação

#### Tabela `workshop_limits`
- `id` (UUID) - Chave primária
- `workshop_name` (TEXT) - Nome da atividade
- `workshop_option` (TEXT) - Opção específica da oficina
- `day` (TEXT) - Dia do evento
- `max_capacity` (INTEGER) - Capacidade máxima
- `current_registrations` (INTEGER) - Inscrições atuais
- `is_active` (BOOLEAN) - Status ativo/inativo
- `created_at` / `updated_at` (TIMESTAMP) - Timestamps

### 3. Funcionalidades

- ✅ Sistema de inscrições com validação
- ✅ Controle opcional de capacidade por atividade
- ✅ Dashboard administrativo completo
- ✅ Controle de presença
- ✅ Relatórios e estatísticas
- ✅ Impressão de listas
- ✅ Prevenção de inscrições duplicadas
- ✅ Row Level Security (RLS) configurado

### 4. APIs Disponíveis

- `POST /api/registrations` - Criar nova inscrição
- `GET /api/registrations` - Listar todas as inscrições
- `DELETE /api/registrations?id=<id>` - Excluir inscrição
- `PATCH /api/registrations/attendance` - Atualizar presença
- `GET /api/workshops-limits` - Listar limites das oficinas
- `PUT /api/workshops-limits` - Atualizar limite de oficina

### 5. Problemas Resolvidos

1. **Conexão com Supabase**: Criados clientes corretos para server-side e client-side
2. **Estrutura do Banco**: Tabelas criadas com RLS e políticas adequadas
3. **APIs**: Todas as rotas foram atualizadas para usar a nova estrutura
4. **Middleware**: Configurado para gerenciar sessões do Supabase
5. **Validação**: Sistema robusto de validação e controle de capacidade

### 6. Variáveis de Ambiente Necessárias

- `NEXT_PUBLIC_SUPABASE_URL` - URL do projeto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Chave anônima do Supabase
- `SUPABASE_SERVICE_ROLE_KEY` - Chave de service role para operações administrativas

O sistema está pronto para uso em produção no Vercel!
