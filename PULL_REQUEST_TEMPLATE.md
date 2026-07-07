# Pull Request: feat(ui): redesign de identidade visual

Este PR aplica um redesign inicial da identidade visual do aplicativo sem modificar funcionalidades.

Arquivos adicionados/alterados:
- src/styles/theme.css  (novos tokens de tema)
- src/styles/global.css (estilos globais)
- src/index.tsx         (importa os estilos)
- src/components/VehicleCard.tsx
- src/components/VehicleCard.css
- src/assets/hero-pattern.svg
- src/assets/logo.svg

Checklist:
- [ ] Executar a aplicação localmente e validar visuais.
- [ ] Verificar responsividade e acessibilidade.

Descrição detalhada:
- Adiciona variáveis CSS para cores, tipografia, espaçamentos e sombras.
- Introduz estilos base para sidebar, hero, cards, botões e badges.
- Inclui um componente de exemplo VehicleCard e placeholders SVG.

Nota: Este PR altera apenas estilos e assets; não altera lógica TypeScript.
