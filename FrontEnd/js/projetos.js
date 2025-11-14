// projetos.js

document.addEventListener("DOMContentLoaded", () => {
  const projetoForm = document.getElementById("projetoForm");
  const projetosContainer = document.getElementById("projetosContainer");

  let editandoProjetoId = null; // controla edição

  // Referência ao modal
  let projetoModal;
  const modalElement = document.getElementById("modalNovoProjeto");
  if (modalElement) {
    projetoModal = new bootstrap.Modal(modalElement);
  }

  // =============== CADASTRAR OU EDITAR PROJETO ===============
  if (projetoForm) {
    projetoForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nome = document.getElementById("nomeProjeto").value;
      const descricao = document.getElementById("descricaoProjeto").value;
      const usuarioEmail = localStorage.getItem("userEmail");

      try {
        // Obter usuário
        const usuarios = await apiRequest("/usuario/listar", "GET");
        const usuario = usuarios.find((u) => u.email === usuarioEmail);

        if (!usuario) return alert("Usuário não encontrado!");

        if (editandoProjetoId) {
          // ========== ATUALIZAR ==========
          await apiRequest(`/projeto/atualizar/${editandoProjetoId}`, "PUT", {
            nome,
            descricao,
            usuarioId: usuario.id,
          });

          alert("Projeto atualizado com sucesso!");
          editandoProjetoId = null;
        } else {
          // =========== CRIAR ============
          await apiRequest("/projeto/cadastrar", "POST", {
            nome,
            descricao,
            usuarioId: usuario.id,
          });

          alert("Projeto criado com sucesso!");
        }

        projetoForm.reset();
        projetoModal.hide();
        carregarProjetos();
      } catch (err) {
        alert("Erro ao salvar projeto: " + err);
      }
    });
  }

  // =============== LISTAR PROJETOS ===============
  async function carregarProjetos() {
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

  // =============== CLICKS (EDITAR / DELETAR) ===============
  document.addEventListener("click", async (e) => {
    // ------------ DELETAR ------------
    if (e.target.classList.contains("deletar")) {
      const id = e.target.dataset.id;
      if (confirm("Tem certeza que deseja excluir?")) {
        await apiRequest(`/projeto/deletar/${id}`, "DELETE");
        alert("Projeto excluído!");
        carregarProjetos();
      }
    }

    // ------------ EDITAR ------------
    if (e.target.classList.contains("editar")) {
      const id = e.target.dataset.id;

      try {
        const projeto = await apiRequest(`/projeto/${id}`, "GET");

        document.getElementById("nomeProjeto").value = projeto.nome;
        document.getElementById("descricaoProjeto").value = projeto.descricao;

        // Mudar título do modal
        const tituloModal = document.querySelector("#modalNovoProjetoLabel");
        if (tituloModal) tituloModal.textContent = "Editar Projeto";

        editandoProjetoId = id;
        projetoModal.show();
      } catch (err) {
        alert("Erro ao carregar projeto para edição: " + err);
      }
    }
  });
});
