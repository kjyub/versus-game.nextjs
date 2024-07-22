import mongoose from "mongoose"

const { Schema } = mongoose

const schema = new Schema(
    {
        parentId: {
            type: String,
            required: false,
            default: null,
        },
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
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            default: function() {
                return this.userId
            }
        },
        content: {
            type: String,
            required: true,
            default: "",
        },
        voteUps: {
            type: Number,
            required: true,
            default: 0,
        },
        voteDowns: {
            type: Number,
            required: true,
            default: 0,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
)

export default mongoose.models.versus_game_comments ||
    mongoose.model("versus_game_comments", schema)

// String Number Date Buffer Boolean Mixed ObjectId Array
