# SGCI - Sistema de Gerenciamento Científico Integrado


- [SGCI - Sistema de Gerenciamento Científico Integrado](#sgci---sistema-de-gerenciamento-científico-integrado)
  - [Instalação do Docker por sistema operacional](#instalação-do-docker-por-sistema-operacional)
    - [Windows](#windows)
    - [MacOS](#macos)
    - [Linux (Ubuntu/Debian)](#linux-ubuntudebian)
  - [Como rodar o projeto](#como-rodar-o-projeto)
  - [Como parar a aplicação](#como-parar-a-aplicação)
  - [Acessando o Banco de Dados](#acessando-o-banco-de-dados)
  - [Problemas comuns](#problemas-comuns)
  - [Credenciais do admin](#credenciais-do-admin)
  - [Credenciais do usuário](#credenciais-do-usuário)

> **Você não precisa instalar Java, Node.js ou MySQL!**\
> Só precisa do **Docker** instalado no seu computador.

---

## Instalação do Docker por sistema operacional

### Windows

1. Baixe e instale o **Docker Desktop** pelo site oficial: https://www.docker.com/products/docker-desktop/
2. Após a instalação, **reinicie o computador** se for solicitado.
3. Abra o **Docker Desktop** antes de rodar os comandos do projeto.
4. Use o **Prompt de Comando** (CMD) ou o **PowerShell** para executar os comandos do:
   [Como rodar o projeto](#como-rodar-o-projeto) no diretório do projeto.

---

### MacOS

1. Baixe e instale o **Docker Desktop** pelo site oficial: https://www.docker.com/products/docker-desktop/
2. Após a instalação, abra o **Docker Desktop** e aguarde a inicialização.
3. Abra o **Terminal** e navegue até a pasta do projeto para executar os comandos do:
   [Como rodar o projeto](#como-rodar-o-projeto) no diretório do projeto.

---

### Linux (Ubuntu/Debian)

1. No **Terminal**, rode um dos comandos abaixo para instalar o Docker e o Docker Compose:

   **Via apt:**

   sudo apt update
   sudo apt install docker.io docker-compose -y

   **Ou via snap (Ubuntu):**

   sudo snap install docker

2. Inicie o serviço do Docker (caso não inicie automaticamente):

   sudo systemctl start docker
   sudo systemctl enable docker

3. Você pode precisar rodar os comandos do projeto com `sudo` no Linux.

---

## Como rodar o projeto

1. **Clone o repositório**

   git clone https://github.com/SelectGabriel/SGCI-Project
   ou baixe o .zip.

2. **Abra o Docker Desktop** e aguarde até ele ficar pronto.

3. **Execute o Docker Compose**

   `sudo` provavelmente será necessário aqui.
   `sudo` docker-compose up --build

   > O primeiro build pode demorar alguns minutos.\
   > Você verá muitos logs no terminal – aguarde até aparecer que os serviços estão rodando.
   > Sabemos que subiu com sucesso quando a ultima mensagem for: Pesquisador Admin criado e vinculado ao usuario admin.

4. **Acesse o sistema:**

   - **Telas/site:** [http://localhost:3000]
   - **API** [http://localhost:8080]

---

## Como parar a aplicação

- Se estiver rodando no terminal: pressione `Ctrl + C`.

- Se rodou em segundo plano (`-d`):
  docker-compose down


---

## Acessando o Banco de Dados

- **Host:** localhost
- **Porta:** 3306
- **Usuário:** usuario
- **Senha:** senhaUsers
- **Banco:** sgci_users

Você pode usar ferramentas como **DBeaver**

---

## Problemas comuns

- **Erro de permissão:**\
  No Linux/Mac, rode os comandos com `sudo` se necessário.
- **Porta já está em uso:**\
  Feche programas que estejam usando as portas 3000, 8080 ou 3306.
- **Docker não está rodando:**\
  Abra o Docker Desktop antes de iniciar os comandos.

  ## Credenciais do admin
  email: admin@sgci.com
  senha: admin123

  ## Credenciais do usuário
  fique a vontade para clicar em Cadastrar Pesquisador


Desenvolvido por Gabriel da Cunha Afonso e Luiz Senji Vidal Tsuchiya