import { user } from "../models/user.model.js"

export const createUser = async (name, email, password) => {
    return await user.create({name, email, password})
}
export const getUser = async (email) => {
    return await user.findOne({email})
}