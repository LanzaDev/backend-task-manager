# **Task-Manager**

Repositório da API do **Task Manager**, um sistema para gerenciar tarefas de forma prática.

## O que é o Task Manager?

<details>
  <summary>Sobre o projeto</summary>
    <p>O Task Manager é um projeto acadêmico desenvolvido com o objetivo de criar um sistema fullstack de gerenciamento de tarefas. A proposta inicial era utilizar PHP, Bootstrap e MySQL, mas a escolha das tecnologias ficou a critério dos alunos, desde que o objetivo fosse atingido.</p>
    <p>Aproveitei essa liberdade para adotar ferramentas, arquiteturas e conceitos modernos, buscando aproximar o projeto de práticas utilizadas no mercado e, ao mesmo tempo, ampliar meu aprendizado. Como o escopo do sistema era simples, pude concentrar esforços em estudar e aplicar essas tecnologias de forma mais aprofundada.</p>
    <p>O projeto é fullstack: no momento está disponível apenas o backend, enquanto o frontend está em desenvolvimento em parceria com o @bertolucciDev.</p>
</details>

⚡ Requisitos:<br>
`Node v22.*`<br>
`Banco de dados Postgres (ou SQLite para testes rápidos)`<br>
`Redis`<br>
`Docker`<br>
`pnpm (ou npm + corepack)`

## 💡 Útil

<details>
  <summary>Instalando o pnpm</summary>

Caso não tenha o gerenciador de pacotes [pnpm](https://pnpm.io/pt) instalado, recomendo que instale:

Instalação global:

```bash
npm install -g pnpm
```

ou usando o corepack (não instala globalmente):

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

</details>

<details>
  <summary>Consigo rodar o projeto sem o Docker?</summary>
  <p>É possível! Mas não recomendo. Caso opte por não utilizar o Docker, será necessário instalar o <code>Postgres</code> e o <code>Redis</code> manualmente. O Postgres pode ser substituído pelo SQLite no <code>prisma.schema</code>, mas o Redis ainda precisará ser instalado na sua máquina.</p>
</details>

## 📦 Como rodar o projeto localmente?

<details>
  <summary>Passo a passo</summary>

Siga os passos abaixo para configurar e rodar o projeto localmente:

### 1. Clone o repositório e acesse a pasta gerada

```bash
git clone https://github.com/LanzaDev/backend-task-manager.git
cd backend-task-manager
```

### 2. Copie o arquivo de ambiente

```bash
cp .env.example .env
```

### 3. Configure o seu `.env` de acordo com suas necessidades

#### Exemplo:

```bash
# App
APP_NAME="Task-Manager"
APP_ENV="dev"
APP_PORT="3000"
APP_URL="http://localhost:3000"

# Database
DATABASE_USERNAME="task"
DATABASE_PASSWORD="123"
DATABASE_HOST="localhost"
DATABASE_PORT="5432"
DATABASE_NAME="task"
DATABASE_URL="postgres://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}"

# Cache
CACHE_HOST="127.0.0.1"
CACHE_PORT="6379"
CACHE_PASSWORD="senha123"
CACHE_DB="0"
CACHE_TTL="60"
CACHE_URL="redis://:senha123@127.0.0.1:6379/0"

# Auth
JWT_SECRET="chave-secreta123"
ACCESS_TOKEN_EXP="900"
REFRESH_TOKEN_EXP="7200"

# Email
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="465"
EMAIL_USER="email.example@gmail.com"
EMAIL_PASSWORD="senha123"
EMAIL_FAKE="false"
```

### 4. Instale as dependências

```bash
pnpm install
```

### 5. Configure o banco de dados com o Prisma

#### 5.1 PostgreSQL

##### 1. Crie as tabelas no banco a partir das migrations

```bash
pnpm prisma migrate dev
```

##### 2. (Opcional) Abra o Prisma Studio para inspecionar o banco

```bash
pnpm prisma studio
```

#### 5.2 SQLite (mais simples e rápido)

##### 1. Altere o provider no `schema.prisma` para *"sqlite"*:

```bash
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

##### 2. Configure o `.env`:

```bash
DATABASE_URL="file:./dev.db"
```

##### 3. Crie o banco e as tabelas:

```bash
pnpm prisma db push
```

### 6. Subindo containers com o Docker

(Caso não use o Docker, pule este passo)

* Subir apenas o Redis (quando usar SQLite + Redis):

```bash
docker compose up redis -d
```

* Subir Postgres + Redis (setup completo):

```bash
docker compose up -d
```

### 7. Inicie a aplicação localmente

```bash
pnpm run start
```

</details>
