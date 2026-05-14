import { verifyAccessToken } from "../utils/jwtToken.js";

export const authMiddleware = async (req, res, next) => {
    try {
        const accessToken = req.headers.authorization?.split(" ")[1];
        if (!accessToken) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }
        const decodedToken = await verifyAccessToken(accessToken);
        req.user = decodedToken;
        next();

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

