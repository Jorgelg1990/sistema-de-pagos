const crypto = require('crypto');
const { validationResult } = require('express-validator');
const db = require('../db/queries');

exports.createCard = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array().map(e => e.msg).join(', ') });
    }

    const usuarioId = parseInt(req.params.id, 10);
    const user = await db.findUserById(usuarioId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const { numero, titular, expiracion } = req.body;

    const numeroHash = crypto.createHash('sha256').update(numero).digest('hex');
    const ultimosDigitos = numero.slice(-4);

    const card = await db.createCard(usuarioId, numeroHash, ultimosDigitos, titular, expiracion);
    res.status(201).json({ data: card });
  } catch (err) {
    next(err);
  }
};
