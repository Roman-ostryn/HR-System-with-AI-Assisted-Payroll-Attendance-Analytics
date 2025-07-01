import { Router } from "express";
import { createAdelanto } from "../controllers/adelanto.controllers";


const router = Router()
router.post("/adelanto", createAdelanto);

export default router;