# Frota

MVP web para gestão da frota da Polícia Militar de Blumenau, com foco em dashboard, cadastro de viaturas, manutenção preventiva, ordens de serviço, histórico, rastreamento e controle de acesso por perfil.

## Stack

- React + Vite
- TypeScript/TSX
- Tailwind CSS
- Leaflet + OpenStreetMap para o mapa
- Persistência local em `localStorage` para demonstração do MVP

## Funcionalidades entregues

- Dashboard com cards, gráficos e KPIs de disponibilidade, MTTR, MTBF e custo por viatura
- CRUD de viaturas com ações explícitas de criar, editar, excluir e visualizar
- Plano de manutenção preventiva com seed inicial, agendamento simples por data/KM e alertas verde/amarelo/vermelho
- Ordens de serviço com abertura, andamento, finalização e impressão
- Histórico de manutenção por viatura com custos, peças, revisões e indisponibilidade
- Rastreamento em tempo real com Leaflet + OpenStreetMap e atualização periódica simulada
- Relatórios com filtros e exportação simples em CSV/PDF
- Controle de acesso por perfil: Administrador, Gestor, Mecânico e Policial

## Como executar

```bash
npm install
npm run dev
```

Para gerar a build de produção:

```bash
npm run build
```

## Acesso de demonstração

A tela inicial exige autenticação básica. Use qualquer usuário ativo da própria lista e informe a matrícula exibida para entrar.

Perfis disponíveis no seed:

- Administrador
- Gestor
- Mecânico
- Policial

## Observações do MVP

- Os dados são persistidos no navegador para facilitar demonstração local.
- O rastreamento usa polling com posições simuladas, já preparado para futura integração com GPS real.
- A exportação “Excel” do MVP é entregue como CSV compatível com planilhas.
