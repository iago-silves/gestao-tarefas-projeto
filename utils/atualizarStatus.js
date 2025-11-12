function atualizarStatus(tarefa) {
    if (tarefa.percentual === 0) return "pendente";
    if (tarefa.percentual === 100) return "concluida";
    return "em_andamento";
}

module.exports = atualizarStatus;
