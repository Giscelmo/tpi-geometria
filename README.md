# TPI Geometria

Site institucional em português, feito com Next.js, TypeScript e App Router. Inclui seis rotas: Início (`/`), Empresa (`/empresa/`), Atuação (`/atuacao/`), Equipamentos (`/equipamentos/`), Clientes (`/clientes/`) e Contato (`/contato/`).

## Estado atual — 2026-11-22

- WhatsApp é o único canal digital de contato. Darci e Édson aparecem com números preservados; os links abrem nova guia com aviso acessível e `noopener noreferrer`. Telefones e endereço também permanecem disponíveis.
- O endereço de publicação está definido: [https://giscelmo.github.io/tpi-geometria/](https://giscelmo.github.io/tpi-geometria/). O repositório foi tornado público por PATCH confirmado no GitHub. A publicação está em andamento, ainda sem confirmação de deploy concluído.
- O usuário autorizou o envio do código. A coordenação fará commit/push do workflow corrigido após atualizar o staging. O bloqueio anterior `POST 422` por repositório privado foi resolvido quando a visibilidade foi alterada para pública por solicitação do usuário. A publicação continua em andamento; ainda não foi confirmada como concluída.
- O workflow usa Node 22, validação estática e export em `/tpi-geometria/`. `upload-pages-artifact` inclui arquivos ocultos para preservar `out/.nojekyll`.
- A URL, o status da publicação e a preparação do workflow estão registrados em [PROJETO.md](PROJETO.md).

## Rodar e verificar localmente

Requer Node.js 22 e npm. No PowerShell, use `npm.cmd` se a política bloquear `npm.ps1`.

```powershell
npm.cmd ci
npm.cmd run dev
```

Para validar a exportação estática:

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run test:export-segments
npm.cmd run build
npm.cmd run check:export
npm.cmd run preview
```

`npm.cmd run build` executa `postbuild`, que normaliza seis payloads de prefetch no export Windows sem apagar os originais. `preview` serve `out/` em http://127.0.0.1:4173/ e não publica. Pare o preview antes de trocar `basePath` ou recompilar para evitar servir temporariamente assets incompatíveis.

Ao adicionar uma rota que gere payload de prefetch, inclua o caminho na lista `routes` em `scripts/normalize-export-segments.mjs`; execute `npm.cmd run build` para disparar o lifecycle `postbuild` e depois `check:export`.

## GitHub Pages

O workflow roda em pushes para `main` e em execução manual. Ele instala com `npm ci`, executa lint/typecheck/testes do normalizador, compila com `NEXT_PUBLIC_BASE_PATH=/tpi-geometria` e verifica `out/` antes de configurar os metadados do Pages e enviar o artefato para publicação pelo ambiente `github-pages`. Assim, as validações e o build podem rodar antes da etapa que depende do Pages. A implantação manual é limitada à branch `main`.

A coordenação fará commit/push do workflow após atualizar o staging e seguirá com a ativação pelo source **GitHub Actions**. O status do deploy será confirmado separadamente; ainda não há confirmação de publicação concluída. O workflow usa ações oficiais verificadas: checkout v7.0.1, setup-node v7.1.0, configure-pages v6.0.0, upload-pages-artifact v5.0.0 e deploy-pages v5.0.1. O deploy exige `pages: write` e `id-token: write`; o build tem somente `contents: read` e `pages: read`.

## Conteúdo e pendências editoriais

Clientes são nomes históricos, sem alegação de vínculo atual; não há logos inventados. Opmec, Anol e Agemaq são histórico profissional. Os 15 anos do material são referência histórica, não idade atual. Especificações transcritas dos PNGs estão em `lib/equipment.ts`.

- T2/N3: associação dos dois blocos de especificações permanece ambígua.
- Tripoit T: termo final a confirmar.
- Votorantin: grafia transcrita a confirmar.

A revisão de manutenção das dependências continua pendente. O histórico de decisões, verificações e autoria está em [PROJETO.md](PROJETO.md).