# Projeto TPI Geometria

## Estado atual — 2026-11-22

- WhatsApp é o único canal digital de contato. Telefones e endereço permanecem.
- URL definida: https://giscelmo.github.io/tpi-geometria/.
- Workflow de GitHub Pages preparado em `.github/workflows/deploy-pages.yml`. O usuário autorizou o envio do código; após atualizar o staging, a coordenação fará commit/push do workflow corrigido. O deploy está em andamento, sem confirmação de conclusão.
- A coordenação reportou anteriormente `POST 422` porque o repositório era privado e o plano não oferecia Pages privado. Por autorização explícita do usuário, um PATCH no GitHub confirmou a visibilidade pública; esse bloqueio foi resolvido. A coordenação cuida do Git, commit/push e configuração do Pages.
- Workflow define basePath `/tpi-geometria`, testa, constrói e verifica `out/` antes da etapa Configure Pages, que precede o upload para deploy em Actions. Permissões são restritas por job. Artefato inclui `.nojekyll`.

## Pendências

### Publicação em andamento
- A visibilidade pública foi confirmada pelo GitHub após PATCH autorizado pelo usuário; o bloqueio anterior por repositório privado está resolvido.
- A coordenação atualizará o staging e fará commit/push do workflow corrigido. Deploy/publicação ainda não foram confirmados como concluídos.

### Editoriais
- T2/N3: associação dos dois blocos de especificações permanece ambígua.
- Tripoit T: termo final a confirmar.
- Votorantin: grafia transcrita a confirmar.

### Operacionais
- Revisar manutenção das dependências; auditoria anterior encontrou alertas na cadeia dev e nenhuma atualização automática foi aplicada.

## Workflow Pages preparado

- Trigger: push para `main` ou `workflow_dispatch`; deploy manual só ocorre em `main`.
- Build: Node 22; `npm ci`; lint, typecheck, `test:export-segments`, build com `NEXT_PUBLIC_BASE_PATH=/tpi-geometria` e `check:export`; em seguida Configure Pages e upload de `out/` com arquivos ocultos incluídos.
- Deploy: ambiente `github-pages`, `pages: write` e `id-token: write`. Build usa `contents: read` e `pages: read`.
- Ações oficiais verificadas em 22/11: checkout v7.0.1, setup-node v7.1.0, configure-pages v6.0.0, upload-pages-artifact v5.0.0, deploy-pages v5.0.1.
- O workflow corrigido será commitado pela coordenação após atualizar o staging. A publicação permanece em andamento, sem confirmação de deploy concluído.

## Estado do projeto

- Hero estático com composição geométrica CSS; sem imagens artificiais de equipamentos ou logos inventados.
- Os 15 clientes listados são históricos, não clientes atuais declarados. Klabin foi deduplicada; Opmec, Anol e Agemaq constam apenas no histórico profissional. Os 15 anos do material não foram convertidos em idade atual.
- Especificações transcritas dos 13 PNGs, inclusive minutos, segundos e amplitudes. T2/N3 ficam em bloco conjunto sem associação inferida; preservada a grafia Votorantin e o termo “Tripoit” T para confirmação.
- Export usa `output: 'export'`, `trailingSlash: true`, `public/.nojekyll` e `NEXT_PUBLIC_BASE_PATH`. Rotas novas com payload de prefetch também precisam ser adicionadas à lista `routes` em `scripts/normalize-export-segments.mjs`.

## Verificações e autoria

### Verificações locais anteriores — desenvolvedor

- Lint e typecheck passaram.
- Build/check passaram na raiz, no subpath `/tpi-geometria/` e na restauração final raiz. Cada build normalizou seis payloads, preservando originais.
- `test:export-segments` passou com três fixtures. `check:export` confirmou seis rotas, favicon, ausência de formulário/email, links WhatsApp seguros, telefones, endereço e payloads planos.
- Para esta tarefa de arquivos locais, não foi repetido build: a saída subpath já havia sido validada e a coordenação fará `npm ci` e build no CI. Workflow foi revisado estaticamente, sem deploy.

### Maestro — QA direta anterior

- `whatsapp-only-check.mjs` CDP: exit 0, 24 casos, seis rotas em 320/375/768/1440, `failures=[]`; sem form, mailto, email ou avisos Formspree; sem overflow, imagens quebradas ou HTTP 400+. Screenshot de Contato em 320 px visualizada. Nomes, números, `target="_blank"` e `rel="noopener noreferrer"` corretos.
- `controls-check.mjs`: exit 0, `failures=[]`; teclado, menu, WhatsApp, touch, rotas, resize, breakpoint e foco externo passaram. Cliques externos foram interceptados sem envio.

## Histórico

- O formulário de orçamento com Formspree foi uma implementação temporária e removida em 21/11 por solicitação do usuário. Em 18/10, QA configurada interceptou 13 POSTs antes da rede; zero mensagens foram entregues. Nenhuma integração Formspree está ativa.
- Em 20/10, Maestro registrou QA do estado anterior com formulário, incluindo 24 cenários e controles; Revisor aceitou aquele escopo.
- Em 21/11, foram removidos formulário, email, `mailto:`, Formspree, testes e CSS específico; WhatsApp passou a ser o único canal digital, mantendo telefones e endereço.
- Em 22/11, o usuário autorizou a publicação e definiu a URL. O bloqueio `POST 422` por repositório privado foi resolvido após autorização explícita e PATCH que confirmou a visibilidade pública. A coordenação atualizará o staging e fará commit/push do workflow corrigido; publicação ainda em andamento, não confirmada como concluída.
- Nenhuma mensagem real foi enviada ou deploy realizado.