import { tokenBlacklist } from "../models/tokenBlackist.model.js"

export const makeTokenBlacklist= async(token)=>{
    await tokenBlacklist.create({token})
}
export const getBlacklistToken = async(token)=>{
    return await tokenBlacklist.findOne({token})
}