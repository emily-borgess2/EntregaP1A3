const PlanoDAO = require('../daos/PlanoDAO');

class PlanoController {
    async index(req, res) {
        try {
            const planos = await PlanoDAO.all();
            if (!planos || planos.length === 0) {
                return res.status(204).json();
            }
            res.json(planos);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao listar planos.', error: error.message });
        }
    }

    async show(req, res) {
        try {
            const plano = await PlanoDAO.findById(req.params.id);
            if (!plano) {
                return res.status(404).json({ message: 'Plano não encontrado.' });
            }
            res.json(plano);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar plano.', error: error.message });
        }
    }
}

module.exports = new PlanoController();
