const dbService = require('../services/DatabaseService');
const Plano = require('../models/Plano');

class PlanoDAO {
    async all() {
        const planos = await dbService.all('SELECT * FROM planos ORDER BY limite_jogos');
        const precos = await dbService.all('SELECT * FROM planos_precos');

        return planos.map(function (plano) {
            const precosPerfil = {};
            precos.filter(p => p.fk_plano === plano.id).forEach(function (p) {
                precosPerfil[p.perfil_aprendizagem] = p.preco_mensal;
            });
            return {
                id: plano.id,
                nome: plano.nome,
                limiteJogos: plano.limite_jogos,
                precos: precosPerfil
            };
        });
    }

    async findById(id) {
        const plano = await dbService.get('SELECT * FROM planos WHERE id = ?', [id]);
        if (!plano) return null;

        const precosRows = await dbService.all(
            'SELECT * FROM planos_precos WHERE fk_plano = ?',
            [id]
        );
        const precos = {};
        precosRows.forEach(function (p) {
            precos[p.perfil_aprendizagem] = p.preco_mensal;
        });

        return {
            id: plano.id,
            nome: plano.nome,
            limiteJogos: plano.limite_jogos,
            precos: precos
        };
    }

    async getPreco(planoId, perfil) {
        const row = await dbService.get(
            'SELECT preco_mensal FROM planos_precos WHERE fk_plano = ? AND perfil_aprendizagem = ?',
            [planoId, perfil]
        );
        return row ? row.preco_mensal : 0;
    }
}

module.exports = new PlanoDAO();
