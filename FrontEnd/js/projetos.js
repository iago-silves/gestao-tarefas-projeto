document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("projetosContainer");
  const projetos = await apiRequest("/projeto/listar");
  projetos.forEach((p) => container.appendChild(criarCardProjeto(p)));
});
