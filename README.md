# base_project_react

Projeto React inicializado do zero com as ferramentas e práticas atuais de mercado.

## Stack

- [Vite](https://vite.dev/) — build tool e dev server
- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [React Router](https://reactrouter.com/) — roteamento
- [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) — lint e formatação
- [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) — testes

## Estrutura de pastas

```
src/
  assets/       arquivos estáticos (imagens, fontes, etc.)
  components/   componentes reutilizáveis de UI
  hooks/        hooks customizados
  lib/          utilitários e configuração de bibliotecas
  pages/        componentes de página, um por rota
  routes/       definição das rotas da aplicação
  services/     integração com APIs externas
  test/         setup e utilitários de teste
  types/        tipos e interfaces compartilhados
```

Imports absolutos a partir de `src` usam o alias `@` (ex.: `@/components/Layout`).

## Scripts

| Comando                | Descrição                              |
| ---------------------- | -------------------------------------- |
| `npm run dev`          | inicia o servidor de desenvolvimento   |
| `npm run build`        | gera o build de produção               |
| `npm run preview`      | serve o build de produção localmente   |
| `npm run lint`         | executa o ESLint                       |
| `npm run lint:fix`     | executa o ESLint corrigindo o possível |
| `npm run format`       | formata os arquivos com Prettier       |
| `npm run format:check` | verifica a formatação sem alterar      |
| `npm run typecheck`    | verifica os tipos com o TypeScript     |
| `npm run test`         | executa os testes uma vez              |
| `npm run test:watch`   | executa os testes em modo watch        |
| `npm run test:ui`      | executa os testes com interface visual |

## Como começar

```bash
npm install
npm run dev
```

Copie `.env.example` para `.env` e ajuste as variáveis conforme necessário.
