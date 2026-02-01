import multer from 'multer'

let storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        const start = process.env.NODE_ENV === 'production' ? '/tmp' : './public'; 
        cb(null,start)
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
});
 let upload = multer({storage})

 export default upload
