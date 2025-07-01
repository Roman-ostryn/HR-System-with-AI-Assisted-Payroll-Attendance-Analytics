import { Router } from "express";
// import { createGarden, deleteGarden, getActivity, getGarden, getOneGarden, updateGarden } from "../controllers/garden.controllers";
// import { validateGarden } from "../validators/garnden.validation";
// import { createCategory, getCategory } from "../controllers/category.controllers";
import { userValidate} from "../validators/user.validation";
// import { createBrand, getBrand } from "../controllers/brand.controllers";
import { createUser, getOneUser, getUsers } from "../controllers/user.controllers";
import { createMarcacion, createSanciones, getMarcacion, getMarcacionView, getOneMarcacion, getResumenView, getSancionesView, updateMarcacion, saveOvertimeActivation } from "../controllers/marcacion.controllers";

const router = Router()
router.post("/marcacion", createMarcacion);
router.post("/sanciones", createSanciones);
router.post("/marcacion/setapprove", saveOvertimeActivation);
router.get("/marcacion", getMarcacion);
router.get("/marcacion/ResumenView", getResumenView);
router.get("/sanciones/sancionesView", getSancionesView);
router.get("/marcacion/MarcacionView", getMarcacionView);
router.get("/marcacion/:id", getOneMarcacion);
router.put("/marcacion/:id", updateMarcacion);
// router.delete("/garden/:id", deleteGarden);


export default router;