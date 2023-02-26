import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import {reristerValidation, LoginValidation, postCreateValidation} from './validations.js';
import {checkAuth, handleValidationErrors} from "./utils/index.js";
import {PostController, UserController} from  "./controllers/index.js";

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://test:1234@89.223.123.167/blog')
.then(()=> {console.log('DB ok')})
.catch((err)=> {console.log('DB error', err)})

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({storage})

app.use(express.json());
app.use('/uploads', express.static('uploads'))

app.get('/', (req, res) => {
  res.send('hel w111333');
})

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url:`/uploads/${req.file.originalname}`,
  })
});

app.post('/auth/login', LoginValidation, handleValidationErrors, UserController.login);

app.post('/auth/register', reristerValidation, handleValidationErrors, UserController.register);

app.get('/auth/me', checkAuth, UserController.getMe);

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);

app.listen(444, (err) => {
  if(err) {
    return console.log(err);
  }
  console.log('server ok')
})