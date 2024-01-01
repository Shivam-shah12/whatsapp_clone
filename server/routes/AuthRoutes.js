import { checkUser, getAllUser, onBoardUser } from '../controllers/AuthController.js';
import { generateToken } from '../controllers/AuthController.js';
import {Router} from 'express'
const router=Router();

router.post('/check-user',checkUser);
router.post('/onboard-user',onBoardUser);
router.get("/get-contacts",getAllUser);
router.get("/generate-token/:userId",generateToken);

export default router;