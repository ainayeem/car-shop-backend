import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { ProductControllers } from "./product.controller";
import { productValidations } from "./product.validation";

const router = express.Router();

router.post("/create-product", validateRequest(productValidations.createProductValidationSchema), ProductControllers.createProduct);

router.get("/", ProductControllers.getAllProducts);

router.get("/:id", ProductControllers.getSingleProduct);

router.patch("/:id", validateRequest(productValidations.updateProductValidationSchema), ProductControllers.updateProduct);

router.delete("/:id", ProductControllers.deleteProduct);

export const ProductRoutes = router;
