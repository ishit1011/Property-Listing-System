import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {type: String, unique: true},
    password: {type: String, required: true},
    favourites: [{type: mongoose.Schema.Types.ObjectId, ref: "Property"}],
    recommendations: [{type: mongoose.Schema.Types.ObjectId, ref: "Property"}]
})


export const User = mongoose.model("User",userSchema);