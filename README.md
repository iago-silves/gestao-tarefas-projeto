# 🗂️ Sistema de Gerenciamento de Projetos e Tarefas  
![Status](https://img.shields.io/badge/status-em_desenvolvimento-yellow)
![Node](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)
![Express](https://img.shields.io/badge/Express.js-4.x-lightgrey?logo=express)
![Sequelize](https://img.shields.io/badge/ORM-Sequelize-blue?logo=sequelize)
![License](https://img.shields.io/badge/license-MIT-blue)

Um backend completo para gerenciamento de **usuários**, **projetos** e **tarefas**, desenvolvido em **Node.js + Express + Sequelize**, com controle de progresso automático dos projetos baseado no status das tarefas.

---

## Sobre o Projeto
Este sistema implementa um backend RESTful para controle de produtividade. Ele permite:

- Cadastro e autenticação simples de usuários.  
- Criação, edição, listagem e exclusão de projetos.  
- Gerenciamento completo de tarefas com prioridade, percentual concluído e status.  
- Cálculo automatizado do progresso total de cada projeto.  
- Filtro inteligente de tarefas por status e responsável.

Ideal para estudos, portfólios e como base de sistemas reais de gestão.

---

## Tecnologias Utilizadas

### Linguagens
- **Node.js**
- **JavaScript**

### Frameworks e Ferramentas
- **Express.js**
- **Sequelize ORM**
- **MySQL / PostgreSQL (via Sequelize)
- **dotenv**  
- **body-parser**

---

## Pré-requisitos

Antes de rodar o projeto, verifique se possui:

- **Node.js**
- **Banco de dados compatível com Sequelize MySql** 
- **NPM ou Yarn**
- Arquivo `.env` configurado

### Estrutura esperada do `.env`:

```env
DB_NAME=seu_banco
DB_USER=seu_usuario
DB_PASS=sua_senha
DB_HOST=localhost
DB_DIALECT=mysql
