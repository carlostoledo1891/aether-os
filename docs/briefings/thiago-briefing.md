# Vero — briefing pro Thiago

> Conversa franca, sem laquê de pitch. Pra um amigo entender o que é, o que tá bom, o que tá ruim, e onde dá pra ajudar.
>
> **Autor do briefing:** preparado pelo Carlos com a ajuda do agente do repo, em Abr/2026.
> **Repo:** `aether-os` (codebase) → marca comercial **Vero**.
> **Status:** pré-receita, solo founder, dois ambientes vivos rodando o mesmo runtime.

---

## 1. O que é, em uma respirada

**Vero** é uma aplicação web que:

1. Coloca todo "objeto operacional" de uma operação regulada num mapa — furos de sondagem, talhões agrícolas, embarcações, sensores, polígonos de licença. Eles são chamados de **units** (unidades tipadas).
2. Recebe telemetria desses objetos em tempo real (ou simulada, com label honesto).
3. **Faz hash SHA-256 de cada mudança de estado** num *audit chain* — você consegue provar depois que ninguém mexeu no dado.
4. Tem um chat de IA ("Vero") que responde perguntas com **citação de proveniência** (qual unidade, qual campo, qual evidência).
5. Exporta tudo isso como um *evidence bundle* que **qualquer pessoa re-verifica no próprio navegador** em `/verify/<hash>` — sem precisar confiar no nosso servidor.

**Deployment de referência:** Meteoric Resources / Caldeira — projeto de terras-raras em Poços de Caldas, Minas Gerais. ASX: MEI.
**Segunda instância já viva:** Atlantic Maritime ISR (`/app/maritime`) — defesa, dark-vessel tracking. Mesmo runtime, overlays diferentes.

**Posicionamento público (v19, Abr 2026):**
> *"The field-operations command center for regulated industries. Map every asset. Stream every sensor. Prove every change."*

**Frase wedge interna:**
> *"GIS te mostra onde as coisas estão. Telemetria te mostra o que elas estão fazendo. Vero te mostra os dois — e prova que nada mudou sem deixar rastro."*

---

## 2. Por que existe (a tese, sem maquiagem)

Hoje, quem precisa **provar** coisas pra terceiros usa PDF + confiança cega:

- Mineradora prova reserva pro investidor → relatório JORC em PDF.
- Fazenda prova orgânico pro selo → planilha + auditoria anual.
- Defesa prova origem FEOC-clean pro DoD → declaração assinada.
- Indústria prova passport europeu (DPP) → vai virar lei em **fev/2027** e ainda não tem ferramenta padrão.

A tese: **substituir "confia em mim" por hash verificável.** Como o motor é genérico (units + spatial + telemetry + audit chain + AI), o mesmo runtime serve mineração, agro, defesa, infra.

**Macro tailwinds reais:**

1. Reshoring de minerais críticos (IRA, FEOC, EU CRMA).
2. EU Battery Regulation / Digital Product Passport — fev/2027.
3. ISR de defesa + dark-vessel tracking (SBIR/STTR aberto).
4. CSRD + pressão hídrica em agro (Europa).
5. Cansaço regulatório com PDF — auditoria por JSON ganha tração.

---

## 3. As três pilastras (linguagem comprador)

Por baixo são quatro primitivos de engenharia, mas a venda usa três:

1. **Map & Geofence** — units tipadas + camadas espaciais + boundaries.
2. **Monitor & Verify** — ingestão de sensor + cadeia de auditoria SHA-256 + labels de proveniência.
3. **Decide & Report** — agente IA + scene runtime + dossiês de evidência exportáveis.

A regra de demo: **toda tela mostra a vertical ativa** (Mining, Agriculture, Defense). Nunca uma tela genérica de "plataforma".

---

## 4. A Mesa Redonda — cada persona te conta a história dele

### Carlos (founder, builder, nascido na Caldeira)
> "Cara, cresci dentro dessa caldeira vulcânica. Fui piloto da Aeronáutica, faço design, programo full-stack. Construí isso sozinho. Hoje quem precisa provar dado pro investidor, regulador ou comprador, usa PDF e fé. Eu tô fazendo a camada que troca o 'confia em mim' por um hash. E como o motor é genérico, mesmo runtime atende mineração, agro, defesa."

