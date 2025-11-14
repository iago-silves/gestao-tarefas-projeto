// projetos.js

document.addEventListener("DOMContentLoaded", () => {
  const projetoForm = document.getElementById("projetoForm");
  const projetosContainer = document.getElementById("projetosContainer");

  // =============== CADASTRAR NOVO PROJETO ===============
  if (projetoForm) {
    projetoForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nome = document.getElementById("nomeProjeto").value;
      const descricao = document.getElementById("descricaoProjeto").value;
      const usuarioEmail = localStorage.getItem("userEmail");

      if (!usuarioEmail) {
        alert("Usuário não logado!");
        return;
      }

      try {
        // busca o id do usuário pelo e-mail
        const usuarios = await apiRequest("/usuario/listar", "GET");
        const usuario = usuarios.find((u) => u.email === usuarioEmail);

        if (!usuario) {
          alert("Usuário não encontrado no sistema.");
          return;
        }

        await apiRequest("/projeto/cadastrar", "POST", {
          nome,
          descricao,
          usuarioId: usuario.id,
        });

        alert("Projeto cadastrado com sucesso!");
        projetoForm.reset();
        carregarProjetos();
      } catch (err) {
        alert("Erro ao cadastrar projeto: " + err);
      }
    });
  }

  // =============== LISTAR PROJETOS ===============
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

  // =============== DELETAR PROJETO ===============
  document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("deletar")) {
      const id = e.target.dataset.id;
      if (confirm("Tem certeza que deseja excluir este projeto?")) {
        await apiRequest(`/projeto/deletar/${id}`, "DELETE");
        alert("Projeto excluído!");
        carregarProjetos();
      }
    }
  });
});
