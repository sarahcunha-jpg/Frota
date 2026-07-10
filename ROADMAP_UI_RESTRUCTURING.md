# Roteiro de Reestruturação do Layout - Frota

**Objetivo Geral:** Reorganizar completamente a interface do sistema de Gestão de Frotas, tornando-a mais limpa, profissional e intuitiva. **Nenhuma funcionalidade deve ser removida ou modificada, apenas sua apresentação visual.**

**Stack Atual:**
- React + Vite
- TypeScript/TSX
- Tailwind CSS
- Leaflet + OpenStreetMap
- localStorage para persistência (MVP)

---

## 1. Funcionalidades que DEVEM Permanecer Intactas

❌ **NÃO ALTERAR:**

- ✅ Rastreamento em tempo real (Leaflet + OpenStreetMap)
- ✅ Integração com o mapa
- ✅ CRUD de viaturas (criar, editar, excluir, visualizar)
- ✅ CRUD de motoristas
- ✅ Cadastro e gestão de manutenções
- ✅ Ordens de serviço
- ✅ Histórico de manutenção
- ✅ Relatórios com filtros e exportação (CSV/PDF)
- ✅ Dashboard com KPIs (disponibilidade, MTTR, MTBF, custo)
- ✅ Controle de acesso por perfil (Admin, Gestor, Mecânico, Policial)
- ✅ Sistema de autenticação
- ✅ Banco de dados (localStorage)
- ✅ Fluxo das telas e navegação

**Apenas reorganizar a apresentação visual de tudo isso.**

---

## 2. Paleta de Cores Padronizada

### Cores Base

```
Fundo Principal:      #FFFFFF (branco puro)
Fundo Secundário:     #F5F7FA (cinza muito claro)
Fundo Terciário:      #EEEEEE (cinza claro)
```

### Cores Principais

```
Azul Institucional:   #1E3A8A (principal, cabeçalhos, menu)
Azul Claro:           #2563EB (destaque, hover, links ativos)
Azul Suave:           #DBEAFE (backgrounds subtis)
```

### Cores de Texto

```
Texto Principal:      #1F2937 (cinza escuro, legibilidade máxima)
Texto Secundário:     #6B7280 (cinza médio, descrições)
Texto Terciário:      #9CA3AF (cinza claro, labels, hints)
```

### Cores de Status e Alertas

```
Sucesso:              #10B981 (verde)
Aviso:                #F59E0B (amarelo/laranja)
Erro:                 #EF4444 (vermelho)
Info:                 #3B82F6 (azul info)
```

### Aplicação em Tailwind

Atualizar `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#DBEAFE',
          500: '#2563EB',
          900: '#1E3A8A',
        },
        neutral: {
          50: '#FAFAFA',
          100: '#F5F7FA',
          200: '#EEEEEE',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        info: '#3B82F6',
      },
    },
  },
};
```

---

## 3. Corrigir Contraste e Acessibilidade

### Checklist de Contraste (WCAG AA Mínimo)

- [ ] Nenhum texto azul sobre fundo azul
- [ ] Nenhum texto branco sobre fundos claros
- [ ] Todos os botões com texto legível (ratio mínimo 4.5:1)
- [ ] Todos os títulos com contraste adequado
- [ ] Ícones com cores de status devem ter texto ou padrão adicional

### Exemplo de Correção

❌ **ERRADO:**
```html
<button class="bg-blue-900 text-blue-600">Salvar</button>
<!-- Texto azul claro sobre fundo azul escuro = ilegível -->
```

✅ **CORRETO:**
```html
<button class="bg-green-600 text-white">Salvar</button>
<!-- Texto branco sobre fundo verde = contraste adequado -->
```

---

## 4. Organizar o Dashboard

### Estrutura Recomendada

