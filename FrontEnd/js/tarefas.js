// tarefas.js

document.addEventListener("DOMContentLoaded", () => {
  const tarefaForm = document.getElementById("tarefaForm");
  const tarefasContainer = document.getElementById("tarefasContainer");

  // =============== CADASTRAR NOVA TAREFA ===============
  if (tarefaForm) {
    tarefaForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const titulo = document.getElementById("tituloTarefa").value;
      const descricao = document.getElementById("descricaoTarefa").value;
      const projetoId = document.getElementById("projetoSelect").value;
      const prioridade = document.getElementById("prioridadeTarefa").value;

      try {
        await apiRequest("/tarefa/cadastrar", "POST", {
          titulo,
          descricao,
          projetoId,
          prioridade,
          percentual: 0,
        });

        alert("Tarefa cadastrada com sucesso!");
        tarefaForm.reset();
        carregarTarefas();
      } catch (err) {
        alert("Erro ao cadastrar tarefa: " + err);
      }
    });
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
          "tarefa-item p-2 border rounded mb-2 bg-white shadow-sm";
        div.innerHTML = `
          <strong>${t.titulo}</strong> — ${t.status}<br>
          <small>${t.descricao}</small>
        `;
        tarefasContainer.appendChild(div);
      });
    } catch (err) {
      tarefasContainer.innerHTML = `<p>Erro ao carregar tarefas.</p>`;
    }
  }

  carregarTarefas();
});
