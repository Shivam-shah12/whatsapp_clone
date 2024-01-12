
// import { addMessage, getMessage } from "../controllers/MessageController";
import { addMessage,getMessage,addImageMessage, addAudioMessage ,getInitialContactswithMessages,addDocumentMessage} from "../controllers/MessageController.js";
import { Router } from "express";
import multer from "multer"
const router=Router();
const uploadRecording=multer({dest:"uploads/recordings"})
const uploadImage=multer({dest:"uploads/images"})
const uploadDocument=multer({dest:"uploads/document"})

router.post("/add-message",addMessage)
router.get("/get-message/:from/:to",getMessage)
router.post("/add-image-message",uploadImage.single("image"),addImageMessage);
router.post("/add-document-message",uploadDocument.single("document"),addDocumentMessage)
router.post("/add-audio-message",uploadRecording.single("audio"),addAudioMessage);
router.get("/get-initial-contacts/:from",getInitialContactswithMessages);
export default router;