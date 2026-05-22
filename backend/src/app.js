import express from 'express'
import cors from 'cors';
import reportRouter from './routes/report.route.js'
import authRouter from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import "./config/passport.js";
import passport from 'passport';



const app = express()

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())
app.use(passport.initialize());

app.use("/api", reportRouter);
app.use("/auth", authRouter)


export default app;