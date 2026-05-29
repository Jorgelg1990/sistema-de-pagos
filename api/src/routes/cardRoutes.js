const { Router } = require('express');
const { body, param } = require('express-validator');
const controller = require('../controllers/cardController');

const router = Router();

router.post(
  '/:id/cards',
  [
    param('id').isInt().withMessage('id debe ser un número entero'),
    body('numero')
      .isString().withMessage('numero debe ser un texto')
      .matches(/^\d{16}$/).withMessage('numero debe tener 16 dígitos'),
    body('titular')
      .isString().withMessage('titular debe ser un texto')
      .trim()
      .notEmpty().withMessage('titular es requerido'),
    body('expiracion')
      .isString().withMessage('expiracion debe ser un texto')
      .matches(/^(0[1-9]|1[0-2])\/\d{4}$/).withMessage('expiracion debe tener formato MM/AAAA'),
    body('cvv')
      .isString().withMessage('cvv debe ser un texto')
      .matches(/^\d{3,4}$/).withMessage('cvv debe tener 3 o 4 dígitos'),
  ],
  controller.createCard
);

module.exports = router;
