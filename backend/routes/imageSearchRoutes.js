const express = require('express');
const router = express.Router();
const { searchByImage } = require('../controllers/imageSearchController');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

router.post('/image', upload.single('image'), searchByImage);

module.exports = router;

