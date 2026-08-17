# base_project_react

Projeto React inicializado do zero com as ferramentas e práticas atuais de mercado, com autenticação
(login, cadastro e 2FA/TOTP) integrada ao backend [base_project_spring_boot](https://github.com/faelinacio/base_project_spring_boot).

## Stack

- [Vite](https://vite.dev/) — build tool e dev server
- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [React Router](https://reactrouter.com/) — roteamento, com rotas protegidas e code-splitting por página
- [Chakra UI](https://www.chakra-ui.com/) — componentes de interface
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) — formulários e validação
- [Axios](https://axios-http.com/) — cliente HTTP, com renovação automática de token
- [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) — lint e formatação
- [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) — testes

## Estrutura de pastas

```
src/
  assets/       arquivos estáticos (imagens, fontes, etc.)
  components/   componentes reutilizáveis de UI (TopBar, Layout, guards de rota)
  hooks/        hooks customizados (useAuth)
  lib/          cliente HTTP, tema do Chakra UI, utilitários
  pages/        componentes de página, um por rota
  providers/    context providers (AuthProvider)
  routes/       definição das rotas da aplicação
  services/     integração com a API do base_project_spring_boot
  test/         setup e utilitários de teste
  types/        tipos e interfaces compartilhados
```

Imports absolutos a partir de `src` usam o alias `@` (ex.: `@/components/Layout`).

## Autenticação e integração com o backend

O front consome a API do **base_project_spring_boot**. Configure a URL base em `.env`
(copie de `.env.example`):

```
VITE_API_URL=http://localhost:8080
```

No backend, para desenvolvimento local, rode com o profile `dev` (`SPRING_PROFILES_ACTIVE=dev`) e
garanta que `app.cors.allowed-origins` inclua a origem do front (por padrão `http://localhost:3000`
no `application-dev.properties`).

Endpoints consumidos (`src/services/`):

| Endpoint                          | Uso                                             |
| --------------------------------- | ----------------------------------------------- |
| `POST /api/auth/register`         | Criação de usuário (loga automaticamente)       |
| `POST /api/auth/login`            | Login com e-mail/senha                          |
| `POST /api/auth/login/totp`       | Confirmação do login quando o 2FA está ativo    |
| `POST /api/auth/refresh`          | Renovação do par de tokens (rotação automática) |
| `POST /api/auth/logout`           | Logout                                          |
| `GET /api/users/me`               | Perfil do usuário autenticado                   |
| `POST /api/users/me/totp/setup`   | Início do cadastro de 2FA (QR code + secret)    |
| `POST /api/users/me/totp/enable`  | Confirmação e ativação do 2FA                   |
| `POST /api/users/me/totp/disable` | Desativação do 2FA                              |

O `accessToken` é mantido em memória e o `refreshToken` em `localStorage`; o cliente HTTP
(`src/lib/apiClient.ts`) intercepta respostas `401` e tenta renovar o token automaticamente antes
de repetir a requisição, deslogando o usuário caso a renovação falhe.

> **Observação:** o endpoint `GET /api/users/me` do backend ainda não expõe se o 2FA está ativo
> (`totpEnabled`). A tela de Configurações contorna isso tratando o retorno `409 Conflict` de
> `POST /api/users/me/totp/setup` como "2FA já ativado". Para um estado inicial 100% preciso após
> recarregar a página, adicione o campo `totpEnabled` ao `UserResponse` do backend.

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

Copie `.env.example` para `.env` e ajuste `VITE_API_URL` para apontar para o
base_project_spring_boot em execução.
