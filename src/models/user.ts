import { compare } from 'bcrypt';
import { Document, Model, model, Schema } from 'mongoose';
import isEmail from 'validator/lib/isEmail';

import { AuthError } from '../errors';

export type User = {
  about: string;
  avatar: string;
  email: string;
  name: string;
  password: string;
};

interface UserModel extends Model<User> {
  findUserByCredentials: (
    email: string,
    password: string,
  ) => Promise<Document<unknown, unknown, User>>;
}

const userSchema = new Schema<User, UserModel>({
  about: {
    default: 'Исследователь',
    maxlength: 30,
    minlength: 2,
    required: true,
    type: String,
  },
  avatar: {
    default:
      'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    required: true,
    type: String,
    validate: {
      message: 'Некорректная ссылка на фото профиля',
      validator(avatar: string) {
        const regexp =
          /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;
        return regexp.test(avatar);
      },
    },
  },
  email: {
    required: true,
    type: String,
    unique: true,
    validate: {
      message: 'Email некорректен',
      validator: (str: string) => isEmail(str),
    },
  },
  name: {
    default: 'Жак-Ив Кусто',
    maxlength: 30,
    minlength: 2,
    required: true,
    type: String,
  },
  password: {
    required: true,
    select: false,
    type: String,
  },
});

userSchema.static(
  'findUserByCredentials',
  async function findUserByCredentials(email: string, password: string) {
    const user = await this.findOne({ email }).select('+password');

    if (!user) {
      throw new AuthError('Неправильные почта или пароль');
    }

    const hasMatch = await compare(password, user.password);

    if (!hasMatch) {
      throw new AuthError('Неправильные почта или пароль');
    }

    return user;
  },
);

export default model<User, UserModel>('user', userSchema);
