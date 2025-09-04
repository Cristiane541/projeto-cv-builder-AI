# CV Builder AI

## Descrição do Projeto

CV Builder AI é um gerador de currículo inteligente, desenvolvido em React 19 + TypeScript + TailwindCSS v4 + Vite. O objetivo é permitir que usuários criem currículos profissionais com preview em tempo real e melhorias automáticas por inteligência artificial (OpenAI API).

### Principais Funcionalidades

- **Layout Split-Screen:** Formulário à esquerda e preview do currículo à direita, com scroll independente.
- **Formulário Completo:** Dados pessoais, habilidades (com níveis) e experiências profissionais.
- **Preview Instantâneo:** Atualização do currículo em tempo real conforme o usuário digita.
- **Melhorias por IA:** Botões para aprimorar textos do resumo e das experiências usando IA.
- **Design Profissional:** Interface moderna, otimizada para desktop.

### Tecnologias Utilizadas

- React 19
- TypeScript
- TailwindCSS v4
- Vite
- OpenAI API

---

## Como clonar e rodar o projeto

1. **Clone o repositório:**
   ```
   git clone https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git
   ```

2. **Acesse a pasta do projeto:**
   ```
   cd NOME_DO_REPOSITORIO
   ```

3. **Instale as dependências:**
   ```
   npm install
   ```

4. **Rode o projeto:**
   ```
   npm run dev
   ```

5. **Acesse no navegador:**
   ```
   http://localhost:5173/
   ```

---

## Contribuição

Cada integrante pode criar uma branch para sua tarefa e abrir Pull Requests para revisão e integração.

---

**Dúvidas ou sugestões:**  
Abra uma issue ou entre em contato pelo GitHub!



# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