### Business Expert (advisor)
> "Plano comercial: tier Starter $30k/yr, Growth $102k/yr, Enterprise $180–350k. Meta de 6 meses: fechar Meteoric ($102k), 2 design partners de OEM automotivo (DPP da UE), levantar $5–7M seed. ACV mais alto fica em defesa, mas ciclo é ano e meio."

### CTO / Product Leader
> "Stack honesto, sem firula:
> - **Front:** React + Vite + TS strict, MapLibre GL, design tokens, CSS Modules.
> - **Back:** Node + Express + SQLite (schema v7), simulação concorrente (`npm run dev:all`).
> - **Shared:** contratos tipados em `shared/units`, `shared/audit`, `shared/sites`.
> - **Trust primitive:** canonical JSON → SHA-256 → audit chain → bundle exportável → verifier público com fallback de `crypto.subtle` pra Safari mobile.
> - **Multi-instance:** `DataServiceProvider` aceita factory por instância. `/app/meteoric` e `/app/maritime` são irmãs no mesmo runtime.
> - **Quality:** TS strict zero erros, NIST 800-53 Rev 5 + CMMC L2 mapeados, `npm run verify:release` é o gate de merge.
> - **Deploy:** Vercel (front) + Railway (`aether-api-production-295d.up.railway.app`)."

### Marketing & Branding Director
> "Marca: **Vero**, do latim *verus* (verdade). Mono Æ, canvas escuro, paleta violeta/ciano. Tom: honestidade radical — todo screenshot mostra o que é 'modeled' vs 'live'. Isso *é* o posicionamento, não um disclaimer."

### Stakeholders externos — uma linha cada
- **Andrew Tunks (Chairman, Meteoric):** "Não me faz pagar mico no próximo release ASX."
- **Stuart Gale (CEO, Meteoric):** "Me ajuda a fechar o próximo capital raise mais rápido."
- **Marcelo De Carvalho (Chief Geologist):** "Não brinca com JORC. Cada número tem que linkar pra fonte."
- **DoD Program Officer:** "Cadê o OpenAPI, cadê o audit chain, é FedRAMP-pathway?"
- **EU Enforcement Officer:** "Me mostra o JSON do DPP batendo com o schema CEN/CENELEC."
- **Project Finance Analyst:** "Me dá DSCR Bear/Consensus/Bull com zero-cache no dado financeiro."
- **NGO / comunidade:** "Cadê o telefone do FEAM em português?"
- **Jornalista:** "Tá tudo rotulado como simulado ou vocês tão me enrolando?"
- **SCADA Integrator:** "Me dá a OpenAPI spec, me diz quanto custa mapear OPC-UA."
- **Dr. Heber Caponi (LAPOC, advisor científico):** "Quando vocês plugarem meus piezômetros, esse 'modeled' vira 'field-verified' — aí sai do reino do demo."

---

## 5. Tech side — versão sem firula

| Camada | O que tem |
|---|---|
| **Monorepo** | `src/` (front), `server/` (API + sim), `shared/` (contratos tipados), `e2e/` (Playwright), `scripts/` (data builds + verifier) |
| **Frontend** | React + Vite + TS strict, MapLibre, overlays por vertical (`MaritimeAoiOverlay`, `DrillHoleOverlay`, `UnitMarkers`), `PresentationShell` compartilhado entre app + site + decks |
| **Backend** | Express + SQLite, três processos concorrentes (API + simulação + Vite), seeders por instância (`maritimeUnitSeeds.ts`, Caldeira seeds) |
| **Audit chain** | Canonical JSON → SHA-256 → linked chain → bundle JSON → `/verify/<hash>` (re-verificação client-side) |
| **AI agent ("Vero")** | Tool-calling sobre o grafo tipado, proveniência inline (`ToolProvenance.tsx`), sem alucinação solta — toda resposta cita unit + field + evidence |
| **Compliance** | NIST 800-53 Rev 5, CMMC L2, Incident Response, DPA, SBIR/STTR readiness — tudo mapeado em `docs/compliance/` |
| **Deploy** | Vercel + Railway, prod em `https://verochain.co`, `npm run update:all` faz rollout |

**Tese técnica:** nada exótico. O moat **não é** a stack — qualquer dev sênior reproduz o audit chain numa semana. O moat **é** o bundle (typed graph + audit chain + AI grounded + multi-instance shell + design system + posicionamento honesto), executado com disciplina cirúrgica por um solo founder.

