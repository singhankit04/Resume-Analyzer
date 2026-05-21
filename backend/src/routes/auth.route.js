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

    res.redirect(`http://localhost:5173/oauth-success?token=${accessToken}&user=${encodeURIComponent(JSON.stringify(user))}`);
  }
);





import { authMiddleware } from '../middlewares/auth.middleware.js';
import { getUserById } from '../dao/user.dao.js';

authRouter.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user: { name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default authRouter;
