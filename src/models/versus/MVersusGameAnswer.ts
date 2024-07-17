import mongoose from "mongoose"

const { Schema } = mongoose

const schema = new Schema(
    {
        gameId: {
            type: String,
            required: true,
        },
        gameChoiceId: {
            type: String,
            required: true,
        },
        userId: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
)

export default mongoose.models.versus_game_answers ||
    mongoose.model("versus_game_answers", schema)

// String Number Date Buffer Boolean Mixed ObjectId Array
