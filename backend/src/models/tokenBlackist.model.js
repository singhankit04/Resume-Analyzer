import mongoose from 'mongoose';

const tokenBlacklistSchema = new mongoose.Schema({
    token:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:60*60*24*7,
    }
})

export const tokenBlacklist = new mongoose.model("tokenBlacklist", tokenBlacklistSchema);