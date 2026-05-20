import jwt from "jsonwebtoken"

import { makeTokenBlacklist } from "../dao/token.dao.js"


export const createAccessToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" })
}

export const createRefreshToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" })
}

export const verifyAccessToken = async (token) => {
    try {

        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );

        return decoded;

    } catch (error) {

        console.log(error.name);
        console.log(error.message);

    }
}

export const verifyRefreshToken = async (token) => {
    try {

        const decoded = jwt.verify(
            token,
            process.env.REFRESH_TOKEN_SECRET
        );

        return decoded;

    } catch (error) {
        console.log(error.name);
        console.log(error.message);
    }
}

export const rotateToken = async(refreshToken, id)=>{
    await makeTokenBlacklist(refreshToken);
    const newAccessToken = createAccessToken(id);
    const newRefreshToken = createRefreshToken(id);
   
    return{newAccessToken, newRefreshToken} ;

}