```
┌─────────────────────────────────────────────┐
│         CABEÇALHO (Logo + Perfil)           │
├──────────┬──────────────────────────────────┤
│  MENU    │                                  │
│  LATERAL │   1. INDICADORES (KPIs)          │
│          │   - Cards com números-chave      │
│          │   - Viaturas Disponíveis         │
│          │   - Em Manutenção                │
│          │   - Últimas Manutenções          │
│          │                                  │
│          │   2. GRÁFICOS                    │
│          │   - MTTR / MTBF                  │
│          │   - Custo por Viatura            │
│          │                                  │
│          │   3. ÚLTIMAS ATIVIDADES          │
│          │   - Lista com timestamps         │
│          │                                  │
│          │   4. ALERTAS                     │
│          │   - Manutenções vencidas         │
│          │   - Viaturas com problemas       │
└──────────┴──────────────────────────────────┘
```

### Especificações dos Cartões (Cards)

- **Altura:** 120px
- **Padding:** 16px
- **Border-radius:** 8px
- **Sombra:** `shadow-sm` (Tailwind)
- **Fundo:** `#FFFFFF` com borda `#E5E7EB`
- **Grid:** 4 colunas em desktop, 2 em tablet, 1 em mobile
- **Gap:** 16px entre cartões

---

## 5. Reorganizar os Formulários

### Princípios

1. Separar campos em blocos bem definidos (fieldset visual)
2. Cada bloco com título e ícone
3. Máximo 2 colunas em desktop
4. Padding consistente
5. Campos com mesmo alinhamento

### Exemplo: Formulário de Viatura

```
┌────────────────────────────────────────┐
│ 📋 DADOS DA VIATURA                    │
├────────────────────────────────────────┤
│ Prefixo: [____________]  Placa: [____] │
│ Modelo: [____________]   Marca: [____] │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ ⚙ INFORMAÇÕES OPERACIONAIS             │
├────────────────────────────────────────┤
│ Quilometragem: [____________]          │
│ Unidade: [Selecionar]  Status: [Ativo] │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ 📝 INFORMAÇÕES ADICIONAIS              │
├────────────────────────────────────────┤
│ Observações:                           │
│ [_____________________________]         │
│ Foto: [Upload ou câmera]               │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ [Cancelar]  [Salvar]  [Limpar]         │
└────────────────────────────────────────┘
```

### Padrão de Componente (React + Tailwind)

```tsx
interface FormSection {
  title: string;
  icon: ReactNode;
  fields: FormField[];
}

const FormSection: React.FC<FormSection> = ({ title, icon, fields }) => (
  <div className="bg-white border border-neutral-200 rounded-lg p-4 mb-4">
    <h3 className="flex items-center text-lg font-semibold text-neutral-800 mb-4">
      {icon}
      <span className="ml-2">{title}</span>
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {fields.map(field => renderField(field))}
    </div>
  </div>
);
```

---

## 6. Padrão Único de Botões

### Especificações

- **Altura:** 40px (small), 48px (large)
- **Padding:** 12px 16px (small), 16px 24px (large)
- **Border-radius:** 6px
- **Font-weight:** 600
- **Transição:** 200ms ease-in-out

### Variantes por Tipo

#### Primário (Salvar)
```tsx
<button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition">
  ✓ Salvar
</button>
```

#### Secundário (Editar)
```tsx
<button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition">
  ✎ Editar
</button>
```

#### Perigo (Excluir)
```tsx
<button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition">
  🗑 Excluir
</button>
```

#### Neutro (Cancelar)
```tsx
<button className="bg-neutral-300 hover:bg-neutral-400 text-neutral-800 px-4 py-2 rounded-lg font-semibold transition">
  ✕ Cancelar
</button>
```

### Barra de Ações (Rodapé de Formulário)

```tsx
<div className="flex justify-end gap-3 pt-4 border-t border-neutral-200 mt-6">
  <button className="bg-neutral-300 hover:bg-neutral-400 text-neutral-800 px-6 py-2 rounded-lg font-semibold">
    Cancelar
  </button>
  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold">
    Editar
  </button>
  <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold">
    Salvar
  </button>
</div>
```

---

## 7. Padrão Único de Tabelas

### Estrutura

