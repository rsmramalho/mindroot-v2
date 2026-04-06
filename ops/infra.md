╔══════════════════════════════════════╗
║          A T O M   E N V E L O P E  ║
╠══════════════════════════════════════╣
║ id:       [a gerar no Supabase]      ║
║ type:     spec                       ║
║ module:   bridge                     ║
║ state:    structured                 ║
║ status:   active                     ║
║ stage:    3 △ Triangulo              ║
║ tags:     [#system, #infra, #docker, ║
║            #server, #yugar-os,       ║
║            #hardware]                ║
║ source:   claude-project             ║
║ created:  2026-04-07                 ║
║ updated:  2026-04-07                 ║
╠══════════════════════════════════════╣
║ connections:                         ║
║   → references: Genesis v5.0.3       ║
║   → references: ATOM.md v1.2        ║
║   → references: dev-workflow v1.0    ║
║   → feeds: README.md operacional    ║
║   → feeds: PENTAGON.md              ║
╚══════════════════════════════════════╝

# Infraestrutura — Spec Operacional

**Versão:** 1.0
**Data:** 07 Abr 2026
**Status:** Active
**Princípio:** Hardware é promovido, nunca descartado. O ecossistema absorve tudo. De dentro pra fora — inclusive na infraestrutura.

---

## 1 — Visão geral

O Atom opera em três camadas de infra:

| Camada | O que | Onde |
|--------|-------|------|
| **Workstation** | Dev, código, VS Code + Claude Code | PC pessoal |
| **Servidor local** | Staging, Docker, banco local, CI runner | PC dedicado (depois Mac Mini) |
| **Cloud** | Produção, banco prod, DNS, deploy | Vercel + Supabase + Cloudflare |

O princípio é **Corp Shield**: Gmail/Cloudflare como perímetro descartável, Supabase como fonte da verdade, infraestrutura local como lab seguro.

### Limitação do staging local

O servidor local usa PostgreSQL puro — não replica o ecossistema Supabase completo (auth, RLS built-in, edge functions, realtime). Staging valida: layout, fluxos de UI, lógica de negócio, integrações entre containers. Staging **não** valida: auth flows, RLS policies, edge functions, realtime subscriptions. Para essas camadas, usar Vercel preview deploys apontando pro Supabase cloud.

---

## 2 — Fases de evolução

### Fase 0 — Atual
**Workstation solo.** Dev no PC pessoal. Deploy direto pro Vercel. Banco no Supabase cloud. Sem staging.

### Fase 1 — Servidor de staging
**Gatilho:** Agora. Custo: AUD 0 (PC velho reciclado).

| Componente | Descrição |
|------------|-----------|
| Hardware | PC existente (~5 anos), 16GB+ RAM, SSD |
| OS | Ubuntu Server 24.04 LTS |
| Stack | Docker + Portainer + Caddy + PostgreSQL + Redis |
| Acesso | SSH + URLs locais (*.yugar.local) via /etc/hosts |

**Containers:**

| Container | Imagem | Porta | Propósito |
|-----------|--------|-------|-----------|
| yugar-caddy | caddy:2-alpine | 80, 443 | Reverse proxy + HTTPS local |
| yugar-portainer | portainer-ce | 9443 | Gerenciamento visual |
| yugar-postgres | postgres:16-alpine | 5432 | Banco staging |
| yugar-redis | redis:7-alpine | 6379 | Cache + filas |
| yugar-mindroot | build local | 3001 | MindRoot staging |
| yugar-constellation | build local | 3002 | Constellation staging (placeholder — ativar quando V2 iniciar) |
| yugar-pgadmin | pgadmin4 | 5050 | Interface do banco |
| yugar-watchtower | watchtower | — | Auto-update imagens |

**Nota:** o container Constellation está no compose como placeholder. Enquanto V2 estiver paused, pode ser comentado ou simplesmente não buildar (sem repo clonado, o container não sobe).

**Deploy:** cron a cada 5 min puxa código novo do GitHub, rebuilda containers se houver commits novos.

**Referência técnica completa:** `yugar-fase1-guide.md` (docker-compose.yml, Caddyfile, Dockerfiles, scripts de deploy/backup/health).

### Fase 2 — Atom Server
**Gatilho:** PC velho engasga com 3+ containers simultâneos, ou necessidade de IA local (Ollama).

| Componente | Descrição |
|------------|-----------|
| Hardware | Mac Mini M4, 24GB RAM unificada |
| Custo | ~AUD 1.000 |
| Adiciona | Ollama (modelos 13B local), Postgres mais robusto, Gitea (opcional) |
| Consumo | ~15W idle — viável 24/7 |

**Ciclo do hardware:**
- Mac Mini → assume papel de servidor central (staging + IA + banco)
- PC velho → aposentado pra: backup/NAS, media server (Jellyfin), workstation Build & Stay, ou doação via Muda

### Fase 3 — Rede multi-building + touchscreens
**Gatilho:** Buildings do Yugar fisicamente prontos. Touchscreens fazem sentido.

| Componente | Descrição | Custo AUD |
|------------|-----------|-----------|
| Rede | Switch PoE + 3x UniFi AP + Cat6 enterrado | ~1.500 |
| PtP wireless | Ubiquiti (Lab↔Commons se >100m) | ~200 |
| 4x Raspberry Pi 5 | Kiosk nodes (1 por building) | ~520 |
| 4x Touchscreens | 15-27" por building | ~1.600 |

**VLANs:**

| VLAN | Propósito | Acesso |
|------|-----------|--------|
| 1 — Management | Switch, APs, Atom Server | Isolada |
| 10 — Private | Lab, Casa, Workshop | Supabase completo |
| 20 — Commons | Visitantes, comunidade | Só MindRoot role:visitor + internet |
| 30 — IoT | Sensores, câmeras | Só API do server |

**Kiosk config (cada Pi):**
- OS: Raspberry Pi OS Lite (64-bit)
- Browser: Chromium kiosk mode
- Boot: auto-start MindRoot PWA
- Hostname: `yugar-lab`, `yugar-kitchen`, `yugar-workshop`, `yugar-commons`
- Consumo: ~5W. Fanless. Zero manutenção.

**Views por building:**

| Building | Hostname | View MindRoot | Role |
|----------|----------|--------------|------|
| Lab | yugar-lab | Aurora cockpit, deep work, inbox | rick |
| Casa (cozinha) | yugar-kitchen | Meal plan, chores, calendário família | family |
| Workshop | yugar-workshop | Tasks ativas, captura rápida por toque | rick/collaborator |
| Commons | yugar-commons | Agenda pública, amenidades, wi-fi QR | visitor |

### Fase 4 — Yugar OS completo + IoT
**Gatilho:** Profissionais operando no Yugar. Economia de troca ativa.

| Componente | Descrição | Custo AUD |
|------------|-----------|-----------|
| Sensores ESP32 | Tanque de água, solo, clima, energia | ~300 |
| Automação | Solenoides irrigação + Shelly EM solar | ~150 |
| Captura por voz | Mic + Whisper local no workshop | ~50 |

**Dados de sensores:** entram como AtomItems type=resource com extensions JSONB para readings. VLAN 30 (IoT) isolada. Comunicação só com o Atom Server via API.

---

## 3 — Ciclo de vida do hardware

### Regra: nenhum hardware é descartado.

| Hardware | Fase de entrada | Papel inicial | Aposentadoria |
|----------|----------------|---------------|---------------|
| PC pessoal | 0 | Workstation dev | Nunca muda |
| PC velho | 1 | Servidor staging | Fase 2: backup/NAS, media server, Build & Stay, ou Muda |
| Mac Mini M4 | 2 | Atom Server central | Nunca muda (24/7, 15W) |
| Raspberry Pi 5 (x4) | 3 | Kiosk de building | Nunca muda (5W, fanless) |
| ESP32 (xN) | 4 | Sensores IoT | Substituído quando queima (~$5/unidade) |

### Destinos de aposentadoria

| Destino | O que faz | Custo adicional |
|---------|-----------|-----------------|
| **Backup/NAS** | TrueNAS ou OpenMediaVault. Recebe rsync do Atom Server. | AUD 0-80 (HD extra) |
| **Media server** | Jellyfin + Pi-hole. Netflix caseiro + adblock na rede. | AUD 0 |
| **Build & Stay** | Workstation pra voluntário/residente do Yugar. Ubuntu Desktop. | AUD 0 |
| **Muda** | Doação pra micro-empreendedor do programa Muda. | AUD 0 |

---

## 4 — Segurança

### 4.1 Servidor local

| Medida | Implementação |
|--------|--------------|
| SSH por chave | `ssh-copy-id` + `PasswordAuthentication no` |
| Firewall | UFW: só portas 22, 80, 443, 9443 |
| Auto-updates | `unattended-upgrades` habilitado |
| Fail2ban | Bloqueia IPs com tentativas de brute force |
| Docker socket | Protegido — só grupo docker acessa |

### 4.2 Rede (Fase 3+)

| Medida | Implementação |
|--------|--------------|
| VLANs | Segmentação por função (private, commons, IoT) |
| Commons isolada | Só acessa MindRoot endpoint + internet. Sem rede interna. |
| IoT isolada | Só comunica com API do server. Sem internet, sem rede interna. |
| Wi-Fi | WPA3. SSID separado por VLAN. |
| DNS local | Pi-hole ou dnsmasq. Bloqueia ads + resolve *.yugar.local. |

### 4.3 Supabase (RLS)

| Role | Acesso | Buildings |
|------|--------|-----------|
| `rick` | Tudo. Todos modules, items, connections, wraps, soul. | Todos |
| `family` | mod-family, mod-body (meal plan, chores, calendar, library) | Casa, Commons |
| `collaborator` | Tasks atribuídas, projetos compartilhados, captura | Workshop, Commons |
| `visitor` | Items com tag `#commons` apenas | Commons |

Implementação: Supabase RLS policies por role. Referência: Genesis v5, Parte 7.

### 4.4 Secrets

| Secret | Onde vive | Rotação |
|--------|-----------|---------|
| Supabase keys | Vercel Dashboard (prod), .env (staging) | 90 dias |
| Anthropic API key | Supabase edge function env vars | 90 dias |
| SSH key | ~/.ssh/id_ed25519 | Anual |
| Postgres password | .env no servidor | 90 dias |

---

## 5 — Monitoramento da infra

### 5.1 Health check (servidor local)

Script `health.sh` roda via cron a cada hora:

```bash
# Verifica: containers rodando, uso de CPU/RAM/disco, apps respondendo
# Se disco > 80% ou app down → log de alerta
```

### 5.2 Uptime (produção)

| Serviço | Monitor |
|---------|---------|
| MindRoot prod | Health edge function + Vercel Status |
| Supabase | Supabase Status page |
| Cloudflare | Cloudflare Status page |

### 5.3 Quando agir

| Alerta | Ação |
|--------|------|
| Container caiu | `docker compose up -d <container>` |
| Disco > 80% | `docker image prune -f` + limpar backups antigos |
| RAM > 90% | Verificar qual container tá comendo. Restart se necessário. |
| App não responde | Checar logs: `docker compose logs -f <app>` |
| Banco corrompido | Restore do último backup: `backup.sh` → restore |

---

## 6 — Custo consolidado

| Fase | Hardware | Custo AUD | Mensal AUD |
|------|----------|-----------|------------|
| 0 | PC pessoal (já tem) | 0 | 0 |
| 1 | PC velho (já tem) | 0 | ~10 (eletricidade) |
| 2 | Mac Mini M4 | ~1.000 | ~15 (eletricidade) |
| 3 | Rede + Pis + telas | ~3.820 | ~20 (eletricidade) |
| 4 | Sensores + automação | ~500 | ~5 (eletricidade) |
| **Total** | | **~5.320** | |
| **Cloud (todas fases)** | Supabase Pro + Claude API | | **~40-60** |
| **Total mensal (Fase 4)** | | | **~75-100** |

---

## Versionamento

| Versão | Data | Mudança |
|--------|------|---------|
| 1.0 | 2026-04-07 | Documento inaugural. 4 fases de evolução, hardware lifecycle, segurança, VLANs, kiosk config, monitoramento, custos. Limitação staging vs Supabase documentada. Constellation como placeholder. |

---

*Hardware é promovido, nunca descartado.*
*O ecossistema absorve tudo.*
*De dentro pra fora — inclusive na infraestrutura.*
