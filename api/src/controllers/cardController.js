const crypto = require('crypto');
const { validationResult } = require('express-validator');
const db = require('../db/queries');

const CARD_SECRET = process.env.CARD_SECRET;

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

    const expiracionRegex = /^(0[1-9]|1[0-2])\/(\d{4})$/;
    const match = expiracion.match(expiracionRegex);
    if (match) {
      const expMonth = parseInt(match[1], 10);
      const expYear = parseInt(match[2], 10);
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();
      if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
        return res.status(400).json({ error: 'La tarjeta ya está vencida' });
      }
    }

    const numeroHash = crypto.createHmac('sha256', CARD_SECRET).update(numero).digest('hex');
    const ultimosDigitos = numero.slice(-4);

    const existingCard = await db.findCardByHashAndUser(numeroHash, usuarioId);
    if (existingCard) {
      return res.status(409).json({ error: 'La tarjeta ya está registrada para este usuario' });
    }

    const card = await db.createCard(usuarioId, numeroHash, ultimosDigitos, titular, expiracion);
    res.status(201).json({ data: card });
  } catch (err) {
    next(err);
  }
};