```
┌─────────────────────────────────────────────┐
│ Título da Tabela                            │
│ [Pesquisa] [Filtros] [+Novo]   [Colunas]   │
├──────┬───────┬──────┬────────┬──────────────┤
│ ✓    │ Placa │ Mod. │ Status │ Ações        │
├──────┼───────┼──────┼────────┼──────────────┤
│ [ ]  │ PM001 │ Iveco│ Ativo  │ 👁 ✏ 🗑      │
│ [ ]  │ PM002 │ VW   │ Manutn │ 👁 ✏ 🗑      │
│ [ ]  │ PM003 │ Ford │ Ativo  │ 👁 ✏ 🗑      │
└──────┴───────┴──────┴────────┴──────────────┘
Mostrando 3 de 45 | [Anterior] [1][2][3] [Próxima]
```

### Especificações

- **Header-bg:** `#1E3A8A` (azul institucional)
- **Header-text:** `#FFFFFF` (branco)
- **Row-height:** 48px
- **Border:** `#E5E7EB` (cinza claro)
- **Hover-row:** `#F5F7FA` (cinza muito claro)
- **Status-color:** Verde, Amarelo ou Vermelho com ícone

### Padrão React

```tsx
const DataTable: React.FC = () => (
  <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
    {/* Toolbar */}
    <div className="flex justify-between items-center p-4 border-b border-neutral-200">
      <h3 className="text-lg font-semibold text-neutral-800">Viaturas</h3>
      <div className="flex gap-2">
        <input type="text" placeholder="Pesquisar..." className="px-3 py-2 border border-neutral-300 rounded-lg" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">+ Novo</button>
      </div>
    </div>
    
    {/* Table */}
    <table className="w-full">
      <thead className="bg-primary-900 text-white">
        <tr>
          <th className="px-4 py-3 text-left">Placa</th>
          <th className="px-4 py-3 text-left">Modelo</th>
          <th className="px-4 py-3 text-left">Status</th>
          <th className="px-4 py-3 text-center">Ações</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id} className="hover:bg-neutral-100 border-b border-neutral-200">
            <td className="px-4 py-3">{row.placa}</td>
            <td className="px-4 py-3">{row.modelo}</td>
            <td className="px-4 py-3">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusClass(row.status)}`}>
                {row.status}
              </span>
            </td>
            <td className="px-4 py-3 text-center flex justify-center gap-2">
              <button className="text-blue-600 hover:text-blue-800">👁</button>
              <button className="text-blue-600 hover:text-blue-800">✏</button>
              <button className="text-red-600 hover:text-red-800">🗑</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    
    {/* Pagination */}
    <div className="flex justify-between items-center p-4 border-t border-neutral-200">
      <p className="text-sm text-neutral-600">Mostrando 10 de 45</p>
      <div className="flex gap-2">
        <button className="px-3 py-1 border border-neutral-300 rounded">←</button>
        <button className="px-3 py-1 border border-primary-900 bg-primary-900 text-white rounded">1</button>
        <button className="px-3 py-1 border border-neutral-300 rounded">2</button>
        <button className="px-3 py-1 border border-neutral-300 rounded">→</button>
      </div>
    </div>
  </div>
);
```

---

## 8. Menu Lateral Padronizado

### Layout

```
┌──────────────────────┐
│ 🔵 FROTA             │
├──────────────────────┤
│ 🏠 Dashboard         │
│ 🚓 Viaturas          │
│ 👥 Motoristas        │
│ 🔧 Manutenções       │
│ 📍 Rastreamento      │
│ 📊 Relatórios        │
│ 👤 Usuários          │
│ ⚙  Configurações     │
├──────────────────────┤
│ 📢 Sair              │
└──────────────────────┘
```

### Especificações

- **Largura:** 280px (normal), 80px (colapsado)
- **Fundo:** `#1E3A8A` (azul institucional)
- **Texto:** `#FFFFFF` (branco)
- **Hover:** `#2563EB` (azul claro)
- **Ativo:** `#DBEAFE` (azul suave) + texto `#1E3A8A`
- **Padding:** 16px
- **Transição:** 200ms
- **Fixo:** position fixed, z-index alto

### Padrão React

