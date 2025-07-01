import { Router } from "express";
import { getOneDescuento, updateDescuento } from "../controllers/descuento.controllers";
import { descuentoValidate } from "../validators/descuento.validation";
import { entradaNotalFiscalValidate } from "../validators/entradaNotalFiscal.validation";
import { createEntradaNotalFiscal, getEntradaNotalFiscal, getOneNotaFiscal, getOneStock, getOneStockPVB } from "../controllers/entradaNotaFiscal.controllers";


const router = Router()
router.post("/entradaNotaFiscal",entradaNotalFiscalValidate, createEntradaNotalFiscal);
router.get("/entradaNotaFiscal", getEntradaNotalFiscal);
router.get("/notaFiscal/:nota", getOneNotaFiscal);
router.get("/stockNotaFiscal/:id", getOneStock);
router.get("/stockNotaFiscalPVB/:id", getOneStockPVB);
router.put("/descuento/:id", descuentoValidate, updateDescuento);
// router.delete("/garden/:id", deleteGarden);


export default router;