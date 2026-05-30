const express = require('express');
const router = express.Router();
const planoController = require('../controllers/PlanoController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', planoController.index);
router.get('/:id', planoController.show);

module.exports = router;
