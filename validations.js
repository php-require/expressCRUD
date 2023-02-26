import {body} from "express-validator";

export const LoginValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен быть минимум 5 символов').isLength({min: 5}),
];

export const reristerValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен быть минимум 5 символов').isLength({min: 5}),
  body('fullname', 'Имя должено быть минимум 3 символа').isLength({min: 3}),
  body('avatarUrl', 'Неверная ссылка на аватарку').optional().isURL(),
];

export const postCreateValidation = [
  body('title', 'Введите заголовок').isLength({min: 3}).isString(),
  body('text', 'Введите текст статьи').isLength({min: 10}).isString(),
  body('tags', 'Неверный формат тегов (укажите массив)').optional().isString(),
  body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
];