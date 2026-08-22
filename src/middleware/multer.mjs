import multer from "multer";

export const upload_Images = multer({
    storage: multer.memoryStorage(),
    limits: {fieldSize: 5 * 1024 * 1024},
    fileFilter: (req, file, cb) =>{
        console.log(file.mimetype)
        if(!file.mimetype.startsWith('image/')){
            cb(new Error('Solo imagenes'), false)
        }
        cb(null, true)
    }
})