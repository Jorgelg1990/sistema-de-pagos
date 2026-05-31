const { Router } = require('express');
const { body, param } = require('express-validator');
const controller = require('../controllers/paymentController');

const router = Router();

router.post(
  '/payments',
  [
    body('usuario_id')
      .isInt({ gt: 0 }).withMessage('usuario_id debe ser un entero positivo'),
    body('tarjeta_id')
      .isInt({ gt: 0 }).withMessage('tarjeta_id debe ser un entero positivo'),
    body('monto')
      .isFloat({ gt: 0 }).withMessage('monto debe ser un número positivo'),
  ],
  controller.createPayment
);

router.get(
  '/users/:id/payments',
  [
    param('id').isInt().withMessage('id debe ser un número entero'),
  ],
  controller.getPayments
);

router.get(
  '/users/:id/payments/stats',
  [
    param('id').isInt().withMessage('id debe ser un número entero'),
  ],
  controller.getPaymentStats
);

module.exports = router;