```tsx
const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { icon: '🏠', label: 'Dashboard', path: '/dashboard' },
    { icon: '🚓', label: 'Viaturas', path: '/viaturas' },
    { icon: '👥', label: 'Motoristas', path: '/motoristas' },
    { icon: '🔧', label: 'Manutenções', path: '/manutencoes' },
    { icon: '📍', label: 'Rastreamento', path: '/rastreamento' },
    { icon: '📊', label: 'Relatórios', path: '/relatorios' },
    { icon: '👤', label: 'Usuários', path: '/usuarios' },
    { icon: '⚙', label: 'Configurações', path: '/configuracoes' },
  ];

  return (
    <aside className={`fixed left-0 top-0 h-screen bg-primary-900 text-white transition-all ${
      collapsed ? 'w-20' : 'w-72'
    }`}>
      <div className="p-4 border-b border-primary-700 flex justify-between items-center">
        <h1 className={`font-bold text-xl ${collapsed ? 'hidden' : ''}`}>🔵 FROTA</h1>
        <button onClick={() => setCollapsed(!collapsed)}>≡</button>
      </div>
      
      <nav className="mt-4">
        {menuItems.map((item) => (
          <a
            key={item.path}
            href={item.path}
            className="flex items-center px-4 py-3 text-neutral-100 hover:bg-primary-700 transition rounded-lg mx-2"
          >
            <span className="text-xl">{item.icon}</span>
            <span className={`ml-3 ${collapsed ? 'hidden' : ''}`}>{item.label}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
};
```

---

## 9. Reorganizar a Página de Rastreamento

### ⚠️ IMPORTANTE

**O mapa em tempo real deve permanecer exatamente como está em funcionamento.** Alterar apenas a interface ao redor.

### Nova Layout

```
┌──────────────────────────────────────────────────────┐
│ Rastreamento em Tempo Real                           │
├─────┬────────────────────────────────────────────────┤
│     │ [Filtro] [Centro] [Zoom+] [Zoom-]              │
│ VIA │ ┌──────────────────────────────────────────┐   │
│ TU  │ │                                          │   │
│ RAS │ │           MAPA LEAFLET                   │   │
│     │ │        (Permanecer intacto)              │   │
│ LI  │ │                                          │   │
│ ST  │ │                                          │   │
│ A   │ └──────────────────────────────────────────┘   │
│     │                                                 │
│     │ [Legenda] [Atualizar]                          │
└─────┴────────────────────────────────────────────────┘
```

### Especificações

#### Barra de Filtros (acima do mapa)

```tsx
<div className="bg-white border-b border-neutral-200 p-4 flex gap-4">
  <select className="px-3 py-2 border border-neutral-300 rounded-lg">
    <option>Todas as viaturas</option>
    <option>Em movimento</option>
    <option>Paradas</option>
  </select>
  
  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
    🔄 Atualizar
  </button>
  
  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
    📍 Centralizar
  </button>
  
  <div className="flex gap-2">
    <button className="border border-neutral-300 px-3 py-2 rounded">+</button>
    <button className="border border-neutral-300 px-3 py-2 rounded">−</button>
  </div>
</div>
```

#### Mapa (sem alterações na funcionalidade)

```tsx
// Manter exatamente como está
// Apenas garantir que ocupe 100% da área disponível
<div className="flex-1 bg-neutral-100">
  {/* Leaflet Map Component - INTACTO */}
</div>
```

#### Barra Lateral (Lista de Viaturas)

