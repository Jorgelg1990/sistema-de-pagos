const { validationResult } = require('express-validator');
const db = require('../db/queries');
const paymentService = require('../services/paymentService');

exports.createPayment = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array().map(e => e.msg).join(', ') });
    }

    const usuario_id = parseInt(req.body.usuario_id, 10);
    const tarjeta_id = parseInt(req.body.tarjeta_id, 10);
    const monto = parseFloat(req.body.monto);

    const user = await db.findUserById(usuario_id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const card = await db.findCardById(tarjeta_id);
    if (!card) {
      return res.status(404).json({ error: 'Tarjeta no encontrada' });
    }

    if (card.usuario_id !== usuario_id) {
      return res.status(400).json({ error: 'La tarjeta no pertenece al usuario' });
    }

    let estado = 'rejected';
    let mensaje = 'Servicio de pagos no disponible';

    try {
      const result = await paymentService.processPayment(monto);
      estado = result.status;
      mensaje = result.message;
    } catch (err) {
      mensaje = err.message;
    }

    const payment = await db.createPayment(usuario_id, tarjeta_id, monto, estado, mensaje);
    res.status(201).json({ data: payment });
  } catch (err) {
    next(err);
  }
};

exports.getPayments = async (req, res, next) => {
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

    const payments = await db.getPaymentsByUser(usuarioId);
    res.json({ data: payments });
  } catch (err) {
    next(err);
  }
};

exports.getPaymentStats = async (req, res, next) => {
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

    const stats = await db.getPaymentStats(usuarioId);
    res.json({ data: stats });
  } catch (err) {
    next(err);
  }
};
