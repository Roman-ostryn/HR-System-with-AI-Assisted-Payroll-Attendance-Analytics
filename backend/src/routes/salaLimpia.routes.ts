import { Router } from "express";

import { getOneDescuento, updateDescuento } from "../controllers/descuento.controllers";
import { descuentoValidate } from "../validators/descuento.validation";

import { clienteValidate } from "../validators/cliente.validation";
import { createCliente, getCliente } from "../controllers/cliente.controllers";
import { createSala, getSala } from "../controllers/salaLimpia.controllers";
import { salaValidate } from "../validators/salaLimpia.validation";


const router = Router()
router.post("/salaLimpia",salaValidate, createSala);
router.post("/salaLimpia/fecha", getSala);
router.get("/descuento/:id", getOneDescuento);
router.put("/descuento/:id", descuentoValidate, updateDescuento);
// router.delete("/garden/:id", deleteGarden);


export default router;