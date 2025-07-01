import { Router } from "express";
import { createPrecio, getPrecio, getOnePrecio, updatePrecio, getPrecioProducto } from "../controllers/precio.controllers";
import { precioValidate } from "../validators/precio.validation";


const router = Router()
router.post("/precio", createPrecio);
router.get("/precio", getPrecio);
router.get("/precioProducto/:pais/:producto", getPrecioProducto);
// router.get("/garden/viewActivity", getActivity);
router.get("/precio/:id", getOnePrecio);
router.put("/precio/:id", precioValidate, updatePrecio);
// router.delete("/garden/:id", deleteGarden);


export default router;