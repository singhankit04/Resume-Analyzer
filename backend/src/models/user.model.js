import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
    },

    name: {
        type: String,
        required: [true, "Name is required"]
    },

    email: {
        type: String,
        unique:true,
        required: [true, "Email is required"]
    },

    password: {
        type: String,
        select: false
    }
})

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods.isPasswordValid = async function (candidatePassword) {
    if (typeof candidatePassword !== 'string' || typeof this.password !== 'string') {
        return false;
    }
    return await bcrypt.compare(candidatePassword, this.password)
}

userSchema.methods.toJSON = function () {
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
};

export const User = mongoose.model("user", userSchema)