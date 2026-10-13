const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, "db.json");

// MIDDLEWARES
app.use(cors());
app.use(express.json());

// FRONTEND
app.use(express.static(path.join(__dirname, "public1")));

// Função auxiliar para ler o banco de dados
function LerBancoDados() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(
      DB_FILE,
      JSON.stringify({ alunos: [] }, null, 2)
    );
  }

  const data = fs.readFileSync(DB_FILE, "utf-8");

  return JSON.parse(data);
}

// Função auxiliar para salvar no banco
function SalvarBancosDados(dados) {
  fs.writeFileSync(
    DB_FILE,
    JSON.stringify(dados, null, 2)
  );
}

// ==============================
// ROTAS DA API
// ==============================

// CREATE - criar aluno
app.post("/api/alunos", (req, res) => {
  const { nome, email,  cpf, cep, idade, curso } = req.body;

  // Validação
  if (!nome || !email || !cpf || !cep || !idade || !curso) {
    return res.status(400).json({
      erro: "Todos os campos sao obrigatorios!"
    });
  }

  const db = LerBancoDados();

  // Calcula o próximo ID
  const nextID =
    db.alunos.length > 0
      ? Math.max(...db.alunos.map((a) => a.id)) + 1
      : 1;

  const novoAluno = {
    id: nextID,
    nome,
    email,
    cep,
    cpf,
    idade,
    curso,
  };

  db.alunos.push(novoAluno);

  SalvarBancosDados(db);

  res.status(201).json(novoAluno);
});

// READ - listar alunos
app.get("/api/alunos", (req, res) => {
  const db = LerBancoDados();

  res.json(db.alunos);
});

// ========================================
// UPDATE - editar aluno
// ========================================

app.put("/api/alunos/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const { nome, email, cpf, cep, idade, curso } = req.body;

  if (!nome || !email || !cpf || !cep || !idade || !curso) {
    return res.status(400).json({
      erro: "Todos os campos sao obrigatorios!"
    });
  }

  const db = LerBancoDados();

  const index = db.alunos.findIndex(
    (aluno) => aluno.id === id
  );

  if (index === -1) {
    return res.status(404).json({
      erro: "Aluno nao encontrado"
    });
  }

  db.alunos[index] = {
    id: id,
    nome: nome,
    email: email,
    curso: curso,
    cpf: cpf,
    cep: cep,
    idade: idade,
  };

  SalvarBancosDados(db);

  res.json(db.alunos[index]);
});




// DELETE - excluir aluno
app.delete("/api/alunos/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const db = LerBancoDados();

  const index = db.alunos.findIndex(
    (a) => a.id === id
  );

  if (index === -1) {
    return res.status(404).json({
      erro: "Aluno nao encontrado"
    });
  }

  db.alunos.splice(index, 1);

  SalvarBancosDados(db);

  res.status(204).send();
});

// ==============================
// INICIA O SERVIDOR
// ==============================

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}`);
  console.log(`Banco de dados local ativo no arquivo db.json`);
});
