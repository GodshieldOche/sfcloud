import express from 'express';
import { signUpController, signInController, currentUserController, signOutController } from '../controllers/authController';
import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validate-request';
import { currentUser } from '../middlewares/current-user';



const router = express.Router()



router.post('/signup', [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
        .trim()
        .isLength({ min: 6, max: 20 })
        .withMessage('Password must be between 6 and 20 characters')
],
    validateRequest,
    signUpController
)


router.post('/signin', [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('ou must supply a password')
],
    validateRequest,
    signInController
)


router.get('/currentuser', currentUser, currentUserController)

router.post('/signout', signOutController)




export { router as authRouter }