const { Router } = require('express');
const { body } = require('express-validator');
const controller = require('../controllers/paymentController');

const router = Router();

router.post(
  '/',
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

module.exports = router;
