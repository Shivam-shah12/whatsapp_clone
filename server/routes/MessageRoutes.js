
// import { addMessage, getMessage } from "../controllers/MessageController";
import { addMessage,getMessage,addImageMessage, addAudioMessage ,getInitialContactswithMessages} from "../controllers/MessageController.js";
import { Router } from "express";
import multer from "multer"
const router=Router();
const upload=multer({dest:"uploads/recordings"})
const uploadImage=multer({dest:"uploads/images"})

router.post("/add-message",addMessage)
router.get("/get-message/:from/:to",getMessage)
router.post("/add-image-message",uploadImage.single("image"),addImageMessage);
router.post("/add-audio-message",upload.single("audio"),addAudioMessage);
router.get("/get-initial-contacts/:from",getInitialContactswithMessages);
export default router;