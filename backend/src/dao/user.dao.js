import { User } from "../models/user.model.js"

export const createUser = async (name, email, password) => {
    return await User.create({ name, email, password })
} 
export const getUser = async (email) => {
    return await User.findOne({ email }).select("+password")
}

export const getUserById = async (id) => {
    return await User.findById(id);
}