---

## 6. Business side — o que destrava

| Horizonte | Oportunidade | Mecanismo |
|---|---|---|
| **0–6 meses** | Converter Meteoric de dev partner → pilot pago ($102k/yr) | Produto já construído dentro do dado deles |
| **0–6 meses** | 2 design partners de OEM EV ($30k Starter, co-dev DPP) | Export DPP JSON é o lead magnet |
| **6–18 meses** | Primeiro contrato de defesa (SBIR) na instância maritime | `/app/maritime` já live, NIST mapping reduz ciclo |
| **6–18 meses** | Pilots em agro (orgânico / regenerativo / direitos d'água) | Hydro overlays + audit chain transferem direto |
| **12–24 meses** | Cadeira em standards body (CEN/CENELEC, FEAM) | "Mapeamos 22 campos — falta esses N" |
| **18–36 meses** | Network effect do verifier público — `forks/verification` como métrica | Wave 2 brief em `docs/wave-2-kickoff.md` |
| **Estratégico** | Ser a *read-only governance layer* acima do SCADA/ERP, nunca dentro | Comprador diferente (CFO/Compliance/Board), budget diferente |

**Pricing tiers:**

| Tier | $/yr | Target |
|---|---|---|
| Starter | $30k | Junior miner em PFS / design partner |
| Growth | $102k | Operador DFS → construção |
| Enterprise | $180–350k | Multi-asset, ECA/DFI |

**Argumento de pricing atual:** "$102k = 0,03% do NPV de $821M da Caldeira." Funciona pra investidor, **não funciona** pra CFO de júnior — esse pensa em $102k como "um analista do meu time". Reframing necessário.

**Seed ask:** $5–7M pre-money. Uso: lead comercial, segundo dev full-stack, 5 integrações piloto, conectar instrumentos LAPOC (esse é o salto "demo → produto").

---

## 7. A parte brutal — o que tá bom, o que tá ruim, sem laquê

### O que é genuinamente bom

1. **Arquitetura limpa.** TS strict, design tokens, CSS modules, testes, CI gates. Raro pra solo founder. Segundo dev é produtivo em 2 dias.
2. **Audit chain + verifier público é primitivo real.** Não é blockchain teatral — é hash-chain com canonical JSON e re-verificação client-side. Única coisa tecnicamente diferenciada do produto inteiro.
3. **Multi-instance shell funciona.** Mineração + maritime no mesmo runtime, prova de tese real (a maioria das startups que diz "plataforma" tá mentindo).
4. **Carlos tem moat real na Caldeira.** 40 anos de contexto local + Caponi (LAPOC) + Mil Caminhos (ESG) — não se compra com dinheiro.
5. **Disciplina de honestidade.** Banner "modeled vs live", labels de proveniência, verifier público — isso é posicionamento de marca de verdade.

### O que tá ruim e ninguém vai dizer na cara

1. **Zero clientes pagantes.** Meteoric é "development partner" — eufemismo elegante pra "ainda não assinou". Toda a tese de "construído dentro do projeto" depende desse fechamento.
2. **"9.4/10 em 9 personas" é auto-atribuído.** Carlos avaliando Carlos. Investidor sério cheira isso na primeira leitura. Trocar por métrica externa real (X demos → Y LOIs → Z reuniões repetidas) seria mais honesto e mais forte.
3. **Plataforma horizontal sem âncora vertical fechada = armadilha clássica.** Mineração + agro + defesa + infra + logística no mesmo runtime soa lindo num deck, cheira a "sem foco" pra VC. Regra de ouro early-stage: **uma vertical, uma persona, um caso de uso, até $1M ARR**. Vero viola isso conscientemente.
4. **Surface area de marketing gigante pra pre-revenue.** Founders Deck, Meteoric Deck, marketing globe, dashboard Prefeitura, /trust, multi-instance shell, verifier público, marketing site… Carlos gasta a maior parte do tempo de engenharia em **artefatos narrativos**, não em "primeiro pagamento entrando". Sintoma #1 de founder solo: o que ele controla 100% (código + narrativa) cresce, o que ele não controla (cliente dizendo sim) não.
5. **Stack não tem moat técnico.** Qualquer sênior reproduz audit chain em uma semana. O moat é **bundle + contexto local + Caponi + execução**, não o código. OK — mas Carlos às vezes fala como se o código fosse o moat. Não é.
6. **Pricing é aspiracional.** Argumento "0,03% do NPV" só funciona se o decisor pensa como investidor. CFO de júnior em PFS pensa em $102k como **um analista júnior**. Reframing: "analista que não dorme, faz o trabalho de três, e gera o evidence pack pro próximo raise".
7. **Posicionamento competitivo em sopa.** "Não somos Esri, não somos Palantir, não somos Samsara, não somos Circulor, não somos Minviro" → a pergunta vira "então o que vocês são, em uma frase de elevador?". A frase atual é boa de slide, ruim de elevador.
8. **Solo founder + sem comercial = pipeline morre numa gripe.** Carlos coda + vende + pitcha + escreve doc + formaliza advisor. Insustentável por mais 3 meses. **Hire #1 = comercial, ontem**, não com dinheiro do seed.

---

## 8. Comparação honesta com o que existe

### Os que fazem GIS (Esri/ArcGIS, QGIS, Mapbox, Felt)
- **Ganham em:** mapa, ecossistema, profundidade geo.
- **Perdem em:** evidence chain, AI grounding, units tipadas.
- **Jogada do Vero:** nunca competir como "GIS melhor". Posicionar como **camada de governança que come dado de qualquer GIS**.

### Os que fazem operations / IoT (Samsara, Trackunit, AVEVA PI, Cognite)
- **Ganham em:** telemetria, hardware, integrações OT prontas.
- **Perdem em:** evidência regulatória, vertical lenses, proveniência.
- **Jogada do Vero:** **read-only governance layer ACIMA do SCADA**, não substituição. Carlos já entendeu.

### Os que fazem trust / passport / provenance (Circulor, Minviro, Everledger, Optel, ReSource)
- **Ganham em:** distribuição em OEMs, contratos com Volvo/Polestar/etc.
- **Perdem em:** profundidade técnica, começam na cadeia (não na fonte), single-dimension.
- **Jogada do Vero:** começar na **fonte** (mina, talhão, AOI) — antes da cadeia existir. **Ganhar contra eles é execução comercial em OEMs, não tecnologia.**

### Os que ninguém menciona mas deviam preocupar
- **Palantir Foundry Mining:** caro mas se decidir descer pra junior miner, é problema. Defesa = nicho profundo + preço 10× menor + velocidade.
- **Microsoft Sustainability Manager + Fabric + ArcGIS plugin:** combo que já tá quase fazendo o que Vero faz, sem hash-chain mas com distribuição infinita.
- **Solidatus / Collibra / Atlan:** data lineage / data trust vindo de cima, podem cobrir "prove que o dado não mudou" sem mapa.

### Veredito honesto sobre competição

Vero **tem chance** de prosperar em janela de 18–24 meses, **se**:
1. Focar em uma vertical (aposta: mineração crítica + DPP da UE),
2. Fechar Meteoric até Q3 2026,
3. Carlos parar de construir e começar a vender.

Sem essas três coisas, vira demo lindíssima que aparece como "case study" no LinkedIn de alguém daqui a 3 anos.

---

## 9. Onde a gente pode trampar junto

### Buracos urgentes que dois pares de mão consertam rápido

| Buraco | O que falta | Quem ajuda |
|---|---|---|
| **Pipeline comercial** | Sem CRM, sem cadência outbound, sem dashboard "demos da semana" | BizDev / SDR (mesmo part-time) |
| **Caso de uso #1 cravado** | 2 instâncias, zero fechadas. Foco em uma resolve 80% do ruído | Sparring de estratégia + cortar roadmap |
| **Validação real do persona score** | Trocar "9.4/10" auto-avaliado por 5 entrevistas externas gravadas | Pesquisa qualitativa / produto |
| **Conectores reais (LAPOC primeiro)** | OPC-UA, MQTT, ingest dos instrumentos do Caponi | Engenheiro back com tarimba de dados/protocolos |
| **Material de venda enxuto** | 1 deck de 10 slides, 1 one-pager, 1 vídeo 90s | Designer/redator com mão de PMM |
| **Distribuição** | LinkedIn morto, conferência cara, sem newsletter, sem comunidade | Marketing de conteúdo + community |
| **Segundo dev pra liberar Carlos** | Full-stack que aceite TS strict e o design system | Engenheiro sênior disciplinado |
| **Conselho/Board real** | Caponi + Mil Caminhos é ótimo, falta operador comercial ASX-side | Advisor de mining/defense com rede |

### Cortes que eu sugeriria (conselho mais valioso, mais ignorado)

- **Pausar a instância maritime** até fechar Meteoric. É distração disfarçada de validação.
- **Matar `/business` e `/tech`** (Carlos já redirecionou — agora é deletar os arquivos).
- **Reduzir Founders Deck pela metade.**
- **Tirar do site qualquer número não-auditável** (incluindo o tal 9.4/10).
- **Pausar Wave 2 (`/fork/<hash>`) por 90 dias.** Construir mais primitivos antes do primeiro $1 entrar é vaidade.

---

## 10. Antes de qualquer plano contigo, preciso saber 5 coisas

A resposta muda muito com tuas respostas:

1. **Quem você é nessa história?** Engenheiro? Comercial? Designer? Investidor? Amigo curioso? Co-founder em potencial? — Muda 100% como a gente trampa junto.
2. **Quanto tempo por semana?** 5h "olho amigo", 20h "sócio", 40h "larguei o emprego" são três conversas diferentes.
3. **Você olha isso pra:** investir, entrar como sócio, ajudar como amigo, ou entender se vale virar concorrente/parceiro do teu negócio? — Sem julgamento, só muda meu conselho.
4. **Tua experiência mais relevante?** Mineração? Defesa? SaaS B2B? Compliance? Vendas enterprise? Engenharia de dados? — Me diz onde você tem alavanca real.
5. **Tua tese sobre o problema?**
   - (a) Problema "provar que o dado é verdadeiro" é grande e Vero tá no caminho certo,
   - (b) Problema é grande mas a solução tá errada,
   - (c) Problema é menor do que parece.

Tua tese determina se a gente refina ou re-pivota.

---

## 11. Links úteis pra navegar sozinho

| Pra que | Onde |
|---|---|
| Tese estratégica completa | `docs/strategy.md` |
| Personas internas + externas | `docs/personas/core-personas.md`, `docs/personas/stakeholders.md` |
| Arquitetura geral | `docs/architecture/overview.md` |
| Mapa, MapLibre, UI | `docs/architecture/frontend.md` |
| Data services & API | `docs/architecture/data-service.md` |
| Mensageria / brand | `docs/messaging-strategy.md`, `docs/THEMING.md` |
| NIST 800-53 mapping | `docs/compliance/nist-800-53-mapping.md` |
| CMMC L2 mapping | `docs/compliance/cmmc-level2-mapping.md` |
| Wave 1 verifier (publicado) | `docs/launch/wave-1-public-verifier.md` |
| Wave 2 brief (próximo) | `docs/wave-2-kickoff.md` |
| Hash de bundle de referência | `docs/REFERENCE_BUNDLE_HASH.txt` |
| Como rodar local | `AGENT.md` (seção "How to Run") |
| Deploy | `docs/DEPLOYMENT.md` |

**Como rodar:**
```bash
nvm use
npm install
npm run dev:all   # API + simulação + Vite no :5175
```

---

## TL;DR pra Thiago

> **O que é:** SaaS B2B que mapeia ativo, transmite sensor e prova mudança via hash chain — pra indústrias reguladas (mineração crítica como anchor, defesa e agro como expansão).
> **Quem fez:** Carlos sozinho, dentro do dado da Meteoric / Caldeira, com Caponi (LAPOC) e Mil Caminhos no advisory.
> **Onde tá:** produto rodando em 2 instâncias vivas (mineração + maritime), zero clientes pagantes, $5–7M seed ask aberto.
> **O que é forte:** arquitetura limpa, audit chain real, posicionamento honesto, contexto local irreplicável.
> **O que é fraco:** sem cliente fechado, sem time comercial, plataforma horizontal sem âncora vertical, marketing surface gigante demais pra pre-revenue.
> **O que precisa:** fechar Meteoric, contratar comercial, focar em UMA vertical, parar de construir narrativa nova.
> **Chance de vingar?** Real, mas estreita — janela de 18–24 meses, depende mais de execução comercial do que de mais código.

Me responde as 5 perguntas que eu te volto com plano de 90 dias específico pra você + Carlos + Vero.
