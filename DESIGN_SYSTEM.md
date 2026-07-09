# Design System - Frota Gestão de Frotas

## 🎨 1. Identidade Visual

### Paleta de Cores

| Cor | Código | Uso |
|-----|--------|-----|
| Azul Escuro (Principal) | `#1E3A5F` | Headers, botões primários, destaques |
| Branco | `#FFFFFF` | Fundos, cards, textos em elementos escuros |
| Verde (Sucesso) | `#27AE60` | Status concluído, alertas positivos, check |
| Amarelo (Alerta) | `#F39C12` | Alertas, atenção requerida, em progresso |
| Vermelho (Urgência) | `#E74C3C` | Manutenção urgente, deletar, erro |
| Cinza Claro (Separador) | `#ECF0F1` | Cards, separadores, backgrounds secundários |
| Cinza Médio | `#95A5A6` | Textos secundários, labels |
| Cinza Escuro | `#34495E` | Textos principais |

### Tipografia

- **Fontes Recomendadas**: Inter, Roboto ou Poppins
- **Hierarquia**:
  - **Títulos (H1)**: 32px, Bold, Cor Azul Escuro
  - **Subtítulos (H2)**: 24px, Semi-Bold, Cor Azul Escuro
  - **Textos (Body)**: 14px, Regular, Cor Cinza Escuro
  - **Legendas**: 12px, Regular, Cor Cinza Médio

---

## 📊 2. Componentes Principais

### Cards

```
┌─────────────────────────────┐
│  Título do Card             │
│  ─────────────────────────  │
│  Conteúdo                   │
│  [Botão] [Botão]            │
└─────────────────────────────┘
```

**Propriedades**:
- Border Radius: 8px
- Box Shadow: 0 2px 8px rgba(0,0,0,0.1)
- Padding: 16px
- Background: #FFFFFF

### Botões

