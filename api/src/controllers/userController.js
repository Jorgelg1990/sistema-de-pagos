const { validationResult } = require('express-validator');
const db = require('../db/queries');

exports.createUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array().map(e => e.msg).join(', ') });
    }

    const { nombre, email } = req.body;

    const existing = await db.findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }

    const user = await db.createUser(nombre, email);
    res.status(201).json({ data: user });
  } catch (err) {
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array().map(e => e.msg).join(', ') });
    }

    const id = parseInt(req.params.id, 10);
    const user = await db.findUserById(id);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ data: user });
  } catch (err) {
    next(err);
  }
};
