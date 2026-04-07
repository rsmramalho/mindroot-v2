╔══════════════════════════════════════╗
║          A T O M   E N V E L O P E  ║
╠══════════════════════════════════════╣
║ id:       [a gerar no Supabase]      ║
║ type:     doc                        ║
║ module:   bridge                     ║
║ state:    structured                 ║
║ status:   active                     ║
║ stage:    3 △ Triangulo              ║
║ tags:     [#system, #infra, #docker, ║
║            #yugar-os, #tutorial]     ║
║ source:   claude-project             ║
║ created:  2026-04-07                 ║
║ updated:  2026-04-07                 ║
╠══════════════════════════════════════╣
║ connections:                         ║
║   → references: infra v1.0          ║
║   → references: dev-workflow v1.0    ║
║   → feeds: README.md operacional    ║
╚══════════════════════════════════════╝

# Yugar OS — Fase 1: Servidor de staging completo

**Versão:** 1.0
**Data:** 07 Abr 2026
**Status:** Active
**Princípio:** PC velho → Ubuntu Server → Docker Compose → stack completa rodando em containers. De zero a staging em uma tarde.

---

## 1. Preparar o PC velho

### 1.1 Requisitos mínimos
- **RAM:** 8GB mínimo (16GB ideal)
- **SSD:** 120GB+ (se tiver HD mecânico, troca por um SSD — AUD 30-40)
- **Rede:** cabo ethernet direto no roteador (não usa Wi-Fi pra servidor)

### 1.2 Instalar Ubuntu Server 24.04 LTS

1. Baixa a ISO: https://ubuntu.com/download/server
2. Grava num USB com Balena Etcher (ou Rufus no Windows)
3. Boot pelo USB, instala com as opções padrão
4. **Importante na instalação:**
   - Marca "Install OpenSSH server" (pra acessar remoto)
   - Cria usuário com senha forte
   - Usa o SSD inteiro, partição padrão

5. Depois do reboot, anota o IP:
```bash
ip addr show | grep "inet " | grep -v 127.0.0.1
```

6. Do teu PC pessoal, testa o acesso SSH:
```bash
ssh <usuario>@<IP_DO_SERVIDOR>
```

### 1.3 IP fixo no roteador

Entra no roteador (geralmente 192.168.1.1) e reserva o IP do servidor via DHCP reservation. Assim ele nunca muda. Exemplo: `192.168.1.100`

### 1.4 Setup inicial do servidor

```bash
# Atualiza tudo
sudo apt update && sudo apt upgrade -y

# Instala ferramentas básicas
sudo apt install -y curl git htop net-tools ufw

# Firewall básico
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp    # HTTP (Caddy)
sudo ufw allow 443/tcp   # HTTPS (Caddy)
sudo ufw allow 9443/tcp  # Portainer
sudo ufw enable

# Hostname (aparece na rede como yugar-server)
sudo hostnamectl set-hostname yugar-server
```

---

## 2. Instalar Docker + Docker Compose

```bash
# Instala Docker (script oficial)
curl -fsSL https://get.docker.com | sudo sh

# Adiciona teu usuário ao grupo docker (sem sudo pra rodar containers)
sudo usermod -aG docker $USER

# Sai e entra de novo pra aplicar
exit
# ssh de volta

# Verifica
docker --version
docker compose version
```

---

## 3. Estrutura de diretórios

```bash
mkdir -p ~/yugar-server/{caddy,portainer,mindroot,constellation,postgres,github-runner}
cd ~/yugar-server
```

A estrutura final:
```
~/yugar-server/
├── docker-compose.yml          # Orquestra tudo
├── .env                        # Variáveis de ambiente
├── caddy/
│   └── Caddyfile              # Rotas de reverse proxy
├── portainer/
│   └── data/                  # Dados persistentes do Portainer
├── postgres/
│   ├── data/                  # Dados do PostgreSQL
│   └── init/
│       └── 00-init.sql        # Cria os bancos na primeira vez
├── mindroot/
│   └── .env.staging           # Env vars do MindRoot staging
├── constellation/
│   └── .env.staging           # Env vars do Constellation staging (placeholder)
└── github-runner/
    └── config/                # Config do runner
```

---

## 4. Arquivo principal: docker-compose.yml

```yaml
# ===========================================
# Yugar Server — Stack Completa de Staging
# ===========================================

services:

  # -----------------------------------------
  # CADDY — Reverse proxy + HTTPS automático
  # -----------------------------------------
  caddy:
    image: caddy:2-alpine
    container_name: yugar-caddy
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./caddy/Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config
    networks:
      - yugar-net
    depends_on:
      - mindroot
      - portainer

  # -----------------------------------------
  # PORTAINER — Gerenciamento visual de containers
  # -----------------------------------------
  portainer:
    image: portainer/portainer-ce:latest
    container_name: yugar-portainer
    restart: unless-stopped
    ports:
      - "9443:9443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./portainer/data:/data
    networks:
      - yugar-net

  # -----------------------------------------
  # POSTGRESQL — Banco de dados local
  # -----------------------------------------
  postgres:
    image: postgres:16-alpine
    container_name: yugar-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-yugar}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: yugar_main
    ports:
      - "5432:5432"
    volumes:
      - ./postgres/data:/var/lib/postgresql/data
      - ./postgres/init:/docker-entrypoint-initdb.d
    networks:
      - yugar-net
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-yugar}"]
      interval: 10s
      timeout: 5s
      retries: 5

  # -----------------------------------------
  # REDIS — Cache + filas
  # -----------------------------------------
  redis:
    image: redis:7-alpine
    container_name: yugar-redis
    restart: unless-stopped
    command: redis-server --appendonly yes --maxmemory 256mb --maxmemory-policy allkeys-lru
    volumes:
      - redis_data:/data
    networks:
      - yugar-net
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # -----------------------------------------
  # MINDROOT — App staging (Vite build)
  # -----------------------------------------
  mindroot:
    build:
      context: ./mindroot/app
      dockerfile: Dockerfile
    container_name: yugar-mindroot
    restart: unless-stopped
    env_file:
      - ./mindroot/.env.staging
    environment:
      - NODE_ENV=staging
    ports:
      - "3001:3000"
    networks:
      - yugar-net
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

  # -----------------------------------------
  # CONSTELLATION — App staging (placeholder)
  # Descomente quando V2 iniciar
  # -----------------------------------------
  # constellation:
  #   build:
  #     context: ./constellation/app
  #     dockerfile: Dockerfile
  #   container_name: yugar-constellation
  #   restart: unless-stopped
  #   env_file:
  #     - ./constellation/.env.staging
  #   environment:
  #     - NODE_ENV=staging
  #   ports:
  #     - "3002:3000"
  #   networks:
  #     - yugar-net
  #   depends_on:
  #     postgres:
  #       condition: service_healthy

  # -----------------------------------------
  # PGADMIN — Interface web pro PostgreSQL
  # -----------------------------------------
  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: yugar-pgadmin
    restart: unless-stopped
    environment:
      PGADMIN_DEFAULT_EMAIL: ${PGADMIN_EMAIL:-admin@yugar.local}
      PGADMIN_DEFAULT_PASSWORD: ${PGADMIN_PASSWORD}
      PGADMIN_CONFIG_SERVER_MODE: "False"
    ports:
      - "5050:80"
    networks:
      - yugar-net
    depends_on:
      - postgres

  # -----------------------------------------
  # WATCHTOWER — Auto-update de imagens
  # -----------------------------------------
  watchtower:
    image: containrrr/watchtower
    container_name: yugar-watchtower
    restart: unless-stopped
    environment:
      - WATCHTOWER_CLEANUP=true
      - WATCHTOWER_POLL_INTERVAL=86400
      - WATCHTOWER_LABEL_ENABLE=false
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    networks:
      - yugar-net

# -----------------------------------------
# NETWORKS
# -----------------------------------------
networks:
  yugar-net:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16

# -----------------------------------------
# VOLUMES
# -----------------------------------------
volumes:
  caddy_data:
  caddy_config:
  redis_data:
```

---

## 5. Arquivo de variáveis: .env

```bash
# ===========================
# Yugar Server — Environment
# ===========================

# PostgreSQL
POSTGRES_USER=yugar
POSTGRES_PASSWORD=troca_por_senha_forte_aqui

# PgAdmin
PGADMIN_EMAIL=admin@yugar.local
PGADMIN_PASSWORD=troca_por_senha_forte_aqui
```

---

## 6. Caddyfile — reverse proxy

```bash
cat > ~/yugar-server/caddy/Caddyfile << 'CADDY'
# Yugar Server — Reverse Proxy

mindroot.yugar.local {
    reverse_proxy mindroot:3000
    tls internal
}

# Descomentar quando Constellation ativar
# constellation.yugar.local {
#     reverse_proxy constellation:3000
#     tls internal
# }

portainer.yugar.local {
    reverse_proxy portainer:9443 {
        transport http {
            tls_insecure_skip_verify
        }
    }
    tls internal
}

pgadmin.yugar.local {
    reverse_proxy pgadmin:80
    tls internal
}
CADDY
```

---

## 7. Init SQL — cria os bancos

```bash
cat > ~/yugar-server/postgres/init/00-init.sql << 'SQL'
-- Cria bancos separados por app
CREATE DATABASE mindroot_staging;
-- CREATE DATABASE constellation_staging;  -- Descomentar quando V2 iniciar
SQL
```

---

## 8. Dockerfile do MindRoot (Vite + serve)

```bash
cat > ~/yugar-server/mindroot/Dockerfile.example << 'DOCKERFILE'
# Multi-stage build para MindRoot (Vite + React)
FROM node:20-alpine AS builder

# Habilita pnpm
RUN corepack enable pnpm

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# Serve estático com serve
FROM node:20-alpine AS runner
RUN npm install -g serve
WORKDIR /app
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
DOCKERFILE
```

**Nota:** o Dockerfile real vive no repo mindroot-v2. Este é um exemplo de referência. Quando clonar o repo, o build context (`./mindroot/app`) deve conter o Dockerfile.

---

## 9. Env staging do MindRoot

```bash
cat > ~/yugar-server/mindroot/.env.staging << 'ENVSTAGING'
VITE_APP_ENV=staging
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx
ENVSTAGING
```

---

## 10. DNS local — acessar por nome em vez de IP

### Opção A: Editar /etc/hosts (simples, por máquina)

No teu **PC pessoal** (não no servidor), adiciona:

```bash
# macOS / Linux
sudo nano /etc/hosts

# Adiciona:
192.168.1.100  mindroot.yugar.local
192.168.1.100  portainer.yugar.local
192.168.1.100  pgadmin.yugar.local
# 192.168.1.100  constellation.yugar.local  # Descomentar quando V2 ativar
```

### Opção B: Pi-hole ou dnsmasq no servidor (resolve pra toda a rede)

Upgrade futuro. O `/etc/hosts` resolve por agora.

---

## 11. Deploy workflow — como o código chega no servidor

### 11.1 Primeira vez: clona o repo

```bash
cd ~/yugar-server/mindroot
git clone https://github.com/[USUARIO]/mindroot-v2.git app
```

### 11.2 Deploy manual (simples, funciona)

```bash
cd ~/yugar-server

# Puxa código novo
cd mindroot/app && git pull && cd ../..

# Rebuilda e reinicia
docker compose up -d --build mindroot
```

### 11.3 Script de deploy automatizado

```bash
cat > ~/yugar-server/deploy.sh << 'DEPLOY'
#!/bin/bash
set -e

echo "=== Yugar Deploy ==="
echo "$(date)"

cd ~/yugar-server

# Pull latest code — só apps com repo clonado
for app in mindroot; do
    if [ -d "$app/app/.git" ]; then
        echo "--- Updating $app ---"
        cd $app/app
        git fetch origin
        LOCAL=$(git rev-parse HEAD)
        REMOTE=$(git rev-parse origin/main)
        if [ "$LOCAL" != "$REMOTE" ]; then
            echo "$app: new commits found, pulling..."
            git pull origin main
            cd ../..
            docker compose up -d --build $app
            echo "$app: rebuilt and restarted"
        else
            echo "$app: already up to date"
            cd ../..
        fi
    fi
done

# Cleanup old images
docker image prune -f

echo "=== Deploy complete ==="
DEPLOY

chmod +x ~/yugar-server/deploy.sh
```

### 11.4 Auto-deploy via cron (opcional)

```bash
# Checa a cada 5 minutos se tem código novo
crontab -e

# Adiciona:
*/5 * * * * /home/$USER/yugar-server/deploy.sh >> /home/$USER/yugar-server/deploy.log 2>&1
```

---

## 12. Subir tudo pela primeira vez

```bash
cd ~/yugar-server

# Sobe a infra primeiro (postgres, redis, caddy, portainer)
docker compose up -d postgres redis caddy portainer pgadmin watchtower

# Espera o postgres ficar healthy (~10s)
docker compose ps

# Depois sobe o app (se já tiver o repo clonado)
docker compose up -d --build mindroot

# Verifica tudo
docker compose ps
```

Resultado esperado:
```
NAME                  STATUS
yugar-caddy           Up
yugar-portainer       Up
yugar-postgres        Up (healthy)
yugar-redis           Up (healthy)
yugar-mindroot        Up
yugar-pgadmin         Up
yugar-watchtower      Up
```

Agora abre no browser do teu PC pessoal:
- `https://mindroot.yugar.local` → MindRoot staging
- `https://portainer.yugar.local` → Dashboard de containers
- `https://pgadmin.yugar.local` → Gerenciar banco de dados

---

## 13. Comandos do dia a dia

```bash
# Ver status de todos os containers
docker compose ps

# Ver logs de um app específico
docker compose logs -f mindroot

# Restart de um app
docker compose restart mindroot

# Parar tudo
docker compose down

# Parar tudo E apagar dados (cuidado!)
docker compose down -v

# Ver uso de recursos
docker stats

# Rebuild de um app após mudanças no Dockerfile
docker compose up -d --build mindroot

# Deploy rápido
./deploy.sh

# Entrar num container (debug)
docker exec -it yugar-mindroot sh

# Acessar postgres direto
docker exec -it yugar-postgres psql -U yugar -d mindroot_staging
```

---

## 14. Backups automáticos do banco

```bash
cat > ~/yugar-server/backup.sh << 'BACKUP'
#!/bin/bash
BACKUP_DIR=~/yugar-server/backups
DATE=$(date +%Y%m%d_%H%M)
mkdir -p $BACKUP_DIR

# Dump de todos os bancos
docker exec yugar-postgres pg_dumpall -U yugar > "$BACKUP_DIR/all_databases_$DATE.sql"

# Mantém só os últimos 7 dias
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete

echo "Backup completo: $BACKUP_DIR/all_databases_$DATE.sql"
BACKUP

chmod +x ~/yugar-server/backup.sh

# Roda todo dia às 3 da manhã
crontab -e
# Adiciona:
# 0 3 * * * /home/$USER/yugar-server/backup.sh >> /home/$USER/yugar-server/backup.log 2>&1
```

---

## 15. Monitoramento básico

```bash
cat > ~/yugar-server/health.sh << 'HEALTH'
#!/bin/bash
echo "=== Yugar Health Check ==="
echo "$(date)"
echo ""

# Containers rodando
echo "--- Containers ---"
docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
echo ""

# Uso de recursos
echo "--- Resources ---"
echo "CPU: $(top -bn1 | grep 'Cpu(s)' | awk '{print $2}')% used"
echo "RAM: $(free -h | awk '/Mem:/{print $3"/"$2}')"
echo "Disk: $(df -h / | awk 'NR==2{print $3"/"$2" ("$5")"}')"
echo ""

# Testa conectividade do MindRoot
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001 2>/dev/null || echo "DOWN")
echo "MindRoot staging -> $STATUS"
HEALTH

chmod +x ~/yugar-server/health.sh
```

---

## 16. Segurança mínima

```bash
# Desabilita login por senha no SSH (usa chave)
# Primeiro, do teu PC pessoal:
ssh-copy-id <usuario>@192.168.1.100

# Depois no servidor:
sudo nano /etc/ssh/sshd_config
# Muda: PasswordAuthentication no
sudo systemctl restart sshd

# Auto-updates de segurança
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades

# Fail2ban (bloqueia IPs com muitas tentativas de login)
sudo apt install -y fail2ban
sudo systemctl enable fail2ban
```

---

## 17. Checklist de validação

Depois de tudo configurado, verifica cada item:

- [ ] SSH funciona do PC pessoal
- [ ] Docker rodando: `docker ps` mostra containers
- [ ] Portainer acessível: `https://portainer.yugar.local`
- [ ] PostgreSQL healthy: `docker compose ps postgres`
- [ ] MindRoot staging acessível: `https://mindroot.yugar.local`
- [ ] PgAdmin acessível: `https://pgadmin.yugar.local`
- [ ] Deploy script funciona: `./deploy.sh`
- [ ] Backup funciona: `./backup.sh`
- [ ] Health check funciona: `./health.sh`
- [ ] IP fixo no roteador configurado
- [ ] DNS local configurado (/etc/hosts)
- [ ] SSH por chave (senha desabilitada)
- [ ] Firewall ativo: `sudo ufw status`

---

## Mapa de portas

| Porta | Serviço | Acesso |
|-------|---------|--------|
| 80 | Caddy (HTTP) | Redirect pra HTTPS |
| 443 | Caddy (HTTPS) | Reverse proxy |
| 3001 | MindRoot staging | mindroot.yugar.local |
| 5432 | PostgreSQL | Direto (só rede local) |
| 5050 | PgAdmin | pgadmin.yugar.local |
| 9443 | Portainer | portainer.yugar.local |
| 6379 | Redis | Interno (não exposto) |

---

## Próximos passos (quando estiver rodando)

1. **Testar o MindRoot** em staging antes de cada deploy no Vercel
2. **Adicionar CI** no GitHub Actions (tsc + vitest + build)
3. **Configurar GitHub Actions** self-hosted runner no servidor (fase futura)
4. **Quando o PC velho engasgar** → hora da Fase 2 (Mac Mini)
5. **Quando V2 ativar** → descomentar Constellation no compose + Caddyfile + DNS

---

## Versionamento

| Versão | Data | Mudança |
|--------|------|---------|
| 1.0 | 2026-04-07 | Documento inaugural. ATOM ENVELOPE adicionado. Stack: Vite + pnpm. Constellation comentado como placeholder. Usernames generalizados. |

---

*De zero a staging em uma tarde.*
*Hardware promovido, nunca descartado.*
