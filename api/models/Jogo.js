class Jogo {
    constructor(id, nome, ano, preco, desconto, descricao, fkEmpresa, fkCategoria, perfilAprendizagem) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.ano = ano;
        this.preco = preco;
        this.desconto = desconto;
        this.fkEmpresa = fkEmpresa;
        this.fkCategoria = fkCategoria;
        this.perfilAprendizagem = perfilAprendizagem;
    }

    static fromRequest(body) {
        return new Jogo(
            body.id,
            body.nome,
            body.ano,
            body.preco ?? 0,
            body.desconto,
            body.descricao,
            body.fkEmpresa,
            body.fkCategoria,
            body.perfilAprendizagem
        );
    }
}

module.exports = Jogo;