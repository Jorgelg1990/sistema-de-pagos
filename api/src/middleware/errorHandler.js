module.exports = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Error interno del servidor';
  console.error(`[${status}] ${message}`);
  res.status(status).json({ error: message });
};
