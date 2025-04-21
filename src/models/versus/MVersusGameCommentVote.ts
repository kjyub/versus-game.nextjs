import mongoose from 'mongoose'

const { Schema } = mongoose

const schema = new Schema(
  {
    commentId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    voteType: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true },
)

export default mongoose.models.versus_game_comment_vote || mongoose.model('versus_game_comment_vote', schema)

// String Number Date Buffer Boolean Mixed ObjectId Array
