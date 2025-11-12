const API_URL = "http://localhost:8081";

async function listarProjetos() {
  const res = await fetch(`${API_URL}/projeto/listar`);
  const projetos = await res.json();

  const container = document.getElementById("listaProjetos");
  container.innerHTML = "";

  projetos.forEach((p) => {
    container.innerHTML += `
      <div class="col-md-4 mb-3">
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="card-title">${p.nome}</h5>
            <p class="card-text">${p.descricao}</p>
            <div class="progress mb-2">
              <div class="progress-bar" style="width: ${p.progresso || 0}%;">
                ${p.progresso || 0}%
              </div>
            </div>
            <button class="btn btn-sm btn-primary" onclick="abrirTarefas(${
              p.id
            })">Tarefas</button>
            <button class="btn btn-sm btn-danger" onclick="deletarProjeto(${
              p.id
            })">Excluir</button>
          </div>
        </div>
      </div>
    `;
  });
}

async function cadastrarProjeto() {
  const nome = nomeProjeto.value;
  const descricao = descProjeto.value;
  const usuarioId = 1; // mock do usuário logado

  await fetch(`${API_URL}/projeto/cadastrar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, descricao, usuarioId }),
  });

  bootstrap.Modal.getInstance(
    document.getElementById("modalNovoProjeto")
  ).hide();
  listarProjetos();
}

async function deletarProjeto(id) {
  await fetch(`${API_URL}/projeto/deletar/${id}`, { method: "DELETE" });
  listarProjetos();
}

function abrirTarefas(id) {
  localStorage.setItem("projetoId", id);
  window.location.href = "tarefas.html";
}

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

listarProjetos();
