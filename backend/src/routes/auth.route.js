import {Router} from 'express';
import { getNewAccessToken } from '../controllers/token.controller.js';
import { login, register } from '../controllers/auth.controller.js';
import passport from "passport";
import { createAccessToken, createRefreshToken } from '../utils/jwtToken.js';
import { cookieOption } from '../utils/cookies.utils.js';


const authRouter = Router();


authRouter.post("/register", register)
authRouter.post("/login", login)
authRouter.post("/refresh", getNewAccessToken)


authRouter.get(
  "/google",

  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

authRouter.get(
  "/google/callback",

  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),

  async (req, res) => {
     const user = req.user;

    const accessToken = createAccessToken(user._id);

    const refreshToken = createRefreshToken(user._id);

    await user.save();
    
    res.cookie("refreshToken", refreshToken, cookieOption);

    res.status(200).json({
      message: "Login Success",
      accessToken,
      user: req.user,
    });
  }
);





export default authRouter;