| Tipo | Cor | Border Radius | Padding |
|------|-----|---------------|---------|
| Primário | Azul Escuro (#1E3A5F) | 6px | 12px 24px |
| Sucesso | Verde (#27AE60) | 6px | 12px 24px |
| Perigo | Vermelho (#E74C3C) | 6px | 12px 24px |
| Edição | Cinza (#95A5A6) | 6px | 12px 24px |

### Inputs

- Border: 1px solid #ECF0F1
- Border Radius: 4px
- Padding: 10px 12px
- Font Size: 14px
- Focus: Border color muda para Azul Escuro

---

## 🏠 3. Dashboard

### Layout da Dashboard

```
┌────────────────────────────────────────────────────┐
│ [Menu]  👤 João Silva  📅 09/07/2026  🔔 [3]      │
├────────────────────────────────────────────────────┤
│                                                    │
│  ┌──────────────┐ ┌──────────────┐ ┌────────────┐│
│  │🚓 Viaturas   │ │🔧 Manutenções│ │💰 Custos   ││
│  │    28        │ │     16       │ │ R$ 7.280   ││
│  │Disponíveis   │ │Em andamento  │ │do Mês      ││
│  └──────────────┘ └──────────────┘ └────────────┘│
│                                                    │
│  ┌────────────────────────┐ ┌──────────────────┐ │
│  │ Gráfico: Manutenções   │ │ Gráfico: Custos  │ │
│  │ por Tipo               │ │ por Veículo      │ │
│  └────────────────────────┘ └──────────────────┘ │
│                                                    │
│  Indicadores Rápidos                              │
│  • Viaturas Disponíveis: 28                       │
│  • Em Manutenção: 16                              │
│  • Fora de Serviço: 2                             │
│  • Próxima Revisão: 3                             │
│  • Custos do Mês: R$ 7.280                        │
│  • Custos do Ano: R$ 87.360                       │
│  • Disponibilidade da Frota: 93.3%                │
│  • Quilometragem Total: 450.320 km                │
│  • Alertas Críticos: 2                            │
│                                                    │
└────────────────────────────────────────────────────┘
```

### Indicadores (KPIs)

Cada indicador em um card separado com:
- Ícone (3x - 4x maior que texto)
- Número grande (28px, Bold)
- Rótulo descritivo (14px, Regular)
- Trend (opcional - ↑ verde ou ↓ vermelho)

---

## 🚗 4. Lista de Manutenções

### Card de Manutenção

```
┌──────────────────────────────────────┐
│ 🚓 GRA6R34 - Toyota Hilux            │
│ ────────────────────────────────────── │
│ Tipo: Preventiva                     │
│ Serviço: Motor                       │
│ Responsável: João Silva              │
│ Data: 05/07/2026                     │
│ Status: 🟢 Concluído                 │
│                                      │
│ [Editar] [Excluir] [Visualizar]     │
└──────────────────────────────────────┘
```

### Funcionalidades

- Pesquisa inteligente por: placa, patrimônio, motorista, modelo, batalhão
- Filtros em barra horizontal: Data, Status, Tipo, Batalhão, Modelo, Responsável
- Cards com animação ao hover (elevação suave)
- Paginação ou infinite scroll

---

## 📍 5. Página da Viatura

### Layout Detalhado

```
┌──────────────────────────────────────────────┐
│ [< Voltar]                          [Editar] │
├──────────────────────────────────────────────┤
│                                              │
│            🚓 (Imagem/Ícone)                │
│                                              │
│ Placa: KM-3456                              │
│ Modelo: Toyota Hilux 2020                   │
│ Patrimônio: GRA6R34                         │
│ Quilometragem Atual: 125.400 km             │
│                                              │
│ ┌──────────────────────────────────┐        │
│ │ Última Manutenção: 05/07/2026   │        │
│ │ Próxima Revisão: 20/08/2026     │        │
│ │ Status: 🟢 Operacional          │        │
│ └──────────────────────────────────┘        │
│                                              │
│ HISTÓRICO (Timeline)                        │
│ 2026                                         │
│ ● Troca de óleo (25/06/2026)                │
│   ↓                                         │
│ ● Troca dos pneus (15/07/2026)             │
│   ↓                                         │
│ ● Revisão dos freios (10/08/2026)          │
│                                              │
└──────────────────────────────────────────────┘
```

---

## 🎯 6. Menu Lateral

```
┌─────────────────┐
│ 🏠 Dashboard    │ (ativo)
│ 🚓 Viaturas     │
│ 🔧 Manutenções  │
│ 📍 Rastreamento │
│ 📈 Relatórios   │
│ 👤 Usuários     │
│ ⚙️  Configurações│
└─────────────────┘
```

**Propriedades**:
- Ícones: 24px x 24px
- Padding: 12px 16px
- Hover: Fundo Cinza Claro, texto fica mais escuro
- Ativo: Fundo Azul Escuro, texto Branco, borda esquerda Azul

---

## 🔝 7. Barra Superior (Top Bar)

```
┌─────────────────────────────────────────────────────────┐
│ [Ícone Menu] Frota | [🔍 Pesquisa] [🔔 3] [👤] [🌙]   │
└─────────────────────────────────────────────────────────┘
```

### Funcionalidades

- **Pesquisa**: Placeholder "Buscar veículos, manutenções..."
- **Notificações**: Badge com número, dropdown ao clicar
- **Usuário**: Dropdown com "Perfil", "Logout"
- **Modo Escuro**: Toggle (opcional para fase 2)

---

## 🔘 8. Botões Padronizados

```
┌─────────────────┬──────────────┬─────────────┬────────────┐
│ Primário        │ Sucesso      │ Editar      │ Perigo     │
│ [Confirmar]     │ [Salvar]     │ [Editar]    │ [Excluir]  │
│ Azul #1E3A5F    │ Verde #27AE60│ Cinza #95A5A6│ Verm #E74C3C
└─────────────────┴──────────────┴─────────────┴────────────┘
```

**Estados**:
- Normal: cor padrão
- Hover: 10% mais escuro
- Active/Pressed: 20% mais escuro
- Disabled: 50% opacidade, cursor não-permitido

---

## 🔍 9. Campos de Pesquisa

### Pesquisa Inteligente

```
┌─────────────────────────────────────┐
│ 🔍 Pesquisar...                    │
│                                     │
│ Sugestões:                          │
│ ├─ Placa: KM-3456                  │
│ ├─ Patrimônio: GRA6R34             │
│ ├─ Motorista: João Silva           │
│ ├─ Modelo: Toyota Hilux            │
│ └─ Batalhão: BPTRAN                │
└─────────────────────────────────────┘
```

**Funcionalidades**:
- Autocomplete enquanto digita
- Categorias com ícones
- Highlight no match encontrado

---

## 🎛️ 10. Filtros

### Barra de Filtros (Sempre Visível)

```
┌─────────┬────────┬───────┬─────────┬────────┬──────────────┐
│ Data ▼  │ Status▼│ Tipo▼ │Batalhão▼│Modelo ▼│Responsável ▼ │
└─────────┴────────┴───────┴─────────┴────────┴──────────────┘

Sem abrir novas telas - dropdowns inline
```

---

## 📱 11. Responsividade

### Mobile (< 768px)

- Cards ocupam 100% da largura
- Menu lateral: colapsável (hamburger menu)
- Botões: mínimo 44x44px (acessibilidade)
- Top Bar: Stack vertical em telas muito pequenas
- Gráficos: Adaptar para landscape se necessário

### Tablet (768px - 1024px)

- Cards em 2 colunas
- Menu pode ser reduzido a ícones
- Top bar mantém layout completo

### Desktop (> 1024px)

- Cards em 3+ colunas conforme espaço
- Menu lateral sempre visível
- Layout otimizado para múltiplas informações

---

## ✨ 12. Animações

### Recomendações

| Ação | Duração | Easing | Descrição |
|------|---------|--------|-----------|
| Abrir página | 300ms | ease-in-out | Fade in + slide |
| Fechar modal | 200ms | ease-out | Fade out |
| Hover card | 150ms | ease-out | Elevação suave |
| Carregar | 500ms | ease-in-out | Skeleton loading |
| Sucesso | 500ms | ease-out | Confetti ou checkmark |

### Implementação

- Usar CSS Transitions para animações simples
- Usar bibliotecas como Framer Motion ou React Spring para complexas
- Sempre fornecer opção de desabilitar (prefers-reduced-motion)

---

## 🏆 13. Padrão de Aparência Geral

### Inspiração: SAP, TOTVS, Power BI

**Características**:
- ✅ Interface limpa e organizada
- ✅ Espaçamento consistente (múltiplos de 4px ou 8px)
- ✅ Cartões com sombras discretas
- ✅ Cores usadas estrategicamente para destacar
- ✅ Ícones padronizados (considerar FontAwesome ou Feather Icons)
- ✅ Hierarquia visual clara
- ✅ Feedback visual em todas as interações

---

## 🔧 14. Guia de Ícones Padronizados

| Ação | Ícone | Cor |
|------|-------|-----|
| Dashboard | 🏠 / home | Azul |
| Viaturas | 🚓 / car | Azul |
| Manutenção | 🔧 / wrench | Cinza |
| Rastreamento | 📍 / map-pin | Verde |
| Relatórios | 📈 / chart-line | Azul |
| Usuários | 👤 / user | Cinza |
| Configurações | ⚙️ / settings | Cinza |
| Agenda | 📅 / calendar | Laranja |
| Estoque | 📦 / box | Cinza |
| Editar | ✏️ / edit | Cinza |
| Excluir | 🗑️ / trash | Vermelho |
| Salvar | ✓ / check | Verde |
| Fechar | ✕ / x | Cinza |
| Notificações | 🔔 / bell | Amarelo |

---

## 📋 15. Componentes de Entrada

### Campos de Texto

```css
border: 1px solid #ECF0F1;
border-radius: 4px;
padding: 10px 12px;
font-size: 14px;
transition: all 200ms ease;

&:focus {
  border-color: #1E3A5F;
  box-shadow: 0 0 0 3px rgba(30, 58, 95, 0.1);
}
```

### Select/Dropdown

- Mesmos estilos dos inputs
- Seta (▼) customizada
- Opções com hover background Cinza Claro

### Checkboxes e Radios

- Tamanho: 18x18px
- Cor: Azul Escuro quando selecionado
- Rounded (para checkbox) ou circular (para radio)

### Toggle/Switch

- Width: 44px, Height: 24px
- Off: Cinza Médio
- On: Verde
- Animação suave

---

## 📊 16. Gráficos Modernizados

### Recomendações

- **Biblioteca**: Chart.js, Recharts ou Apache ECharts
- **Animação**: Fade in ao carregar, atualização suave
- **Legenda**: Lateral ou embaixo, não sobrepor gráfico
- **Cores**: Usar paleta definida
- **Filtros**: Data, Batalhão, Modelo (dropdowns acima)
- **Interatividade**: Tooltip ao hover, click para detalhar

**Exemplos de gráficos**:
- Manutenções por tipo (Pizza/Rosca)
- Custos por veículo (Barra horizontal)
- Timeline de manutenções (Linha)
- Disponibilidade da frota (Gauge)

---

## 🎯 Checklist de Implementação

### Fase 1: Base Visual (Semana 1-2)
- [ ] Criar tema de cores globais
- [ ] Implementar componentes base (Card, Button, Input)
- [ ] Padronizar tipografia
- [ ] Criar paleta de ícones

### Fase 2: Layout Principal (Semana 2-3)
- [ ] Redesenhar menu lateral
- [ ] Atualizar top bar
- [ ] Reconstruir dashboard com novos KPIs
- [ ] Implementar filtros

### Fase 3: Páginas Secundárias (Semana 3-4)
- [ ] Atualizar lista de manutenções (cards)
- [ ] Redesenhar página da viatura
- [ ] Melhorar gráficos
- [ ] Adicionar pesquisa inteligente

### Fase 4: Refinamentos (Semana 4-5)
- [ ] Adicionar animações
- [ ] Testar responsividade
- [ ] Implementar modo escuro (opcional)
- [ ] Testes de acessibilidade

---

## 📝 Notas

- Todas as funcionalidades do aplicativo permanecem exatamente as mesmas
- Apenas a experiência visual é modernizada
- Garantir que o desempenho não seja impactado
- Testar em múltiplos navegadores e dispositivos
- Considerar implementação gradual (não tudo de uma vez)

---

**Última Atualização**: 09/07/2026  
**Versão**: 1.0  
**Status**: Pronto para Implementação
