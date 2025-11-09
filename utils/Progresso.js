const Tarefa = require("../models/Tarefa");
const Projeto = require("../models/Projeto");

async function recalcularProgresso(projetoId) {
    const tarefas = await Tarefa.findAll({ where: { projetoId } });

    if ( tarefas.length === 0 ) {
        await Projeto.update({ progresso: 0 }, { where: { id: projetoId } });
        return 0;
    }

    const concluidas = tarefas.filter(t => t.status === "concluida").length;

    const progresso = (concluidas / tarefas.length) * 100;

    await Projeto.update(
        { progresso: progresso },
        { where: { id: projetoId } }
    );

    return progresso;
}

module.exports = recalcularProgresso;
