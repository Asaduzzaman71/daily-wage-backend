const multer = require("multer");
const path = require("path");
const createError = require("http-errors");
const { nextTick } = require("process");
const fs = require("fs");


// File upload folder
const UPLOADS_FOLDER = `${__dirname}/../public/images/`;

var folder = './public/images';
  
if (!fs.existsSync(folder)){
    fs.mkdirSync(folder,{ recursive: true });
}


// define the storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
    cb(null, UPLOADS_FOLDER);
    },
    filename: (req, file, cb) => {
    	const fileExt = path.extname(file.originalname);
    	const fileName =
			file.originalname
			.replace(fileExt, "")
			.toLowerCase()
			.split(" ")
			.join("-") +"-"+Date.now();
		cb(null, fileName + fileExt);
    },
});

// preapre the final multer upload object
const upload = multer({
    	storage: storage,
    	limits: {
    	fileSize: 2000000, // 1MB
    },
    fileFilter: (req, file, cb) => {
        if (file.fieldname === "images" || file.fieldname === "profile_pic") {
            if ( file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
                cb(null, true);
            }else {
				cb(createError(400, "Only .jpg, .png or .jpeg format allowed!"));
            }
        }else{
			cb(createError("There was an unknown error!"));
        }
    },
});

module.exports = upload;
