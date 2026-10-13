const API_URL = "http://localhost:3000/api/alunos";

const form = document.getElementById("form-aluno");
const tbody = document.getElementById("alunos-tbody");
const btnCancel = document.getElementById("btn-cancel");
const btnSave = document.getElementById("btn-save");

const inputId = document.getElementById("aluno-id");
const inputNome = document.getElementById("nome");
const inputEmail = document.getElementById("email");
const inputCPF = document.getElementById("cpf");
const inputCEP = document.getElementById("cep");
const inputIdade = document.getElementById("idade");
const inputCurso = document.getElementById("curso");

let editandoId = null;

// ========================================
// CARREGAR ALUNOS
// ========================================

async function carregarAlunos() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Erro ao buscar alunos");
    }

    const alunos = await response.json();

    console.log("Alunos recebidos:", alunos);

    tbody.innerHTML = "";

    if (alunos.length === 0) {
      tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center;">
                        Nenhum aluno cadastrado.
                    </td>
                </tr>
            `;

      return;
    }

    alunos.forEach((aluno) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
                <td>${aluno.id}</td>
                <td>${aluno.nome}</td>
                <td>${aluno.email}</td>
                <td>${aluno.cpf}</td>
                <td>${aluno.cep}</td>
                <td>${aluno.idade}</td>
                <td>${aluno.curso}</td>
                <td class="actions">

                    <button
                        class="btn-icon btn-edit"
                        onclick="iniciarEdicao(${aluno.id})">
                        Editar
                    </button>

                    <button
                        class="btn-icon btn-delete"
                        onclick="deletarAluno(${aluno.id})">
                        Excluir
                    </button>

                </td>
            `;

      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Erro ao carregar alunos:", error);

    alert("Erro ao carregar os alunos.");
  }
}

// ========================================
// CADASTRAR / EDITAR
// ========================================

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const aluno = {
    nome: inputNome.value.trim(),

    email: inputEmail.value.trim(),

    curso: inputCurso.value.trim(),

    cpf: inputCPF.value.trim(),

    cep: inputCEP.value.trim(),

    idade: inputIdade.value.trim()
  };

  // Verificação
  if (!aluno.nome || !aluno.email ||  !aluno.cpf || !aluno.cep || !aluno.idade || !aluno.curso ) {
    alert("Preencha todos os campos!");

    return;
  }

  try {
    let response;

    // ====================================
    // EDITAR
    // ====================================

    if (editandoId !== null) {
      response = await fetch(`${API_URL}/${editandoId}`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(aluno),
      });
    }

    // ====================================
    // CADASTRAR
    // ====================================
    else {
      response = await fetch(API_URL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(aluno),
      });
    }

    // Verifica resposta
    if (!response.ok) {
      const erro = await response.json();

      throw new Error(erro.erro || "Erro ao salvar aluno");
    }

    const alunoSalvo = await response.json();

    console.log("Aluno salvo:", alunoSalvo);

    alert(
      editandoId !== null
        ? "Aluno atualizado com sucesso!"
        : "Aluno cadastrado com sucesso!",
    );

    // Limpa formulário
    resetarFormulario();

    // IMPORTANTE:
    // Atualiza a tabela depois de salvar
    await carregarAlunos();
  } catch (error) {
    console.error("Erro ao salvar aluno:", error);

    alert("Erro ao salvar o aluno: " + error.message);
  }
});

// ========================================
// EXCLUIR
// ========================================

async function deletarAluno(id) {
  if (!confirm("Deseja realmente excluir este aluno?")) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Erro ao excluir aluno");
    }

    alert("Aluno excluído com sucesso!");

    await carregarAlunos();
  } catch (error) {
    console.error("Erro ao excluir:", error);

    alert("Erro ao excluir aluno.");
  }
}

// ========================================
// EDITAR
// ========================================

async function iniciarEdicao(id) {
  try {
    const response = await fetch(API_URL);

    const alunos = await response.json();

    const aluno = alunos.find((a) => a.id === id);

    if (!aluno) {
      alert("Aluno não encontrado!");

      return;
    }

    editandoId = aluno.id;

    inputId.value = aluno.id;

    inputNome.value = aluno.nome;

    inputEmail.value = aluno.email;

    inputCEP.value = aluno.cep;

    inputCPF.value = aluno.cpf;

    inputIdade.value = aluno.idade;

    inputCurso.value = aluno.curso;

    btnSave.textContent = "Atualizar";

    btnCancel.style.display = "inline-block";
  } catch (error) {
    console.error(error);

    alert("Erro ao editar aluno.");
  }
}

// ========================================
// CANCELAR
// ========================================

btnCancel.addEventListener("click", () => {
  resetarFormulario();
});

// ========================================
// RESETAR FORMULÁRIO
// ========================================

function resetarFormulario() {
  form.reset();

  inputId.value = "";

  editandoId = null;

  btnSave.textContent = "Salvar Aluno";

  btnCancel.style.display = "none";
}

// ========================================
// INICIAR
// ========================================

carregarAlunos();
