const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
require('dotenv').config();
const { PORT } = process.env;

const app = express();
const port = PORT;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/images', express.static(path.join(__dirname, 'images')));


const storage = multer.diskStorage({
  destination: './images/',
  filename: (req, file, cb) => {
    const customFilename = req.body.user + '-' + Date.now() + path.extname(file.originalname);
    cb(null, customFilename);
  }
});

const upload = multer({ storage: storage });


app.listen(port, () => {
  console.log(`server start on ${port}`);
});


//image upload
app.post('/upload', upload.single('image'), (req, res) => {
  console.log(req.body.user + ' image uploaded');
  res.send('Image uploaded successfully');
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

