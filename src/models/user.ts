import { Model, model, Schema } from 'mongoose';

type User = {
  about: string;
  avatar: string;
  name: string;
};

const userSchema = new Schema<User>({
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
  name: {
    default: 'Жак-Ив Кусто',
    maxlength: 30,
    minlength: 2,
    required: true,
    type: String,
  },
});

export default model<User, Model<User>>('user', userSchema);
