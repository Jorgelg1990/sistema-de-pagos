const PYTHON_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';

exports.processPayment = async (amount) => {
  const response = await fetch(`${PYTHON_URL}/process-payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount }),
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    throw Object.assign(new Error(errBody.error || 'Error en servicio de pagos'), { status: 502 });
  }

  return response.json();
};
