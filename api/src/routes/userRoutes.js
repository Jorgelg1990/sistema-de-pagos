const { Router } = require('express');
const { body, param } = require('express-validator');
const userController = require('../controllers/userController');
const paymentController = require('../controllers/paymentController');

const router = Router();

router.post(
  '/',
  [
    body('nombre')
      .isString().withMessage('nombre debe ser un texto')
      .trim()
      .isLength({ min: 1, max: 100 }).withMessage('nombre debe tener entre 1 y 100 caracteres'),
    body('email')
      .isEmail().withMessage('email debe ser un correo válido')
      .normalizeEmail(),
  ],
  userController.createUser
);

router.get(
  '/:id',
  [
    param('id').isInt().withMessage('id debe ser un número entero'),
  ],
  userController.getUser
);

router.get(
  '/:id/payments',
  [
    param('id').isInt().withMessage('id debe ser un número entero'),
  ],
  paymentController.getPayments
);

router.get(
  '/:id/payments/stats',
  [
    param('id').isInt().withMessage('id debe ser un número entero'),
  ],
  paymentController.getPaymentStats
);

module.exports = router;
