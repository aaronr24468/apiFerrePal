import { getAllProducts, insert_New_Product, upload_Image_product } from "../models/products_store_models.mjs"
import { AppError } from "../services/appError.mjs"
import cloudnary from '../services/cloudnary.mjs'

export const getListProducts = async (req, res, next) => {
    try {
        const products = await getAllProducts();
        if (products.length === 0) throw new AppError('Aun no tienes productos', 404);

        products.forEach((element) =>{
            if(element.images.length > 0){
                const arrImages = element.images.split(',')
                element.images = arrImages
            }
            
        })

        res.json({ ok: true, message: 'Sucess', products: products })
    } catch (error) {
        next(error)
    }
}

export const upload_Product = async (req, res, next) => {
    try {
        const data = {
            codigo_barras: req.body.codigo_barras,
            sku: req.body.sku,
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            categoria: req.body.categoria,
            categoria_ferreteria: req.body.categoria_ferreteria,
            marca: req.body.marca,
            precio: req.body.precio,
            costo: req.body.costo,
            stock: req.body.stock,
            stock_minimo: req.body.stock_minimo,
            unidad_medida: req.body.unidad_medida,
        }
        const info = await insert_New_Product(data);

        if (info.affectedRows === 0) throw new AppError('Error al subir producto', 403);

        const id_product = info.insertId;

        res.json({ ok: true, message: 'Success', id: id_product })
    } catch (error) {

    }
}

export const setImagesCloudinary = async (req, res, next) => {
    try {
        const files = req.files
        const id_product = req.params.id

        files.forEach(async (element, index) => {
            const result = await new Promise((resolve, reject) => {
                cloudnary.v2.uploader.upload_stream(
                    {
                        folder: 'FerrePal',
                        overwrite: true,
                        public_id: `Ferrepal_${element.originalname}_${id_product}`
                    },
                    (err, result) => {
                        if (err) reject(err)
                        else resolve(result)
                    }
                ).end(element.buffer)
            })

            const data = {
                id: id_product,
                url: result.secure_url
            }

            const info = await upload_Image_product(data);

            if(!info) throw new AppError(`Error al subir la imagen ${element.originalname}`, 403)

        })

        res.json({ ok: true, message: 'success' })
    } catch (error) {

    }
}

export const getPriceCredit = async(req, res, next) =>{
    try {   
        const data = req.body;
        let total = 0.00;
        data.list.forEach((item) =>{
            if(item.unidad_medida === "pieza"){
                total = total + (Number(item.precio) * Number(item.quantity))
            }else{
                total = total + (Number(item.precio) * Number(item.kg))
            }
        })
        res.json({ok: true, message: 'success', amount: total});
    } catch (error) {
        next(error)
    }
}