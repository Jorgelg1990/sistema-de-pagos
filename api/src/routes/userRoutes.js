const { Router } = require('express');
const { body } = require('express-validator');
const controller = require('../controllers/userController');

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
  controller.createUser
);

module.exports = router;
