import { model, Schema } from 'mongoose';

type Card = {
  createdAt: Date;
  likes: Schema.Types.ObjectId[];
  link: string;
  name: string;
  owner: Schema.Types.ObjectId;
};

const cardSchema = new Schema<Card>({
  createdAt: {
    default: Date.now(),
    type: Date,
  },
  likes: [
    {
      default: [],
      ref: 'user',
      type: Schema.Types.ObjectId,
    },
  ],
  link: {
    required: true,
    type: String,
    validate: {
      message: 'Некорректная ссылка',
      validator(link: string) {
        const regexp =
          /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;
        return regexp.test(link);
      },
    },
  },
  name: {
    maxlength: 30,
    minlength: 2,
    required: true,
    type: String,
  },
  owner: {
    ref: 'user',
    required: true,
    type: Schema.Types.ObjectId,
  },
});

export default model<Card>('card', cardSchema);
