function criarCardProjeto(projeto) {
  const div = document.createElement("div");
  div.className = "col-md-4";
  div.innerHTML = `
    <div class="card card-projeto p-3 shadow-sm">
      <h5>${projeto.nome}</h5>
      <p>${projeto.descricao}</p>
      <div class="progress mb-2">
        <div class="progress-bar" style="width: ${
          projeto.progresso || 0
        }%"></div>
      </div>
      <small>Progresso: ${projeto.progresso || 0}%</small>
    </div>`;
  return div;
}

function criarCardTarefa(tarefa) {
  const div = document.createElement("div");
  div.className = "col-md-4";
  div.innerHTML = `
    <div class="card card-tarefa p-3 shadow-sm">
      <h6>${tarefa.titulo}</h6>
      <p>${tarefa.descricao}</p>
      <span class="badge bg-${
        tarefa.status === "concluida"
          ? "success"
          : tarefa.status === "em_progresso"
          ? "warning"
          : "secondary"
      }">
        ${tarefa.status}
      </span>
    </div>`;
  return div;
}
