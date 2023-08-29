const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
require('dotenv').config();
const { PORT } = process.env;

const app = express();
const port = PORT;

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use('/images', express.static(path.join(__dirname, 'images')));




const storage = multer.diskStorage({
  destination: './images/',
  filename: (req, file, cb) => {
    const customFilename = decodeURIComponent(file.fieldname) + '-' + req.body.id + path.extname(file.originalname);
    cb(null, customFilename);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }  // 50 MB
});


app.listen(port, () => {
  console.log(`server start on ${port}`);
});


//image upload
app.post('/dpUpload', upload.any(), (req, res) => {
  let filesInfo = [];
  if (req.files) {
    filesInfo = req.files.map(file => {
      return {
        filename: file.filename
      };
    });
  }
  res.send({
    status : 201,
    message : 'upload success',
    filesInfo : filesInfo
  });
});



//get image
app.get('/image', (req, res) => {
  const filename = req.query.filename;

  if (!filename) {
    return res.status(400).send('Filename is required');
  }

  const imagePath = path.join(__dirname, 'images', filename);
  console.log('send image');
  res.sendFile(imagePath, err => {
    if(err) {
      return res.status(404).send('Image not found');
    }
  });
});

