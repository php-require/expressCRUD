import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from '../models/User.js'

export const register =  async (req, res) => {
 try {
 

  const password = req.body.password;
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const doc = new UserModel({
    email:req.body.email,
    fullname:req.body.fullname,
    avatarUrl:req.body.avatarUrl,
    passwordHash:hash,
  })

  const user = await doc.save()

  const token = jwt.sign(
    {
    _id: user._id
    }, 
    'secret123',
    {
      expiresIn: '30d',
    }
  )
  
  const {passwordHash, ...userData} = user._doc;
  res.json({
    ...userData,
    token
  });

 } catch (err) {
    console.log(err);
    res.status(500).json({
      massage:'Не удалось зарегистрироваться',
    })
 }
}

export const login =  async (req, res) => { 
  try {
    const user = await UserModel.findOne({email: req.body.email})
    if(!user) {
      return res.status(404).json({
        message:'Пользователь в базе не найден!',
      })
    }

  const isValidePass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
  if(!isValidePass) {
    return res.status(400).json({
      message:'Неверный логин или пароль!',
    })
  }

  const token = jwt.sign(
    {
    _id: user._id
    }, 
    'secret123',
    {
      expiresIn: '30d',
    }
  )
  const {passwordHash, ...userData} = user._doc;

  res.json({
    ...userData,
    token
  });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      massage:'Не удалось авторизоваться!',
    })
  }
};

export const getMe = async(req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if(!user) {
      return res.status(404).json({
        message:"Пользователь не найден"
      }) 
    }

    const {passwordHash, ...userData} = user._doc;
    res.json(userData);
    
  } catch (err) {
    console.log(err);
    res.status(500).json({
      massage:'Нет доступа',
    })
  }
};
 