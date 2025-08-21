import express from 'express';
import { saveForm,getForms } from '../controllers/form.controller.js';

const router=express.Router();

router.post("/submit",saveForm);
router.get("/all",getForms);

export default router;