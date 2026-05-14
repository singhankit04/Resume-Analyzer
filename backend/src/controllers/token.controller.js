import { getBlacklistToken } from "../dao/token.dao.js";
import { cookieOption } from "../utils/cookies.utils.js";

import { rotateToken, verifyRefreshToken } from "../utils/jwtToken.js";

export const getNewAccessToken = async (req, res) => {

    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
    if(await getBlacklistToken(refreshToken)){
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
    const decoded = await verifyRefreshToken(refreshToken);
    if(!decoded){
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
   
    const{newAccessToken, newRefreshToken}= await rotateToken(refreshToken, decoded.id);

    res.cookie("refreshToken", newRefreshToken, cookieOption);
    res.status(200).json({
        message: "Access Token Generated Successfully",
        newAccessToken
    })
}