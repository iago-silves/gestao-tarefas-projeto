document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("tarefasContainer");
  const tarefas = await apiRequest("/tarefa/listar");
  tarefas.forEach((t) => container.appendChild(criarCardTarefa(t)));
});
