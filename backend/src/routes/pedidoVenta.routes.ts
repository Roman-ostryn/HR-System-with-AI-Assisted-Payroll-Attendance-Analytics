import { Router } from "express";

import { pedidoVentaValidate } from "../validators/pedidoVenta.validation";
import { createCargaPedido, createPedidoVenta, getCargamento, getLiberarCamion, getOneCargaPedido, getOneChapas, getOnePedidoVenta, getPedidoVenta, getPedidoVentaLiberar, getProductoInterfoliacion, updateCamiones, updatePedido, updateSalidaStock, updateVentaStock } from "../controllers/pedidoVenta.controllers";
import { cargaPedidoValidate } from "../validators/cargaPedido.validation";
// import getOneChapa from "../services/pedidoVenta/getOneChapas.services";


const router = Router()
router.post("/pedidoVenta",pedidoVentaValidate, createPedidoVenta);
router.post("/cargaPedido",cargaPedidoValidate, createCargaPedido);
router.get("/pedidoVenta", getPedidoVenta);
router.get("/liberarCamiones", getLiberarCamion);
router.get("/pedidoVentaLiberar", getPedidoVentaLiberar);
router.get("/cargamento", getCargamento);
router.get("/pedidoVenta/:id", getOnePedidoVenta);
router.get("/camionChapas/:id", getOneChapas);
router.get("/productoInterfoliacion/:colar/:serie", getProductoInterfoliacion);
router.get("/camionCarga/:chapa", getOneCargaPedido);
router.put("/pedidoVenta/:id", updatePedido);
router.put("/camiones/:id", updateCamiones);
router.put("/ventaStock/:id", updateVentaStock);
router.put("/salidaStock/:id", updateSalidaStock);
// router.delete("/garden/:id", deleteGarden);

export default router; 