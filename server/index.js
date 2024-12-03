const express = require('express')
const app = express()
const bodyParser = require('body-parser')// For receive data from form
const multer = require('multer');//For upload package
const path = require('path')// extract extension from originalfilename


//CORS uploadfile in folder should return header
const cors = require('cors')
app.use(cors())

// Access to XMLHttpRequest at 'http://localhost:8000/upload' 
// from origin 'http://localhost:3000' has been blocked by CORS policy: No 
// 'Access-Control-Allow-Origin' header is present on the requested resource.


app.use(express.static('./public'))
app.use(bodyParser.json())

//Use of Multer package
let storage = multer.diskStorage({ //this func return storage engine
    destination:(req,file,cb)=>{
        cb(null,'./public/image')//Way to store the image
    },
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+'_'+Date.now()+path.extname(file.originalname))//Modify file name
    }
})
let maxSize = 2 * 1000 * 1000
let upload = multer({
    storage : storage,
    limits :{
        fileSize:maxSize
    }
})
    
let uploadHandler = upload.single('file')//From react side file input name

app.post('/upload', (req, res) => {
    uploadHandler(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            if (err.code == 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ message: "Maximum size exceeded" });
            }
            return;
        }
        if (!req.file) {
            return res.status(400).json({ message: "No file" });
        }

        // Extract additional form data from req.body
        const { title, instructions, ingredients } = req.body;

        if (!title || !instructions || !ingredients) {
            return res.status(400).json({ message: "All fields are required" });
        }

        res.status(200).json({
            message: "Success --- File Uploaded to Server",
            data: {
                fileName: req.file.filename,
                title,
                instructions,
                ingredients
            }
        });
    });
});


const port = process.env.PORT || 8000
app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
    
})