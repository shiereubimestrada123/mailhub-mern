import { check } from 'express-validator';

export const registerValidations = [
  check(['firstName', 'lastName'], 'Name is not valid')
    .exists()
    .matches(/^[a-zA-Z ]+$/),
  check('middleName', 'Name is not valid')
    .optional({ nullable: true, checkFalsy: true })
    .matches(/^[a-zA-Z ]+$/),
  check('email', 'Email is not valid').exists().isEmail(),
  check('password').notEmpty().withMessage('Password is required'),
  check('confirmPassword')
    .notEmpty()
    .withMessage('Confirm password is required'),
  check('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),
];
