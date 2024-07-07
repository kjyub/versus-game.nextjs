import mongoose from "mongoose"

const { Schema } = mongoose

const choiceSchema = new Schema({
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
        default: "",
    },
    imageId: {
        type: String,
    },
    imageUrl: {
        type: String,
    },
    voteCount: {
        type: Number,
        default: 0,
    },
})

const schema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            default: "",
        },
        userId: {
            type: String,
            required: true,
        },
        thumbnailImageId: {
            type: String,
        },
        thumbnailImageUrl: {
            type: String,
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
        choices: [choiceSchema],
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
)

export default mongoose.models.versus_games ||
    mongoose.model("versus_games", schema)

// String Number Date Buffer Boolean Mixed ObjectId Array
