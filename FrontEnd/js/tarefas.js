document.addEventListener("DOMContentLoaded", () => {
  const tarefaForm = document.getElementById("tarefaForm");
  const tarefasContainer = document.getElementById("tarefasContainer");
  const projetoSelect = document.getElementById("projetoSelect");

  let editandoTarefaId = null; // Armazena o ID da tarefa em edição

  // Referência ao modal Bootstrap
  let tarefaModal;
  const modalElement = document.getElementById("tarefaModal");
  if (modalElement) {
    tarefaModal = new bootstrap.Modal(modalElement);
  }

  // =============== CADASTRAR / ATUALIZAR TAREFA ===============
  if (tarefaForm) {
    tarefaForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const titulo = document.getElementById("tituloTarefa").value;
      const descricao = document.getElementById("descricaoTarefa").value;
      const projetoId = document.getElementById("projetoSelect").value;
      const prioridade = document.getElementById("prioridadeTarefa").value;
      const status = document.getElementById("statusTarefa").value;
      try {
        if (editandoTarefaId) {
          // Atualizar tarefa existente
          await apiRequest(`/tarefa/atualizar/${editandoTarefaId}`, "PUT", {
            titulo,
            descricao,
            projetoId,
            prioridade,
            percentual: 0,
            status,
          });

          alert("Tarefa atualizada com sucesso!");
          editandoTarefaId = null;
        } else {
          // Criar nova tarefa
          await apiRequest("/tarefa/cadastrar", "POST", {
            titulo,
            descricao,
            projetoId,
            prioridade,
            percentual: 0,
            status,
          });

          alert("Tarefa cadastrada com sucesso!");
        }

        tarefaForm.reset();
        tarefaModal.hide(); // Fecha o modal após salvar
        carregarTarefas();
      } catch (err) {
        alert("Erro ao salvar tarefa: " + err);
      }
    });
  }

  // =============== CARREGAR PROJETOS NO SELECT ===============
  async function carregarProjetos() {
    if (!projetoSelect) return;

    try {
      const projetos = await apiRequest("/projeto/listar", "GET");
      projetoSelect.innerHTML =
        '<option value="">Selecione um projeto</option>';

      projetos.forEach((p) => {
        const opt = document.createElement("option");
        opt.value = p.id;
        opt.textContent = p.nome;
        projetoSelect.appendChild(opt);
      });
    } catch (err) {
      console.error("Erro ao carregar projetos:", err);
    }
  }

  // =============== LISTAR TAREFAS ===============
  async function carregarTarefas() {
    if (!tarefasContainer) return;

    try {
      const tarefas = await apiRequest("/tarefa/listar", "GET");

      tarefasContainer.innerHTML = "";

      tarefas.forEach((t) => {
        const div = document.createElement("div");
        div.className =
          "tarefa-item p-3 border rounded mb-2 bg-white shadow-sm";

        div.innerHTML = `
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <strong>${t.titulo}</strong> — <em>${t.status || ""}</em><br>
              <small>${t.descricao || ""}</small>
            </div>
            <div>
              <button class="btn btn-sm btn-primary me-2 editar-btn" data-id="${
                t.id
              }">Editar</button>
              <button class="btn btn-sm btn-danger excluir-btn" data-id="${
                t.id
              }">Excluir</button>
            </div>
          </div>
        `;

        tarefasContainer.appendChild(div);
      });

      // Vincula eventos
      document
        .querySelectorAll(".editar-btn")
        .forEach((btn) => btn.addEventListener("click", editarTarefa));
      document
        .querySelectorAll(".excluir-btn")
        .forEach((btn) => btn.addEventListener("click", excluirTarefa));
    } catch (err) {
      tarefasContainer.innerHTML = `<p>Erro ao carregar tarefas.</p>`;
    }
  }

  // =============== EDITAR TAREFA ===============
  async function editarTarefa(e) {
    const id = e.target.getAttribute("data-id");

    try {
      const tarefas = await apiRequest("/tarefa/listar", "GET");
      const tarefa = tarefas.find((t) => t.id == id);
      if (!tarefa) return alert("Tarefa não encontrada!");

      // Preenche o formulário com os dados da tarefa
      document.getElementById("tituloTarefa").value = tarefa.titulo;
      document.getElementById("descricaoTarefa").value = tarefa.descricao;
      document.getElementById("projetoSelect").value = tarefa.projetoId;
      document.getElementById("prioridadeTarefa").value = tarefa.prioridade;
      document.getElementById("statusTarefa").value = tarefa.status;

      editandoTarefaId = id;
      const modalTitle = document.querySelector("#tarefaModal .modal-title");
      if (modalTitle) modalTitle.textContent = "Editar Tarefa";

      // ✅ Abre o modal automaticamente
      if (tarefaModal) tarefaModal.show();
    } catch (err) {
      alert("Erro ao editar tarefa: " + err);
    }
  }

  // =============== EXCLUIR TAREFA ===============
  async function excluirTarefa(e) {
    const id = e.target.getAttribute("data-id");

    if (!confirm("Tem certeza que deseja excluir esta tarefa?")) return;

    try {
      await apiRequest(`/tarefa/deletar/${id}`, "DELETE");
      alert("Tarefa excluída com sucesso!");
      carregarTarefas();
    } catch (err) {
      alert("Erro ao excluir tarefa: " + err);
    }
  }

  // =============== INICIALIZAÇÃO ===============
  carregarProjetos();
  carregarTarefas();
});
