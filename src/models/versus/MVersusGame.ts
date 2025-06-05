import { randomUUID } from 'crypto';
import { DEFAULT_CHOICE_COUNT } from '@/types/VersusTypes';
import mongoose from 'mongoose';
import MFile from '../file/MFile';

const { Schema } = mongoose;

const choiceSchema = new Schema({
  _id: {
    type: String,
    required: false,
    default: randomUUID,
  }, // api에서 게임 생성 시 id 생성
  gameId: {
    type: String,
    required: false,
  },
  title: {
    type: String,
    required: false,
  },
  content: {
    type: String,
    default: '',
  },
  voteCount: {
    type: Number,
    default: 0,
  },
});

const schema = new Schema(
  {
    nanoId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      default: '',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    images: {
      type: [MFile.schema],
      default: [],
    },
    privacyType: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      required: true,
      default: 0,
    },
    favs: {
      type: Number,
      required: true,
      default: 0,
    },
    answerCount: {
      type: Number,
      required: true,
      default: 0,
    },
    state: {
      type: Number,
      required: true,
      default: 0,
    },
    choices: [choiceSchema],
    choiceCount: {
      type: Number,
      required: true,
      default: DEFAULT_CHOICE_COUNT,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },

    // 연관 게임 업데이트 당시 조회수 (자주 업데이트 하는걸 방지)
    relatedUpdateViewCount: {
      type: Number,
      default: 0,
    },
    // 연관 게임 id 배열
    relatedGameIds: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
).index(
  {
    title: 'text',
    content: 'text',
    'choices.title': 'text',
  },
  {
    weights: {
      title: 5,
      content: 4,
      'choices.title': 1,
    },
  },
);

// schema.virtual("user", {
//     ref: "users",
//     localField: "userId",
//     foreignField: "_id",
//     justOne: true
// })

export default mongoose.models.versus_games || mongoose.model('versus_games', schema);

// String Number Date Buffer Boolean Mixed ObjectId Array
