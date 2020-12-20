const router = require('express').Router();
const { body, param, header } = require('express-validator');

const {
  expressValidatorHandler,
  isAdminExist,
  isMainAdmin,
  usefulBody
} = require('../utils/middleware');
const { adminController } = require('../controller/admin.controller');

router.post(
  '/auth',
  [
    body('user').isString().withMessage('Field user has to be a valid string'),
    body('password').isLength({ min: 8 }).withMessage('Field password has to be at least 8 chars')
  ],
  expressValidatorHandler,
  usefulBody(['user', 'password']),
  adminController.authAdmin
);
router.get(
  '/active',
  [header('authorization').isJWT().withMessage('Authorization has wrong token')],
  expressValidatorHandler,
  isAdminExist,
  adminController.getAdmins
);
router.get(
  '/history',
  [header('authorization').isJWT().withMessage('Authorization has wrong token')],
  expressValidatorHandler,
  isAdminExist,
  adminController.getAdminsHistory
);
router.get(
  '/main',
  [header('authorization').isJWT().withMessage('Authorization has wrong token')],
  expressValidatorHandler,
  isAdminExist,
  isMainAdmin,
  adminController.getAdmin
);
router.post(
  '/',
  [
    header('authorization').isJWT().withMessage('Authorization has wrong token'),
    body('password').isLength({ min: 8 }).withMessage('Field password has to be at least 8 chars')
  ],
  expressValidatorHandler,
  isAdminExist,
  isMainAdmin,
  usefulBody(['password']),
  adminController.createAdmin
);
router.put(
  '/main',
  [
    header('authorization').isJWT().withMessage('Authorization has wrong token'),
    body('name').isString().withMessage('Field name has to be a valid string'),
    body('password').isLength({ min: 8 }).withMessage('Field password has to be at least 8 chars')
  ],
  expressValidatorHandler,
  isAdminExist,
  isMainAdmin,
  usefulBody(['password', 'name']),
  adminController.updateAdmin
);
router.delete(
  '/active/:name',
  [
    header('authorization').isJWT().withMessage('Authorization has wrong token'),
    param('name').isUUID(4).withMessage('Field name has to be a valid uuid')
  ],
  expressValidatorHandler,
  isAdminExist,
  isMainAdmin,
  adminController.deleteAdmin
);

module.exports = { router };
