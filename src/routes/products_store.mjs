import { Router } from "express";
import { checkRolAdmin } from "../middleware/checkRol.mjs";
import { getListProducts, setImagesCloudinary, upload_Product } from "../controllers/products_store_controllers.mjs";
import { upload_Images } from "../middleware/multer.mjs";

export const router = Router();

router.get('/list/products', getListProducts);

router.post('/new/item', checkRolAdmin, upload_Product);

router.post('/upload/photos/:id', checkRolAdmin, upload_Images.array('images'), setImagesCloudinary)

