const cloudinary = require('cloudinary').v2;
const multer = require('multer')
require('dotenv').config()

const storage = multer.memoryStorage();
const upload = multer({ storage: storage})

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET
})

module.exports = {
    cloudinary,
    upload
}