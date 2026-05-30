const pool = require('./pool');

exports.createUser = async (nombre, email) => {
  const result = await pool.query(
    'INSERT INTO usuarios (nombre, email) VALUES ($1, $2) RETURNING id, nombre, email, created_at',
    [nombre, email]
  );
  return result.rows[0];
};

exports.findUserByEmail = async (email) => {
  const result = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);
  return result.rows[0] || null;
};

exports.findUserById = async (id) => {
  const result = await pool.query('SELECT id, nombre, email, created_at FROM usuarios WHERE id = $1', [id]);
  return result.rows[0] || null;
};

exports.createCard = async (usuarioId, numeroHash, ultimosDigitos, titular, expiracion) => {
  const result = await pool.query(
    `INSERT INTO tarjetas (usuario_id, numero_hash, ultimos_digitos, titular, expiracion)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, ultimos_digitos, titular, expiracion, created_at`,
    [usuarioId, numeroHash, ultimosDigitos, titular, expiracion]
  );
  return result.rows[0];
};

exports.findCardById = async (id) => {
  const result = await pool.query(
    'SELECT id, usuario_id, ultimos_digitos, titular, expiracion, created_at FROM tarjetas WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
};

exports.findCardByHashAndUser = async (numeroHash, usuarioId) => {
  const result = await pool.query(
    'SELECT id FROM tarjetas WHERE numero_hash = $1 AND usuario_id = $2',
    [numeroHash, usuarioId]
  );
  return result.rows[0] || null;
};

exports.getPaymentStats = async (usuarioId) => {
  const result = await pool.query(
    `SELECT
      COUNT(*) AS total_pagos,
      COUNT(*) FILTER (WHERE estado = 'approved') AS aprobados,
      COUNT(*) FILTER (WHERE estado = 'rejected') AS rechazados,
      COALESCE(SUM(monto) FILTER (WHERE estado = 'approved'), 0) AS monto_total_aprobado,
      COALESCE(AVG(monto), 0) AS monto_promedio
    FROM pagos WHERE usuario_id = $1`,
    [usuarioId]
  );
  return result.rows[0];
};

exports.createPayment = async (usuarioId, tarjetaId, monto, estado, mensaje) => {
  const result = await pool.query(
    `INSERT INTO pagos (usuario_id, tarjeta_id, monto, estado, mensaje)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, usuario_id, tarjeta_id, monto, estado, mensaje, created_at`,
    [usuarioId, tarjetaId, monto, estado, mensaje]
  );
  return result.rows[0];
};

exports.getPaymentsByUser = async (usuarioId) => {
  const result = await pool.query(
    'SELECT id, monto, estado, mensaje, created_at FROM pagos WHERE usuario_id = $1 ORDER BY created_at DESC',
    [usuarioId]
  );
  return result.rows;
};
