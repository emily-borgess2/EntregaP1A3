const dbService = require('../services/DatabaseService');
const Jogo = require("../models/Jogo");
const JogoUsuarioDTO = require('../dtos/JogoUsuarioDTO');
const JogoDTO = require('../dtos/JogoDTO');

class JogoDAO {
    async all(perfil, categoria) {
        let query = "SELECT * FROM jogos WHERE 1=1";
        const params = [];

        if (perfil) {
            query += " AND perfil_aprendizagem = ?";
            params.push(perfil);
        }

        if (categoria) {
            query += " AND fk_categoria = (SELECT id FROM categorias WHERE nome = ?)";
            params.push(categoria);
        }

        const rows = await dbService.all(query, params);
        if (rows == undefined) return [];
        return rows.map(row => new Jogo(
            row.id, row.nome, row.ano, row.preco, row.desconto,
            row.descricao, row.fk_empresa, row.fk_categoria, row.perfil_aprendizagem
        ));
    }

    async getExhibition() {
        const query = `
            SELECT j.*, c.nome as categoria, e.nome as empresa FROM jogos j
            JOIN categorias c ON c.id = j.fk_categoria
            JOIN empresas e ON e.id = j.fk_empresa`;

        const rows = await dbService.all(query);
        if (rows == undefined) return [];
        return rows.map(row => new JogoDTO(row.nome, row.descricao, row.ano, row.preco, row.desconto, row.categoria, row.empresa));
    }

    async findById(id) {
        const query = "SELECT * FROM jogos WHERE id = ?";
        const row = await dbService.get(query, [id]);
        if (!row) return null;
        return new Jogo(
            row.id, row.nome, row.ano, row.preco, row.desconto,
            row.descricao, row.fk_empresa, row.fk_categoria, row.perfil_aprendizagem
        );
    }

    async findByUser(id) {
        const query = `
            SELECT j.*, ic.chave_ativacao FROM jogos j
            JOIN itens_carrinho ic ON j.id = ic.fk_jogo
            JOIN carrinhos c ON ic.fk_carrinho = c.id
            WHERE c.fk_usuario = ?`;
        const rows = await dbService.all(query, [id]);
        if (rows == undefined) return [];
        return rows.map(row => new JogoUsuarioDTO(row.chave_ativacao, new Jogo(
            row.id, row.nome, row.ano, row.preco, row.desconto,
            row.descricao, row.fk_empresa, row.fk_categoria, row.perfil_aprendizagem
        )));
    }

    async create(jogo) {
        const query = "INSERT INTO jogos (nome, descricao, ano, preco, desconto, fk_empresa, fk_categoria, perfil_aprendizagem) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        const params = [jogo.nome, jogo.descricao, jogo.ano, jogo.preco ?? 0, jogo.desconto, jogo.fkEmpresa, jogo.fkCategoria, jogo.perfilAprendizagem];
        const result = await dbService.run(query, params);
        jogo.id = result.lastID;
        return jogo;
    }

    async update(jogo) {
        const query = "UPDATE jogos set nome = ?, descricao = ?, ano = ?, preco = ?, desconto = ?, fk_empresa = ?, fk_categoria = ?, perfil_aprendizagem = ? where id = ?";
        const params = [jogo.nome, jogo.descricao, jogo.ano, jogo.preco ?? 0, jogo.desconto, jogo.fkEmpresa, jogo.fkCategoria, jogo.perfilAprendizagem, jogo.id];
        const result = await dbService.run(query, params);
        return { changes: result.changes };
    }

    async delete(id) {
        const query = "DELETE FROM jogos WHERE id = ?";
        const result = await dbService.run(query, [id]);
        return { changes: result.changes };
    }
}

module.exports = new JogoDAO();
