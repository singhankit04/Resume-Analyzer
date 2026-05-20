import { getUser, createUser} from "../dao/user.dao.js";
import { cookieOption } from "../utils/cookies.utils.js";
import { createAccessToken, createRefreshToken } from "../utils/jwtToken.js";

export const register = async (req, res) => {
    try {

        const { name, email, password } = req.body;
        if (await getUser(email)) {
            return res.status(400).json({
                message: "User already exists"
            })
        }

        const newUser = await createUser(name, email, password);

        const refreshToken = createRefreshToken(newUser._id);
        const accessToken = createAccessToken(newUser._id);

        res.cookie("refreshToken", refreshToken, cookieOption);
        res.status(200).json({
            message: "User Created Successfully",

            accessToken
        })


    } catch (error) {
        res.status(500).json({

            message: error.message
        })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await getUser(email);
      
        if (!user || !(await user.isPasswordValid(password))) {
            return res.status(401).json({
                message: "Invalid Credentials"
            })
        }


        const refreshToken = createRefreshToken(user._id);
        const accessToken = createAccessToken(user._id);

        res.cookie("refreshToken", refreshToken, cookieOption);
        res.status(200).json({
            message: "User Logged In Successfully",
            accessToken
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}