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
  const result = await pool.query('SELECT * FROM tarjetas WHERE id = $1', [id]);
  return result.rows[0] || null;
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
