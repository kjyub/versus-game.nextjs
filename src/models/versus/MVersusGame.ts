import { ThumbnailImageTypes } from "@/types/VersusTypes"
import { randomUUID } from "crypto"
import mongoose from "mongoose"

const { Schema } = mongoose

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
        thumbnailImageType: {
            type: Number,
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
        choiceCountType: {
            type: Number,
            required: true,
            default: 200,
        },
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
