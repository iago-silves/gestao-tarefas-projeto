const API_URL = "http://localhost:8081";
const projetoId = localStorage.getItem("projetoId");

async function listarTarefas() {
  const res = await fetch(`${API_URL}/tarefa/projeto/${projetoId}`);
  const tarefas = await res.json();

  const lista = document.getElementById("listaTarefas");
  lista.innerHTML = "";

  tarefas.forEach((t) => {
    lista.innerHTML += `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <div>
          <strong>${t.titulo}</strong> - ${t.descricao}
          <span class="badge bg-${
            t.status === "concluida"
              ? "success"
              : t.status === "em_progresso"
              ? "warning"
              : "secondary"
          } ms-2">
            ${t.status}
          </span>
        </div>
        <div>
          <button class="btn btn-sm btn-outline-success me-1" onclick="concluirTarefa(${
            t.id
          })">Concluir</button>
          <button class="btn btn-sm btn-outline-danger" onclick="deletarTarefa(${
            t.id
          })">Excluir</button>
        </div>
      </li>
    `;
  });
}

async function cadastrarTarefa() {
  const titulo = tituloTarefa.value;
  const descricao = descTarefa.value;

  await fetch(`${API_URL}/tarefa/cadastrar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ titulo, descricao, projetoId }),
  });

  bootstrap.Modal.getInstance(
    document.getElementById("modalNovaTarefa")
  ).hide();
  listarTarefas();
}

async function concluirTarefa(id) {
  await fetch(`${API_URL}/tarefa/atualizar/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ percentual: 100 }),
  });
  listarTarefas();
}

async function deletarTarefa(id) {
  await fetch(`${API_URL}/tarefa/deletar/${id}`, { method: "DELETE" });
  listarTarefas();
}

function voltar() {
  window.location.href = "projetos.html";
}

listarTarefas();
