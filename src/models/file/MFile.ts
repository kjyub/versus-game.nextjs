import mongoose from "mongoose"

const { Schema } = mongoose

const schema = new Schema(
    {
        url: {
            type: String,
            required: true,
        },
        fileName: {
            type: String,
            required: true,
        },
        size: {
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

export default mongoose.models.files || mongoose.model("files", schema)

// String Number Date Buffer Boolean Mixed ObjectId Array
