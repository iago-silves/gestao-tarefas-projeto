// projetos.js

document.addEventListener("DOMContentLoaded", () => {
  const projetoForm = document.getElementById("projetoForm");
  const projetosContainer = document.getElementById("projetosContainer");

  const modalProjeto = document.getElementById("modalProjeto");
  const modalProjetoLabel = document.getElementById("modalProjetoLabel");

  const projetoIdInput = document.getElementById("projetoId");
  const nomeProjetoInput = document.getElementById("nomeProjeto");
  const descricaoProjetoInput = document.getElementById("descricaoProjeto");

  // =========================================================
  // BOTÃO "NOVO PROJETO" → LIMPAR MODAL
  // =========================================================
  document.getElementById("novoProjetoBtn").addEventListener("click", () => {
    modalProjetoLabel.textContent = "Novo Projeto";
    projetoIdInput.value = "";
    projetoForm.reset();
  });

  // =========================================================
  // SUBMETER FORMULÁRIO (CRIAR OU EDITAR)
  // =========================================================
  if (projetoForm) {
    projetoForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const id = projetoIdInput.value;
      const nome = nomeProjetoInput.value;
      const descricao = descricaoProjetoInput.value;
      const usuarioEmail = localStorage.getItem("userEmail");

      if (!usuarioEmail) {
        alert("Usuário não logado!");
        return;
      }

      try {
        // Buscar ID do usuário pelo email
        const usuarios = await apiRequest("/usuario/listar", "GET");
        const usuario = usuarios.find((u) => u.email === usuarioEmail);

        if (!usuario) {
          alert("Usuário não encontrado.");
          return;
        }

        // -------------------------
        // EDITAR
        // -------------------------
        if (id) {
          await apiRequest(`/projeto/editar/${id}`, "PUT", {
            nome,
            descricao,
            usuarioId: usuario.id,
          });

          alert("Projeto atualizado com sucesso!");
        }
        // -------------------------
        // CRIAR
        // -------------------------
        else {
          await apiRequest("/projeto/cadastrar", "POST", {
            nome,
            descricao,
            usuarioId: usuario.id,
          });

          alert("Projeto cadastrado com sucesso!");
        }

        projetoForm.reset();

        // Fechar modal
        bootstrap.Modal.getInstance(modalProjeto).hide();

        carregarProjetos();
      } catch (err) {
        alert("Erro ao salvar projeto: " + err);
      }
    });
  }

  // =========================================================
  // LISTAR PROJETOS
  // =========================================================
  async function carregarProjetos() {
    if (!projetosContainer) return;

    try {
      const projetos = await apiRequest("/projeto/listar", "GET");
      projetosContainer.innerHTML = "";

      projetos.forEach((p) => {
        const div = document.createElement("div");
        div.className =
          "projeto-item p-3 border rounded mb-2 bg-light shadow-sm";

        div.innerHTML = `
          <h4>${p.nome}</h4>
          <p>${p.descricao}</p>

          <button class="btn btn-sm btn-primary editar" data-id="${p.id}">
            Editar
          </button>

          <button class="btn btn-sm btn-danger deletar" data-id="${p.id}">
            Excluir
          </button>
        `;

        projetosContainer.appendChild(div);
      });
    } catch (err) {
      projetosContainer.innerHTML = `<p>Erro ao carregar projetos.</p>`;
    }
  }

  carregarProjetos();

  // =========================================================
  // EVENTOS: EDITAR & DELETAR
  // =========================================================
  document.addEventListener("click", async (e) => {
    const id = e.target.dataset.id;

    // --------------------- EDITAR ---------------------
    if (e.target.classList.contains("editar")) {
      try {
        // Pegamos todos os projetos e filtramos pelo ID (já que não existe rota /projeto/buscar)
        const projetos = await apiRequest("/projeto/atualizar/:id", "GET");
        const projeto = projetos.find((p) => p.id == id);

        if (!projeto) {
          alert("Projeto não encontrado!");
          return;
        }

        modalProjetoLabel.textContent = "Editar Projeto";

        projetoIdInput.value = projeto.id;
        nomeProjetoInput.value = projeto.nome;
        descricaoProjetoInput.value = projeto.descricao;

        const modal = new bootstrap.Modal(modalProjeto);
        modal.show();
      } catch (err) {
        alert("Erro ao carregar projeto para edição: " + err);
      }
    }

    // --------------------- DELETAR ---------------------
    if (e.target.classList.contains("deletar")) {
      if (confirm("Tem certeza que deseja excluir este projeto?")) {
        await apiRequest(`/projeto/deletar/${id}`, "DELETE");
        alert("Projeto excluído!");
        carregarProjetos();
      }
    }
  });
});