```tsx
<aside className="w-80 bg-white border-l border-neutral-200 overflow-y-auto">
  <div className="p-4 border-b border-neutral-200">
    <input type="text" placeholder="Pesquisar viatura..." className="w-full px-3 py-2 border border-neutral-300 rounded-lg" />
  </div>
  
  <div className="p-2">
    {viaturas.map((viatura) => (
      <div
        key={viatura.id}
        className={`p-3 rounded-lg mb-2 cursor-pointer transition ${
          selectedViatura?.id === viatura.id
            ? 'bg-blue-100 border-l-4 border-blue-600'
            : 'bg-neutral-50 hover:bg-neutral-100'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${getStatusColor(viatura.status)}`}></span>
          <span className="font-semibold text-neutral-800">{viatura.placa}</span>
        </div>
        <p className="text-sm text-neutral-600 mt-1">{viatura.modelo}</p>
        <div className="text-xs text-neutral-500 mt-1">
          Vel: {viatura.velocidade} km/h | Última atualização: {viatura.lastUpdate}
        </div>
      </div>
    ))}
  </div>
</aside>
```

#### Legenda

```tsx
<div className="bg-white border-t border-neutral-200 p-4">
  <h4 className="font-semibold text-neutral-800 mb-3">Legenda</h4>
  <div className="grid grid-cols-2 gap-3">
    <div className="flex items-center gap-2">
      <span className="w-4 h-4 rounded-full bg-green-500"></span>
      <span className="text-sm text-neutral-700">Em movimento</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="w-4 h-4 rounded-full bg-yellow-500"></span>
      <span className="text-sm text-neutral-700">Parada</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="w-4 h-4 rounded-full bg-red-500"></span>
      <span className="text-sm text-neutral-700">Manutenção</span>
    </div>
  </div>
</div>
```

---

## 10. Padrão Único de Gráficos

### Especificações

- **Título:** 16px, font-semibold, cor neutral-800
- **Legenda:** abaixo do gráfico, tamanho 12px
- **Cores:** usar a paleta padronizada
- **Altura mínima:** 300px
- **Margin:** 16px
- **Border:** 1px solid `#E5E7EB`
- **Padding:** 16px

### Exemplo: Gráfico MTTR/MTBF

```tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MTTRChart: React.FC = () => (
  <div className="bg-white border border-neutral-200 rounded-lg p-4">
    <h3 className="text-lg font-semibold text-neutral-800 mb-4">MTTR / MTBF - Últimos 6 meses</h3>
    
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis dataKey="name" stroke="#6B7280" />
        <YAxis stroke="#6B7280" />
        <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }} />
        <Legend />
        <Line type="monotone" dataKey="MTTR" stroke="#F59E0B" strokeWidth={2} />
        <Line type="monotone" dataKey="MTBF" stroke="#10B981" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);
```

---

## 11. Hierarquia de Tipografia

### Fonte Principal
**Inter, Roboto ou Poppins** (já compatível com Tailwind)

### Escala de Tamanhos

```
H1: 32px | font-bold    | text-neutral-900 | Página titles
H2: 24px | font-bold    | text-neutral-800 | Seção titles
H3: 20px | font-semibold| text-neutral-800 | Subtítulos
H4: 16px | font-semibold| text-neutral-800 | Card titles
Body: 14px | font-normal| text-neutral-700 | Textos comuns
Small: 12px | font-normal| text-neutral-600 | Labels, hints
Caption: 11px| font-normal| text-neutral-500 | Timestamps

```

### Implementação em Tailwind

```tsx
// Componentes reusáveis
const H1: React.FC<{ children: string }> = ({ children }) => (
  <h1 className="text-3xl font-bold text-neutral-900">{children}</h1>
);

const H2: React.FC<{ children: string }> = ({ children }) => (
  <h2 className="text-2xl font-bold text-neutral-800">{children}</h2>
);

const H3: React.FC<{ children: string }> = ({ children }) => (
  <h3 className="text-lg font-semibold text-neutral-800">{children}</h3>
);

const BodyText: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-base font-normal text-neutral-700">{children}</p>
);

const SmallText: React.FC<{ children: string }> = ({ children }) => (
  <span className="text-xs font-normal text-neutral-600">{children}</span>
);
```

---

## 12. Sistema de Espaçamento Padronizado

### Escala (em pixels)

```
xs:  4px
sm:  8px
md:  12px
lg:  16px
xl:  24px
2xl: 32px
3xl: 48px
```

### Aplicação

```
Padding dentro de cards:     16px (lg)
Margin entre elementos:      16px (lg)
Margin entre seções:         32px (2xl)
Gap entre botões:            12px (md)
Padding de input/button:     12px (md)
Border-radius padrão:        8px
Border-radius de botões:     6px
```

### Padrão Tailwind

```tsx
// Cards
<div className="p-4 mb-4 gap-4">
  {/* 16px padding, 16px margin-bottom, 16px gap */}
</div>

// Seções
<section className="mb-8">
  {/* 32px margin-bottom entre seções */}
</section>

// Botões
<button className="px-4 py-2 gap-2">
  {/* 16px padding-x, 8px padding-y, 8px gap */}
</button>
```

---

## 13. Ícones Padronizados

### Biblioteca Recomendada
**React Icons** (agrupa Material Icons, Font Awesome, etc.)

```bash
npm install react-icons
```

### Uso Consistente

```tsx
import { FiHome, FiTruck, FiSettings, FiLogOut, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';

// Tamanho padrão: 20px
<FiHome size={20} className="text-neutral-700" />

// Tamanho grande: 24px
<FiHome size={24} className="text-neutral-900" />

// Em botões: 16px
<button className="flex items-center gap-2">
  <FiEdit size={16} />
  Editar
</button>
```

### Mapeamento de Ícones

```javascript
const icons = {
  dashboard: FiHome,
  viaturas: FiTruck,
  motoristas: FiUsers,
  manutencoes: FiWrench,
  rastreamento: FiMapPin,
  relatorios: FiBarChart2,
  usuarios: FiUser,
  configuracoes: FiSettings,
  sair: FiLogOut,
  editar: FiEdit2,
  excluir: FiTrash2,
  visualizar: FiEye,
  adicionar: FiPlus,
  filtro: FiFilter,
};
```

---

## 14. Responsividade

### Breakpoints (Tailwind)

```
sm: 640px   (smartphones)
md: 768px   (tablets)
lg: 1024px  (laptops)
xl: 1280px  (desktops)
2xl: 1536px (large desktops)
```

### Padrão de Layout Responsivo

```tsx
// Mobile first approach
<div className="
  grid grid-cols-1           // 1 coluna em mobile
  sm:grid-cols-2             // 2 colunas em small
  md:grid-cols-3             // 3 colunas em medium
  lg:grid-cols-4             // 4 colunas em large
  gap-4
">
  {/* Cards */}
</div>
```

### Menu Responsivo

```tsx
// Desktop: sidebar fixo
// Mobile: menu hamburger colapsável
const Layout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="
        hidden              // hidden em mobile
        lg:block            // visible em large
        w-72 bg-primary-900 text-white
      ">
        {/* Menu items */}
      </aside>

      {/* Main */}
      <main className="flex-1">
        {/* Header com botão hamburger em mobile */}
        <header className="flex lg:hidden items-center justify-between p-4 bg-white border-b">
          <h1>FROTA</h1>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>≡</button>
        </header>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <nav className="lg:hidden p-4 bg-white border-b">
            {/* Menu items */}
          </nav>
        )}

        {/* Conteúdo */}
      </main>
    </div>
  );
};
```

---

## 15. Melhorar Mensagens e Textos

### Princípios

- ✅ Linguagem simples e objetiva
- ✅ Evitar jargões técnicos
- ✅ Máximo 2 linhas por mensagem
- ✅ Verbos no infinitivo para ações
- ✅ Mensagens de erro com solução

### Exemplos de Melhoria

| ❌ ANTES | ✅ DEPOIS |
|---------|----------|
| "Falha ao atualizar o recurso" | "Não foi possível salvar as alterações. Tente novamente." |
| "Você tem certeza que deseja proceder com a ação?" | "Confirmar exclusão? Esta ação não pode ser desfeita." |
| "Recurso criado com sucesso" | "Viatura criada com sucesso!" |
| "Erro: Campo obrigatório" | "Informe a placa da viatura" |
| "Configurações salvas" | "Configurações atualizadas!" |

### Implementação

```tsx
// Toast notifications com mensagens claras
const showNotification = (type: 'success' | 'error' | 'warning', message: string) => {
  toast[type](message, {
    duration: 3000,
    position: 'top-right',
  });
};

// Uso
showNotification('success', 'Viatura criada com sucesso!');
showNotification('error', 'Não foi possível salvar. Tente novamente.');
showNotification('warning', 'Manutenção vencida. Agende uma revisão.');
```

---

## Checklist de Implementação

### Fase 1: Setup e Estrutura
- [ ] Atualizar `tailwind.config.js` com cores padronizadas
- [ ] Criar componentes base (Button, Card, Input, etc.)
- [ ] Criar hierarquia de tipografia como componentes
- [ ] Implementar Sidebar colapsável
- [ ] Implementar Header/Navbar padrão

### Fase 2: Dashboard
- [ ] Reorganizar KPIs em grid 4 colunas
- [ ] Padronizar cards
- [ ] Atualizar gráficos com cores padronizadas
- [ ] Organizar seção de alertas
- [ ] Implementar últimas atividades

### Fase 3: Formulários
- [ ] Reorganizar formulário de viaturas em seções
- [ ] Reorganizar formulário de motoristas
- [ ] Reorganizar formulário de manutenções
- [ ] Padronizar botões de ação
- [ ] Implementar validações visuais

### Fase 4: Tabelas
- [ ] Padronizar todas as tabelas
- [ ] Implementar busca unificada
- [ ] Implementar paginação padrão
- [ ] Destacar status com cores
- [ ] Adicionar ações padronizadas

### Fase 5: Rastreamento
- [ ] Manter mapa exatamente como está
- [ ] Reorganizar barra de filtros
- [ ] Criar barra lateral com lista de viaturas
- [ ] Adicionar legenda padronizada
- [ ] Implementar busca na lista

### Fase 6: Refinamentos
- [ ] Testar responsividade (mobile/tablet/desktop)
- [ ] Corrigir contraste de acessibilidade (WCAG AA)
- [ ] Padronizar ícones em toda a aplicação
- [ ] Reescrever mensagens de erro/sucesso
- [ ] Implementar transições suaves

### Fase 7: Testes
- [ ] Testar todas as funcionalidades (confirmar se ainda funcionam)
- [ ] Teste de acessibilidade com screen reader
- [ ] Teste de performance (Lighthouse)
- [ ] Teste em diferentes navegadores
- [ ] Teste responsivo em diferentes dispositivos

---

## Arquitetura de Componentes Sugerida

```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── Layout.tsx
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── FormSection.tsx
│   │   ├── DataTable.tsx
│   │   └── StatusBadge.tsx
│   ├── dashboard/
│   │   ├── KPICard.tsx
│   │   ├── Charts.tsx
│   │   ├── AlertsSection.tsx
│   │   └── Dashboard.tsx
│   ├── viaturas/
│   │   ├── ViaturaForm.tsx
│   │   ├── ViaturaList.tsx
│   │   └── ViaturaDetail.tsx
│   ├── rastreamento/
│   │   ├── Map.tsx
│   │   ├── FilterBar.tsx
│   │   ├── ViaturasSidebar.tsx
│   │   └── Rastreamento.tsx
│   └── ...outros módulos
├── styles/
│   └── globals.css (variáveis CSS globais)
└── ...

tailwind.config.js (com cores e espaçamento padronizados)
```

---

## Resultado Esperado

Após a implementação deste roteiro:

✅ Interface moderna, limpa e profissional
✅ Paleta de cores consistente em toda a aplicação
✅ Contraste e acessibilidade WCAG AA
✅ Componentes padronizados e reutilizáveis
✅ Hierarquia visual clara
✅ Responsividade completa (mobile/tablet/desktop)
✅ Melhor experiência do usuário
✅ **100% das funcionalidades preservadas:**
  - Rastreamento em tempo real funcionando perfeitamente
  - Todos os CRUDs intactos
  - Dashboard com KPIs
  - Relatórios e exportações
  - Controle de acesso
  - Todas as telas navegáveis
✅ Código mais organizado e fácil de manter

---

## Notas Importantes

1. **Nenhuma função deve ser alterada** — apenas UI/UX
2. **localStorage continua funcionando** — dados persistem
3. **Leaflet + OpenStreetMap intactos** — mapa funciona como antes
4. **Gradual:** implemente por módulos/páginas, testando em paralelo
5. **Compatibilidade:** mantenha a mesma estrutura de dados e APIs
6. **Teste contínuo:** sempre verificar se as funcionalidades ainda funcionam

---

**Status:** Roteiro pronto para implementação
**Última atualização:** 2026-07-10
**Tech Lead:** Equipe de Desenvolvimento
