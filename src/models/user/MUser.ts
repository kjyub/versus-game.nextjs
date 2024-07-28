import mongoose from "mongoose"

const { Schema } = mongoose

const userSchema = new Schema(
    {
        email: {
            type: String,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            required: false,
        },
        name: {
            type: String,
            required: true,
            default: "",
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
)

export default mongoose.models.users || mongoose.model("users", userSchema)

// String Number Date Buffer Boolean Mixed ObjectId Array
