import mongoose from 'mongoose';

const { Schema } = mongoose;

const schema = new Schema(
  {
    gameId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.models.versus_game_views || mongoose.model('versus_game_views', schema);

// String Number Date Buffer Boolean Mixed ObjectId Array
